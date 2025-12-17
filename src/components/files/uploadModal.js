import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Modal, Alert } from 'react-bootstrap';
import { uploadFile } from '../../actions/files';
import { FiTrash2 } from 'react-icons/fi';
import Dropzone from 'react-dropzone'
import { sendSignalRMessage } from '../../actions/settings';

export const UploadModal = ({ show, handleClose, dispatcher }) => {
    const dispatch = useDispatch();
    const [validated, setValidated] = useState(false);
    const files = useSelector(state => state.files);
    const settings = useSelector(state => state.settings);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        if (selectedFiles !== [] && selectedFiles.length > 0) {
            let fileIds = [];
            Array.from(selectedFiles).forEach(selectedFile => {
                let fileType = 'binary';
                if (selectedFile.type.startsWith('image/')) {
                    fileType = 'image';
                }
                else if (selectedFile.type.startsWith('video/')) {
                    fileType = 'video';
                }
                fileIds.push(fileType + '/' + selectedFile.name);
            })
        }
    }, [selectedFiles]);

    useEffect(() => {
        if (!files.loadings.includes('UPLOAD_FILES')) {
            setSelectedFiles([]);
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.loadings.length])

    return (
        <Modal show={show} onHide={handleClose} onEnter={()=>setShowAlert(true)}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Upload files</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                {showAlert ?
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        <p>Any uploaded file will be publicly available. This means that anybody on internet can access it.</p>
                        <p>Do not use this storage to save any sensible or private information.</p>
                    </Alert>
                    : ''}

                <Dropzone multiple={true} onDrop={acceptedFiles => setSelectedFiles(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <section id='dropzone' className="container">
                            <div {...getRootProps({ className: 'dropzone disabled' })}>
                                <input id="file-drop-upload" {...getInputProps()} />
                                <p className={`fileDrop${settings.darkmode ? ' fileDrop-dark' : ''}`}>Drag 'n' drop your files here, or click to select files</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                {
                    selectedFiles.length > 0 ?
                        <ul>
                            {selectedFiles.map((f, index) => {
                                return <li className="text-truncate" key={index}><FiTrash2 style={{ cursor: 'pointer' }} onClick={() => {
                                    let newFiles = selectedFiles.filter(file => file !== f);
                                    setSelectedFiles(newFiles);
                                }} />{f.name}</li>
                            })}
                        </ul> : ''
                }
                {
                    validated && (R.isNil(selectedFiles) || selectedFiles.length === 0) ? <div className="error-message text-center">Please select at least one file</div> : ''
                }
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" className={files.loadings.includes('UPLOAD_FILES') ? "progress-bar-striped progress-bar-animated" : ''} disabled={files.loadings.includes('UPLOAD_FILES')} onClick={() => {
                    if (R.isNil(selectedFiles) || selectedFiles.length === 0) {
                        setValidated(true);
                    }
                    else {
                        setValidated(false);
                        Array.from(selectedFiles).forEach(selectedFile => {
                            if (!files.items.includes(selectedFile.name)) {
                                dispatcher(() => {
                                    dispatch(uploadFile(selectedFile, files.path !== [] ? files.path.join('/'): files.path))
                                });
                            }
                        });
                        dispatcher(() => dispatch(sendSignalRMessage({
                            action: "update",
                            page: "files",
                            payload: {location: window.location.hash}
                        })));
                    }

                }}>
                    Upload
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}