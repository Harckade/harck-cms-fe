import React, { useEffect } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { sendNewsletterById } from '../../../../actions/newsletter';

export const SendModal = ({ dispatcher, show, handleClose, newsletterId }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);

    useEffect(() => {
        if (!newsletter.loadings.includes(`SEND_NEWSLETTER_${newsletterId}`)) {
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.loadings.length]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Send newsletter</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="primary">
                    Once you confirm that you want to send the newsletter, there is no way back. It will be sent to all your subscribers.
                </Alert>
                <p>The newsletter will be send in all languages except for those that have an empty title (even if there is any content). The emails in each language are only send to subscribers who subscribed for that particular language.</p>
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={newsletter.loadings.includes(`SEND_NEWSLETTER_${newsletterId}`)} className={newsletter.loadings.includes(`SEND_NEWSLETTER_${newsletterId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    dispatcher(() => dispatch(sendNewsletterById(newsletterId)));
                }}>
                    Yes
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}