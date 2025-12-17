import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { addFolder } from '../../actions/files';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { sendSignalRMessage } from '../../actions/settings';

export const FolderModal = ({ show, handleClose, dispatcher }) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const [validated, setValidated] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState(false);
    const files = useSelector(state => state.files);
    const [newFolder, setNewFolder] = useState({ name: '', parentFolder: files.path.join('/')});

    const handleSubmit = () => {
        setNewFolder({...newFolder, name: newFolder.name.trim()});
        setValidated(true);
    };

    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.items.length]);

    useEffect(() =>{
        setValidated(false);
        setNewFolder({name:'', parentFolder: files.path.join('/')});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const isValidFolderName = () => {
        var regex = /^[a-z\d\-_\s]+$/i;
        return regex.test(newFolder.name) === true;
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Create new folder</Modal.Title>
            </Modal.Header>

            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                <Form ref={formRef}>
                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`} hasValidation={true}>
                        <span className="input-group-text">Path</span>
                        <FormControl disabled={true} type="text" value={`${newFolder.parentFolder === '' ? 'home' : newFolder.parentFolder}${newFolder.name === '' ? '' : '/' + newFolder.name}`} />
                    </InputGroup>

                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`} hasValidation={true}>
                        <span className="input-group-text">Folder name</span>
                        <FormControl autoFocus={true} type="text" required={true} isValid={validated && isValidFolderName()} isInvalid={validated ? (newFolder.name.trim().length === 0 || isValidFolderName() === false) : false} placeholder={'new folder name'} aria-label="folder name" aria-describedby="inputGroup-sizing-sm"
                            value={!R.isNil(newFolder.name) ? newFolder.name : ''} onChange={(event) => {
                                setNewFolder({ ...newFolder, name: event.target.value });
                                setAlreadyExists(files.items.filter(u => u.name === event.target.value && u.type === 'folder').length > 0);
                            }} />
                        {alreadyExists ? <div className="warning-message">A folder with this name already exists</div> : ''}
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid folder name. It can only contain letters, numbers and the following symbols: '-', '_'
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form>
            </Modal.Body>

            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button type="submit" variant="success" className={files.loadings.includes('ADD_FOLDER') ? "progress-bar-striped progress-bar-animated" : ''} disabled={alreadyExists || files.loadings.includes('ADD_FOLDER')} onClick={(event) => {
                    handleSubmit(event);
                    if (formRef.current.checkValidity() === true && isValidFolderName()) {
                        dispatcher(() => dispatch(addFolder(newFolder)));
                        dispatcher(() => dispatch(sendSignalRMessage({
                            action: "update",
                            page: "files",
                            payload: {location: window.location.hash}
                        })));
                    }
                }}>
                    Create
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}