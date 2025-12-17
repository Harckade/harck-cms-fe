import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Modal} from 'react-bootstrap';
import { deleteFile } from '../../actions/files';
import { sendSignalRMessage } from '../../actions/settings';

export const DeleteModal = ({ show, handleClose, filesToDelete, setSelectedFiles, dispatcher }) => {
    const dispatch = useDispatch();
    const files = useSelector(state => state.files);
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        if ( !R.isNil(filesToDelete) && !R.isNil(files) && !R.isNil(files.items) && files.items.length > 0 ?  files.items.filter(f => filesToDelete.map(fl => fl.id).includes(f.path)).length === 0 : true) {
            setSelectedFiles([]);
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.items.length])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Delete file{filesToDelete.length > 1 ? 's' : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                {filesToDelete.length > 1 ? 'These' : 'This'} file{filesToDelete.length > 1 ? 's' : ''} will be permanently deleted:
                <ul>
                    {R.isNil(filesToDelete) ? '' : filesToDelete.map((f, index) => <li key={'file-to-delete-'+index} className="text-truncate">{f.name}{f.fileType==='folder'? ' (including all files, folders and sub-folders)':''}</li>)}
                </ul>
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button variant="danger" className={!R.isNil(filesToDelete) && filesToDelete.filter(file => files.loadings.includes('DELETE_FILE_' + file.id)).length > 0 ? "progress-bar-striped progress-bar-animated" : ''} disabled={R.isNil(filesToDelete) || filesToDelete.filter(file => files.loadings.includes('DELETE_FILE_' + file.id)).length > 0} onClick={() => {
                    filesToDelete.forEach(file => {
                        dispatcher(() => dispatch(deleteFile(file)));
                    })
                    dispatcher(() => dispatch(sendSignalRMessage({
                        action: "update",
                        page: "files",
                        payload: {location: window.location.hash}
                    })));
                }}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}