import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { inviteUser } from '../../../actions/users';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';

export const NewUserModal = ({ show, handleClose, dispatcher }) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const [validated, setValidated] = useState(false);
    const [alreadyMember, setAlreadyMember] = useState(false);
    const users = useSelector(state => state.users);
    const [newUser, setNewUser] = useState({
        email: '',
        role: 'viewer'
    });

    const rolesOptions = [
        { value: 'viewer', label: 'Viewer' },
        { value: 'editor', label: 'Editor' },
        { value: 'administrator', label: 'Administrator' }
    ];

    const handleSubmit = (event) => {
        const form = formRef.current;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.items.length]);

    return (
        <Modal id="add-user-modal" show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Invite new user</Modal.Title>
            </Modal.Header>

            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                <Form validated={validated} ref={formRef}>
                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`} hasValidation={true}>
                        <span className="input-group-text">Email address</span>
                        <FormControl type="email" required={true} placeholder={'example@email.com'} aria-label="email" aria-describedby="inputGroup-sizing-sm"
                            value={!R.isNil(newUser.email) ? newUser.email : ''} onChange={(event) => {
                                setNewUser({ ...newUser, email: event.target.value });
                                setAlreadyMember(users.items.filter(u => u.email === event.target.value).length > 0);
                            }} />
                        {alreadyMember ? <div className="warning-message">This user is already a member</div> : ''}
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email address.
                        </Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                        <span className="input-group-text">Role</span>
                        <select defaultValue="viewer" className="form-control" onChange={(event) => {
                            setNewUser({ ...newUser, role: event.target.value })
                        }}>
                            {rolesOptions.map((role, index) => {
                                return <option key={index} value={role.value}>{role.label}</option>
                            })}
                        </select>
                    </InputGroup>
                </Form>
            </Modal.Body>

            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button type="submit" variant="success" className={users.loadings.includes('INVITE_USER') ? "progress-bar-striped progress-bar-animated" : ''} disabled={alreadyMember || users.loadings.includes('INVITE_USER')} onClick={(event) => {
                    handleSubmit(event);
                    if (formRef.current.checkValidity() === true) {
                        dispatcher(() => dispatch(inviteUser(newUser)));
                    }
                }}>
                    Invite
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}