import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Modal} from 'react-bootstrap';
import { deleteUser } from '../../../actions/users';

export const DeleteModal = ({ show, handleClose, user, dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const users = useSelector(state => state.users);

    useEffect(() => {
        if ( !R.isNil(user) && !R.isNil(users) && !R.isNil(users.items) && users.items.length > 0 &&  users.items.filter(u => u.id === user.id).length === 0) {
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.items.length])

    let notAllowedToDelete = !R.isNil(user) && !R.isNil(users) && !R.isNil(users.items) && users.items.length > 0 && users.items.filter(u => u.id !== user.id && u.role === 'Administrator').length === 0 && user.role === 'Administrator';

    return (
        <Modal id="delete-user-modal" show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Delete user</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                Are you sure that you want to delete {R.isNil(user) ? '' : user.name} user?
                {notAllowedToDelete ? <div className="error-message">You cannot remove this user. There must be at least one Administrator</div> : ''}
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="danger" className={!R.isNil(user) && users.loadings.includes('DELETE_USER_' + user.id) ? "progress-bar-striped progress-bar-animated" : ''} disabled={R.isNil(user) || users.loadings.includes('DELETE_USER_' + user.id) || notAllowedToDelete} onClick={() => { dispatcher(() => dispatch(deleteUser(user))); }}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}