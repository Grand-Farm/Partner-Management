const express = require('express');
const pool = require('../modules/pool');
const {

} = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * POST route for creating a task
 */
router.post('/:id', (req, res,) => {

  console.log('REQ BODY ',req.body)

  const title = req.body.title;
  const description = req.body.description;
  const due_time = req.body.due_time;

  const projectId = req.params.id;

  const queryText = `INSERT INTO "tasks" ("title", "description", "due_time", project_id)
      VALUES ($1, $2, $3, $4 ) RETURNING id`;
  pool.query(queryText, [title, description, due_time, projectId])
    .then(result => {
      const createProjectId = result.rows[0].id
      console.log("new task id:", createProjectId);
      res.sendStatus(201);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
});
// Get all the task for a user 
router.get('/', (req, res) => {
  const queryText = `select tasks.id, tasks.title, tasks.due_time, tasks.completed_by, tasks.completed_time, tasks.parent_task from tasks 
    join project on tasks.project_id = project.id
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where "user".id = $1
    ORDER BY tasks.id
    ;`
  pool.query(queryText, [req.user.id])
    .then(result => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('get tasks err: ', err);
      res.sendStatus(500);
    });
});

router.get('/projectTasks/:id', (req, res) => {
  const projectId = req.params.id;
  const queryText = `select tasks.id, tasks.title, tasks.priority, tasks.description, tasks.due_time, tasks.completed_by, tasks.completed_time, tasks.parent_task from tasks
  join project on tasks.project_id = project.id
  where project.id = 66
  ORDER  BY due_time
  ;`
  pool.query(queryText, [projectId])
    .then(result => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('get tasks err: ', err);
      res.sendStatus(500);
    });
});

router.put('/important/:id', (req, res) => {
  let taskId = req.params.id;
  const queryText = `UPDATE "tasks" SET priority = 1 WHERE id = $1;`;
  pool.query(queryText, [taskId])
    .then(result => {
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(500)
    })
})

router.put('/:id', (req, res) => {
  const queryText = `UPDATE tasks SET "completed_by" = $1 WHERE "id" = $2;`;

  pool.query(queryText, [req.params.id, req.body.taskId])
    .then(result => {
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(500)
    })
})

//assign task to user
router.put('/assign/:id', (req, res) => {
  console.log("assign user to task:", req.body, req.params.id);
  const queryText = `UPDATE tasks SET "assigned_user" = $1 WHERE "id" = $2;`;

  pool.query(queryText, [ req.body.userId, req.body.taskId])
    .then(result => {
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(500)
    })
})

router.put('/edit/:id', (req, res) => {
  const title = req.body.taskTitle;
  const description = req.body.taskDescription;
  const dueTime = req.body.taskDueTime
  const taskId = req.params.id
  const queryText = `UPDATE "tasks" SET ("title", "description", "due_time") = ($1, $2, $3) WHERE id = $4;`
  pool.query(queryText, [title, description, dueTime, taskId])
    .then(result => {
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(503)
      console.log(error)
    })
})

router.put('/uncomplete/:id', (req, res) => {
  const queryText = `UPDATE tasks SET "completed_by" = null WHERE "id" = $1;`
  pool.query(queryText, [req.params.id])
    .then(result => {
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(503)
      console.log(error)
    })
})

router.delete('/:id', (req, res) => {
  const queryText = `DELETE FROM tasks WHERE "tasks".id = $1`; // delete tasks from tasks table
  console.log("delete task", req.params.id);
  pool.query(queryText, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
      console.log(`Error deleting task`, error);
      res.sendStatus(500);
    });

})




module.exports = router;