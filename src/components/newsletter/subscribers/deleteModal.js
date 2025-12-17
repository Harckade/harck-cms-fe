import React, { useEffect } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriberById } from '../../../actions/newsletter';
import { Loading } from '../../common/loading';
import * as R from 'ramda';
import { Languages } from '../../../consts/mappers/languages';

export const DeleteModal = ({ dispatcher, show, handleClose, selectedSubscriber }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);

    let subscriberId = !R.isNil(selectedSubscriber) ? selectedSubscriber.id : '';
    let subscriberEmail = !R.isNil(selectedSubscriber) ? selectedSubscriber.emailAddress : '';
    let subscriberLanguage = !R.isNil(selectedSubscriber) ? Languages[selectedSubscriber.language] : '';

    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.subscribers.length]);

    return (
        <Modal show={show} onHide={newsletter.loadings.includes(`DELETE_SUBSCRIBER_${subscriberId}`) ? null : handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Permanently Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="danger">
                    This action is irreversible! Once the subscriber is deleted it is not possible to recover it. Unless the person subscribe again.
                </Alert>
                {R.isNil(selectedSubscriber) ? <Loading /> :
                    <>
                        Are you sure that you want to permanently delete this subscriber?
                        <ul>
                            <li key='subscriber-email' className="text-truncate"><i><strong>Email:</strong> {subscriberEmail}</i></li>
                            <li key='subscriber-language' className="text-truncate"><i><strong>Language:</strong> {subscriberLanguage}</i></li>
                        </ul>
                    </>
                }
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={newsletter.loadings.includes(`DELETE_SUBSCRIBER_${subscriberId}`)} className={newsletter.loadings.includes(`DELETE_SUBSCRIBER_${subscriberId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    if (!R.isNil(selectedSubscriber)) {
                        dispatcher(() => dispatch(deleteSubscriberById(selectedSubscriber)));
                    }
                }}>
                    Yes
                </Button>
                <Button variant="secondary" disabled={newsletter.loadings.includes(`DELETE_SUBSCRIBER_${subscriberId}`)} onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}