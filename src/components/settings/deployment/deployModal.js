import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { launchDeployment } from '../../../actions/settings';
import { useDispatch, useSelector } from 'react-redux';

export const DeployModal = ({ dispatcher, show, handleClose }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        if (!settings.loadings.includes('LAUNCH_DEPLOYMENT')) {
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.loadings.length]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Deployment</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>Launch deployment to update the production website with latest changes? It can take several minutes (~10)</Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" className={settings.loadings.includes('LAUNCH_DEPLOYMENT') ? "progress-bar-striped progress-bar-animated" : ''} disabled={settings.loadings.includes('LAUNCH_DEPLOYMENT')} onClick={() => { dispatcher(() => dispatch(launchDeployment())); }}>
                    Yes
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}