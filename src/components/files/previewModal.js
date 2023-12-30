import React from 'react';
import * as R from 'ramda';
import { Button, Modal } from 'react-bootstrap';
import { getFileUrlFromId } from '../../actions/files';
import { useSelector } from 'react-redux';

export const PreviewModal = ({ show, handleClose, file }) => {
    const settings = useSelector(state => state.settings);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>{R.isNil(file) ? '' : file.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`text-center ${settings.darkmode ? 'dark-mode': ''}`}>
                {!R.isNil(file) && file.fileType === 'image' ? <img src={getFileUrlFromId(file.id)} alt='selected' width='450px' height='auto' /> :
                    !R.isNil(file) && file.fileType === 'video' ? <video width='450px' height='450px' controls src={getFileUrlFromId(file.id)}> Your browser does not support the video tag.</video> :
                        !R.isNil(file) && file.fileType === 'audio' ? <audio preload="none" controls src={getFileUrlFromId(file.id)}>Your browser does not support the audio tag.</audio> :
                            !R.isNil(file) && file.fileType === 'pdf' ? <iframe title="PDF render" width='450px' height='450px' src={getFileUrlFromId(file.id)} /> :
                                ''}

            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}