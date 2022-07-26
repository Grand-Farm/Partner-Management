import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import UnassignedList from './UnassignedList';
import { Collapse, Button, CardBody, Card, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NewPartnerList from './NewPartnerList';
import AllCompanies from './AllCompany';
import AllEmployee from './AllEmployee';


function AdminPage(args) {
    /* 
    -X make a view for freshly created companies to be accepted or deleted
    - make a view of new employees and the ability to reassign them to companies, as wel as adjust levels
    - need to make sagas and reducers for the unassigned users
    */
    const dispatch = useDispatch();
    const unassigned = useSelector((store) => store.unassigned);
    const newPartners = useSelector((store) => store.newPartner);
    const allCompanies = useSelector((store) => store.allCompany);
    const allUsers = useSelector((store) => store.allUser);

    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);

    const toggle1 = () => setIsOpen1(!isOpen1);
    const toggle2 = () => setIsOpen2(!isOpen2);
    const toggle3 = () => setIsOpen3(!isOpen3);
    const toggle4 = () => setIsOpen4(!isOpen4);

    const fetchUnassigned = () => {
        dispatch({ type: "FETCH_UNASSIGNED" });
    }

    const fetchNewPartner = () => {
        dispatch({ type: "FETCH_NEW_PARTNER" })
        console.log('NEW PARTNER', newPartners)
    }

    const fetchAllCompanies = () => {
        dispatch({ type: "FETCH_ALL_COMPANIES" });//
    }

    const fetchAllEmployees = () => {
        dispatch({ type: "FETCH_ALL_USER" }); //
    }

    if (unassigned.company_id === null || newPartners.partner_level === null || allCompanies === null || allUsers === null) {
        console.log(unassigned, newPartners);
        return;
    }

    useEffect(() => {
        fetchUnassigned();
        fetchNewPartner();
        fetchAllCompanies();
        fetchAllEmployees();
    }, [])

    return (
        <div className='admin'>
            <h1>Grand Farm Admin Page</h1>
            <h2 onClick={toggle1} className='links'>Unassigned Employees</h2>
            <Collapse isOpen={isOpen1} {...args} >
                <table>
                    <tr>
                        <th> First Name </th>
                        <th> Last Name </th>
                        <th> Email </th>
                        <th>Assign</th>
                        <th>Delete</th>
                    </tr>
                    {
                        unassigned.map((unassign) => {
                            return (
                                <UnassignedList unassign={unassign} />
                            )
                        })
                    }
                </table>
            </Collapse>
            <h2 onClick={toggle2} className='links'>New Partner Requests</h2>
            <Collapse isOpen={isOpen2} {...args} >
                <table>
                    <tr>
                        <th> Company Name </th>
                        <th>Assign</th>
                        <th> Delete </th>
                    </tr>
                    {
                        allCompanies.map((newPartner) => {
                            if (newPartner.partner_level === 101) {
                                return (
                                    <NewPartnerList newPartner={newPartner} />
                                )
                            }
                        })
                    }
                </table>
            </Collapse>
            <h2 onClick={toggle3} className='links'>All Partners</h2>
            <Collapse isOpen={isOpen3} {...args} >
                <table>
                    <tr>
                        <th> Company Name </th>
                        <th>Partner Level</th>
                        <th> Assign </th>
                        <th>Delete</th>
                    </tr>
                    {
                        allCompanies.map((company) => {
                            return (
                                <AllCompanies company={company} />
                            )
                        })
                    }
                </table>
            </Collapse>
            <h2 onClick={toggle4} className='links'>All Employees</h2>
            <Collapse isOpen={isOpen4} {...args} >
                <table>
                    <tr>
                        <th> First Name </th>
                        <th> Last Name </th>
                        <th> Email </th>
                        <th>Assign</th>
                        <th>Delete</th>
                    </tr>
                    {
                        allUsers.map((user) => {
                            return (
                                <AllEmployee user={user} />
                            )
                        })
                    }
                </table>
            </Collapse>
        </div>
    )
}

export default AdminPage;