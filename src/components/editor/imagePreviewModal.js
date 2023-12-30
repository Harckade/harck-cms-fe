import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as R from 'ramda';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const ImagePreviewModal = ({ show, handleClose, url }) => {
    const settings = useSelector(state => state.settings);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title className='text-center text-truncate' style={{ maxWidth: '500px' }}>{R.isNil(url) ? '' : url}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`text-center ${settings.darkmode ? 'dark-mode' : ''}`}>
                <img src={url} alt='selected' width='400px' heigh='400px' />
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
    </Modal>
    );
}