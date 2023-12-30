import React from 'react';
import { Button, Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import {FiUserPlus, FiTrash2, FiEdit3} from 'react-icons/fi';
import { MultiSelect } from "react-multi-select-component";
import * as R from 'ramda';
import { Overlay } from '../../common/overlay';
import { useSelector } from 'react-redux';


export const Toolbar=({selectedUser, handleAddNew, handleShowDelete, handleShowEdit, setFilters, filters, setSearchFilter})=>{
    const settings = useSelector(state => state.settings);
    const filterOptions = [
        { value: 'administrator', label: 'Administrator' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
    ];
    const ovverrides = {
        "selectSomeItems": "Filter by role",
        "allItemsAreSelected": "All roles are selected"
    };

    return(
        <Container fluid id="users-toolbar" className={`files-toolbar ${settings.darkmode ? 'dark-mode': ''}`}>
            <Row >
                <Col xs="6">
                    <Overlay text='New user' component={<Button id="add-user" size="sm" variant='outline-primary' onClick={() => handleAddNew()}><FiUserPlus /></Button>} />{' '}
                    <Overlay text='Edit user' component={<Button id="edit-user" size="sm" variant={R.isNil(selectedUser) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-success'} disabled={R.isNil(selectedUser)} onClick={() => handleShowEdit()}><FiEdit3 /></Button>} />{' '}
                    <Overlay text='Delete user' component={<Button id="delete-user" size="sm" variant={R.isNil(selectedUser) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-danger'} disabled={R.isNil(selectedUser)} onClick={() => handleShowDelete()}><FiTrash2 /></Button>} />{' '}
                </Col>
                <Col xs="3" md={{ span: 2, offset: 2 }}>
                    <MultiSelect
                        options={filterOptions}
                        value={filters}
                        onChange={(val) => setFilters(val)}
                        labelledBy="Filter by"
                        hasSelectAll={true}
                        overrideStrings={ovverrides}
                        className={settings.darkmode ? 'input-dark-mode' : ''}
                    />
                </Col>
                <Col xs="3" md="2">
                    <InputGroup className={settings.darkmode ? 'input-dark-mode' : ''}>
                        <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                    </InputGroup>
                </Col>
            </Row>
        </Container>
    );
}