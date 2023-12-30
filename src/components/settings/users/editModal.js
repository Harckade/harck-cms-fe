import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { editUser } from '../../../actions/users';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';

export const EditModal = ({ show, handleClose, user, dispatcher, rolesOptions }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const users = useSelector(state => state.users);
    const [newUser, setNewUser] = useState({
        email: '',
        role: '',
        id: ''
    });


    useEffect(() => {
        setNewUser({...newUser, email: '', role: '', id: ''})
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.items]);

    useEffect(() => {
        if (!R.isNil(user) && !R.isNil(user.email) && !R.isNil(user.role)) {
            setNewUser({ ...newUser, email: user.email.toLowerCase(), role: user.role.toLowerCase(), id: user.id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    let notAllowedToEdit = !R.isNil(user) && !R.isNil(users) && !R.isNil(users.items) && users.items.length > 0 &&  users.items.filter(u => u.id !== user.id && u.role === 'Administrator').length === 0 && user.role === 'Administrator';


    return (
        <Modal id="edit-user-modal" show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Edit user role</Modal.Title>
            </Modal.Header>

            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                <Form>
                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`} hasValidation={true}>
                        <span className="input-group-text">Email address</span>
                        <FormControl type="email" disabled={true} required={true} aria-label="email" aria-describedby="inputGroup-sizing-sm"
                            value={!R.isNil(newUser.email) ? newUser.email : ''} />
                    </InputGroup>

                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                        <span className="input-group-text">Role</span>
                        <select value={newUser.role} disabled={notAllowedToEdit} className="form-control" onChange={(event) => {
                            setNewUser({ ...newUser, role: event.target.value })
                        }}>
                            {rolesOptions.map((role, index) => {
                                return <option key={index} value={role.value}>{role.label}</option>
                            })}
                        </select>
                    </InputGroup>
                    {notAllowedToEdit ? <div className="error-message">You cannot edit this user's role. There must be at least one Administrator</div> : ''}
                </Form>
            </Modal.Body>

            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button type="submit" variant="success" className={users.loadings.includes('EDIT_USER_'+(!R.isNil(user) && !R.isNil(user.id) ? user.id: '')) ? "progress-bar-striped progress-bar-animated" : ''} disabled={users.loadings.includes('EDIT_USER_'+(!R.isNil(user) && !R.isNil(user.id) ? user.id: '')) || notAllowedToEdit} onClick={() => {
                        dispatcher(() => dispatch(editUser(newUser)));
                }}>
                    Save
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}