const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/projectDetails/:id', (req, res) => {
    const projectId = req.params.id;
    const query = `    SELECT *,
    (
        SELECT coalesce(json_agg(item), '[]'::json) FROM (
            SELECT * FROM "tasks" WHERE "tasks".project_id="project"."id" ORDER BY "priority", "due_time"
        ) item
    ) AS tasks
    FROM "project"
    WHERE "id" = $1
    ORDER BY due_time;`
    pool.query(query, [projectId])
        .then(result => {
            res.send(result.rows[0]);
        })
        .catch((error) => {
            console.log('Error making SELECT for project details:', error);
            res.sendStatus(500);
        });
})

/**
 * POST route for creating a project
 */
router.post('/:id', (req, res,) => {
console.log("project", req.body);
    const title = req.body.title;
    const description = req.body.description;
    // Progression
    const due_time = req.body.due_time;
    // Completed
    const company_id = req.params.id;

    const queryText = `INSERT INTO "project" ("title", "description", "progression", "due_time", "completed")
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const queryText2 = `insert into company_project ("company_id", "project_id")
    values ($1, $2);`;
    const queryText3 = `INSERT INTO "company_project" ("company_id", "project_id")
    VALUES ($1, $2);`;
    pool.query(queryText, [title, description, 0, due_time, false])
        .then(result => {
            const createProjectId = result.rows[0].id
            console.log("new project id:", createProjectId);
            pool.query(queryText2, [company_id, createProjectId])
                .then(result => {
                    res.send(result.rows)
                }).catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
            res.sendStatus(500)
        })
});//

//assigns a user/employee to a project
router.post('/:id/assign', (req, res) => {
    const query = `insert into project_employee ("project_id", "employee_id")
    values ($1,$2);`
    pool.query(query, [req.params.id, req.user.id])
        .then(result => {
        }).catch(err => {
            console.log(err);
        })
});//


/**
 * GET route for showing all projects for your company
 */

router.get('/:id', (req, res) => {
    const companyId = req.params.id;
    const queryText = `
    SELECT "project".*, (
        SELECT coalesce(json_agg(item), '[]'::json) FROM (
            SELECT * FROM "tasks" WHERE "tasks".project_id="project"."id" ORDER BY "due_time"
        ) item
    ) AS tasks
    FROM "project" 
    join company_project on project.id = company_project.project_id
    join company on company_project.company_id = company.id
    WHERE "company"."id"=$1
    ORDER BY "due_time";
    ;`
    pool.query(queryText, [companyId])
        .then(result => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('User registration failed: ', err);
            res.sendStatus(500);
        });
});

//update project info--
router.put('/:id/update', (req, res) => {
    //if (req.body.completed === false){  }
    const body = req.body;
    const query = `update project set 
    "title" = $1,
    "description" = $2,
    "due_time" = $3
    where project.id = $4`;
    pool.query(query, [body.title, body.description, body.due_time, req.params.id])
        .then(response => res.sendStatus(200))
        .catch(error => {
            console.log(`Error updating projects`, error);
            res.sendStatus(500);
        });
});//

//update progress ---
router.put('/:id/progress', (req, res) => {
    //if (req.body.completed === false){  }
    const body = req.body;
    const query = `update project set
    "progression" = $1
    where project.id = $2`;
    pool.query(query, [body.progress, req.params.id])
        .then(response => res.sendStatus(200))
        .catch(error => {
            console.log(`Error updating projects`, error);
            res.sendStatus(500);
        });
});

//delete project
router.delete('/:id/delete', (req, res) => {
    const query1 = `delete from company_project where project_id = $1`; // delete project from company_project join table
    const query2 = `delete from project_employee where project_id = $1`;// delete project from project_employee join table
    const query3 = `delete from tasks where project_id = $1`; // delete project tasks from tasks table
    const query4 = `delete from project where project.id = $1`; // delete the project from the project table

    pool.query(query1, [req.params.id])
        .then((response) => res.sendStatus(200))
        .catch(error => {
            console.log(`Error deleting company_project table`, error);
        });

    pool.query(query2, [req.params.id])
        .catch(error => {
            console.log(`Error deleting project_employee table`, error);
        });

    pool.query(query3, [req.params.id])
        .catch(error => {
            console.log(`Error deleting tasks table`, error);
        });

    pool.query(query4, [req.params.id])
        .catch(error => {
            console.log(`Error deleting project table`, error);
        });
})



module.exports = router;