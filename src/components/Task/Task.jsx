import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Button, CardBody, Card, Progress, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Dots from '../../images/dots_icon.svg'
import Back from '../../images/back_icon.svg'
import TaskItem from './TaskItem';
// Material
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Swal
import swal from 'sweetalert';

function Task({ direction, ...args }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();

    const user = useSelector((store) => store.user);
    const companyUser = useSelector((store) => store.members);

    // Tabs for changing task list
    const [tab, setTab] = useState('all_tasks')

    // All PROJECTS
    const projectDetails = useSelector((store) => store.projectDetails);

    // All Tasks for a project

    let projectId = params.projectId;
    let currentProject = projectDetails;

    // State and function for modal
    // New Project Modal
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    // Edit Modal
    const [modal2, setModal2] = useState(false);
    const toggle2 = () => setModal2(!modal2);
    // assign user to project
    const [assignProjectModal, setAssignProjectModal] = useState(false);
    const assignProjectToggle = () => setAssignProjectModal(!assignProjectModal);

    // State for drop down
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    // State for edit drop down
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const toggleDropdown2 = () => setDropdown2Open(prevState => !prevState);

    // State for Assign Project drop down
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const toggleProjectDropdown = () => setProjectDropdownOpen(prevState => !prevState);

    // State for editing a project
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectDueDate, setProjectDueDate] = useState('');
    const [projectAssign, setProjectAssign] = useState("");
    const [projectAssignId, setProjectAssignId] = useState(0)
    const [date, setDate] = useState(new Date());

    // State for progression
    const [progression, setProgression] = useState(0);

    const deleteProject = async () => {
        dispatch({ type: 'DELETE_PROJECT', payload: projectId })
        history.push('/projects')
    }

    const editProject = async (body) => {
        dispatch({ type: 'UPDATE_PROJECT', payload: body })
        toggle2();
    }

    const createTask = async (body) => {
        console.log('current', currentProject)

        if (!body.projectTitle) {
            body.projectTitle === currentProject.title;
        }
        dispatch({ type: 'NEW_TASK', payload: body })
    }

    function getFormattedDate(date) {
        if (date === null) {
            return
        }
        let t = date.indexOf('T');
        let newDate = date.slice(0, t)
        return newDate;
    }

    const calculateProgression = (tasks) => {
        let completed = 0;
        let totalTasks = tasks.length;
        if (tasks.length === 0) {
            return 0
        } else {
            for (let task of tasks) {
                if (task.completed_by) {
                    completed++;
                }
            }
            return ((completed / totalTasks) * 100).toFixed(0);
        }
    }

    useEffect(() => {
        dispatch({ type: 'FETCH_PROJECT_DETAILS', payload: projectId })
        dispatch({ type: "FETCH_ALL_USER" });
        console.log('CURRENT TASKS', currentProject.tasks);
        console.log('CURRENT PROJECT', currentProject);
    }, [])

    // CATCHING ERRORS / UNLOADED DATA

    if (currentProject.id === undefined) {
        return 'No tasks yet'
    };

    // calculate progression

    return (
        <div className='task-flex'>
            <div className='task-wrapper'>
                <img src={Back} onClick={() => {
                    dispatch({ type: '/CLEAR_ID' });
                    dispatch({ type: '/CLEAR_PROJECT_TASKS' });
                    dispatch({ type: '/CLEAR_PROJECTS' });
                    history.push('/projects');
                }} className='back-arrow' />
                <div className="dot-and-task">
                    <h1>{currentProject.title}</h1>

                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction={direction}>
                        <DropdownToggle style={{
                            backgroundColor: 'transparent',
                            border: 'none'
                        }}>
                            <img className='dots' src={Dots} />
                        </DropdownToggle>
                        <DropdownMenu {...args}>
                            <DropdownItem header>Project Settings</DropdownItem>
                            <DropdownItem onClick={() => toggle2()}>Edit</DropdownItem>

                            {/* EDIT MODAL */}

                            <Modal isOpen={modal2} toggle={toggle2} {...args}>
                                <ModalHeader toggle={toggle2}>Edit Project</ModalHeader>
                                <ModalBody>
                                    <label htmlFor='project-title'>Project Title:</label>
                                    <input defaultValue={currentProject.title} onChange={(e) => setProjectTitle(e.target.value)} id='project-title' />
                                    <br />
                                    <label htmlFor='project-description'>Project Description:</label>
                                    <input defaultValue={currentProject.description} onChange={(e) => setProjectDescription(e.target.value)} id='project-description' />
                                    <br />
                                    <label htmlFor='project-due-date'>Project Due-Date: </label>
                                    <br />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            id='project-due-date'
                                            value={date}
                                            onChange={(newDate) => {
                                                setProjectDueDate(newDate);
                                                setDate(newDate);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </ModalBody>
                                <ModalFooter>
                                    <Button style={{
                                        backgroundColor: 'rgb(175, 204, 54)',
                                        borderColor: 'rgb(175, 204, 54)'
                                    }} onClick={() => {
                                        editProject({ title: projectTitle, description: projectDescription, due_time: projectDueDate, project_id: projectId });
                                        toggle2();
                                    }
                                    }>Confirm</Button>
                                </ModalFooter>
                            </Modal>

                            {/* end edit modal */}

                            {/* <DropdownItem onClick={() => assignProjectToggle()}>Add Members</DropdownItem> */}


                            <DropdownItem divider />
                            <DropdownItem onClick={() => {
                                swal({
                                    title: `Are you sure you want to delete ${currentProject.title}?`,
                                    text: "Once deleted, you will not be able to recover this project.",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                })
                                    .then((willDelete) => {
                                        if (willDelete) {
                                            swal(`${currentProject.title} has been deleted!`, {
                                                icon: "success",
                                            });
                                            deleteProject();
                                        } else {
                                            swal("Process cancelled.");
                                        }
                                    });
                            }
                            } style={{
                                color: 'red'
                            }}>Delete Project</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                </div>
                <div className="project-details">
                    <h3 className='project-description'>{currentProject.description}</h3>
                    <Button style={{
                        backgroundColor: 'rgb(175, 204, 54)',
                        borderColor: 'rgb(175, 204, 54)'
                    }} onClick={() => {
                        toggle()
                    }}>New Task</Button>
                </div>
                <h6 className='project-description'>{getFormattedDate(currentProject.due_time)}</h6>

                {/* MODAL START */}

                <Modal isOpen={modal} toggle={toggle} {...args}>
                    <ModalHeader toggle={toggle}>New Task</ModalHeader>
                    <ModalBody>
                        <label htmlFor='project-title'>Task Title:</label>
                        <input onChange={(e) => setProjectTitle(e.target.value)} id='project-title' />
                        <br />
                        <label htmlFor='project-description'>Task Description:</label>
                        <input onChange={(e) => setProjectDescription(e.target.value)} id='project-description' />
                        <br />
                        <label htmlFor='project-due-date'>Task Due-Date: </label>
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                id='project-due-date'
                                value={date}
                                onChange={(newDate) => {
                                    setProjectDueDate(newDate);
                                    setDate(newDate);
                                    console.log(newDate);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{
                            backgroundColor: 'rgb(175, 204, 54)',
                            borderColor: 'rgb(175, 204, 54)'
                        }} onClick={() => {
                            if (projectTitle, projectDescription, projectDueDate) {
                                createTask({ title: projectTitle, description: projectDescription, due_time: projectDueDate, project_id: projectId });
                                setProjectDescription('');
                                setProjectDueDate('')
                                setProjectTitle('')
                                toggle();
                            } else {
                                alert('Please enter a title, description, and date')
                            }
                        }
                        }>Create</Button>
                    </ModalFooter>
                </Modal>

                {/* MODAL END */}

                <Progress
                    style={{
                        marginTop: '2em'
                    }}
                    value={calculateProgression(currentProject.tasks)}>
                    {calculateProgression(currentProject.tasks)}%
                </Progress>
                <div className="sort-tabs">
                    <h3 className={tab === 'all_tasks' ? 'selected-tab' : 'tab'} onClick={() => setTab('all_tasks')}>All Tasks</h3>
                    <h3 className={tab === 'my_tasks' ? 'selected-tab' : 'tab'} onClick={() => setTab('my_tasks')}>My Tasks</h3>
                    <h3 className={tab === 'completed_tasks' ? 'selected-tab' : 'tab'} onClick={() => setTab('completed_tasks')}>Completed</h3>
                </div>
                <div className='taskHub'>
                    {
                        currentProject.tasks.length === 0 ? <h1 className='no-tasks'>No Tasks Yet</h1>
                            : currentProject.tasks.map((task) => {
                                if (tab === 'all_tasks') {
                                    return (
                                        <TaskItem task={task} />
                                    )
                                }
                                if (task.completed_by && tab === 'completed_tasks') {
                                    return (
                                        <TaskItem task={task} />
                                    )
                                }
                                if (task.assigned_user == user.id && tab === 'my_tasks') {
                                    return (
                                        <TaskItem task={task} />
                                    )
                                }
                            })
                    }
                </div>
                {/* start assign project Modal */}

                {/* start assign modal */}

                <Modal isOpen={assignProjectModal} toggle={assignProjectToggle} {...args}>
                    <ModalHeader toggle={assignProjectToggle}>Assign to User</ModalHeader>
                    <ModalBody>
                        <label htmlFor='project-title'>Assign User to Task:</label>

                        {/* start dropdown */}

                        <Dropdown isOpen={projectDropdownOpen} toggle={toggleProjectDropdown} >
                            <DropdownToggle caret color='primary'>
                                {projectAssign}
                            </DropdownToggle>
                            <DropdownMenu {...args}>
                                {companyUser.map((member) => {
                                    return (
                                        <DropdownItem key={member.id} onClick={() => {
                                            setAssignedId(member.id);
                                            setAssignedName(member.first_name + " " + member.last_name)
                                        }}>
                                            {member.first_name} {member.last_name}
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </Dropdown>

                        {/* end dropdown */}

                        <br />
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{
                            backgroundColor: 'rgb(175, 204, 54)',
                            borderColor: 'rgb(175, 204, 54)'
                        }} onClick={() => {
                            assignTask({ projectId, userId: projectAssignId });
                            AssignToggle();
                        }
                        }>Confirm</Button>
                    </ModalFooter>
                </Modal>

                {/* end assign modal */}


                {/* <Modal isOpen={assignProjectModal} toggle={assignProjectToggle} {...args}>
                                <ModalHeader toggle={assignProjectToggle}>Assign User</ModalHeader>
                                <ModalBody>
                                    <label htmlFor='project-title'>Assign User to Task:</label>

                                    <Dropdown isOpen={projectDropdownOpen} toggle={toggleProjectDropdown}>
                                        <DropdownToggle caret color='primary'>
                                             {projectAssign} 
                                            something
                                        </DropdownToggle>
                                        <DropdownMenu {...args}>
                                            {companyUser.map((member) => {
                                                return (
                                                    <DropdownItem key={member.id} onClick={() => {
                                                        setProjectAssignId(member.id);
                                                        setProjectAssign(member.first_name + " " + member.last_name)
                                                    }}>
                                                        {member.first_name} {member.last_name}
                                                    </DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </Dropdown>

                                </ModalBody>
                                <ModalFooter>
                                    <Button style={{
                                        backgroundColor: 'rgb(175, 204, 54)',
                                        borderColor: 'rgb(175, 204, 54)'
                                    }} onClick={() => {
                                        assignTask({ projectId: projectId, userId: projectAssignId });
                                        AssignToggle();
                                    }
                                    }>Confirm</Button>
                                </ModalFooter>
                            </Modal> */}

                            {/* end of assign project modal */}

            </div>
        </div>
    )
}

export default Task;
