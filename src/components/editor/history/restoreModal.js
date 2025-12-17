import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { restoreArticleFromBackup } from '../../../actions/articles';
import { Loading } from '../../common/loading';
import * as R from 'ramda';

export const RestoreModal = ({ dispatcher, show, handleClose, backup }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const article = useSelector(state => state.articles);

    return (
        <Modal show={show} onHide={article.loadings.includes(`RESTORE_ARTICLE_BACKUP`) ? null : handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Restore</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="primary">
                    In order to reflect changes made on this article at the static website, please launch the deployment after completing this operation.
                </Alert>
                {R.isNil(backup) ? <Loading /> : `Restore article to the ${backup.modificationDate.toLocaleDateString()} ${backup.modificationDate.toLocaleTimeString()} state?`}
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={article.loadings.includes(`RESTORE_ARTICLE_BACKUP`)} className={article.loadings.includes(`RESTORE_ARTICLE_BACKUP`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    if (!R.isNil(backup)){
                        dispatcher(() => dispatch(restoreArticleFromBackup(backup.id, backup.language, backup.modificationDate)));
                    }
                }}>
                    Yes
                </Button>
                <Button variant="secondary" disabled={article.loadings.includes(`RESTORE_ARTICLE_BACKUP`)} onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}