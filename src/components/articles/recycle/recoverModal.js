import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { recoverDeletedArticle } from '../../../actions/articles';
import { Loading } from '../../common/loading';
import * as R from 'ramda';

export const RecoverModal = ({ dispatcher, show, handleClose, deletedArticle, handleCloseRecyclePreview }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);

    let articleId = !R.isNil(deletedArticle) ? deletedArticle.id : '';
    
    useEffect(()=> {

        if (!R.isNil(deletedArticle) && articles.items.findIndex(art => art.id === deletedArticle.id) !== -1){
            handleClose();
            handleCloseRecyclePreview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.items.length]);

    return (
        <Modal show={show} onHide={articles.loadings.includes(`RECOVER_ARTICLE_${articleId}`) ? null : handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Restore</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                {R.isNil(deletedArticle) ? <Loading /> : `Recover article from the recycle bin?`}
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={articles.loadings.includes(`RECOVER_ARTICLE_${articleId}`)} className={articles.loadings.includes(`RECOVER_ARTICLE_${articleId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    if (!R.isNil(deletedArticle)) {
                        dispatcher(() => dispatch(recoverDeletedArticle(deletedArticle)));
                    }
                }}>
                    Yes
                </Button>
                <Button variant="secondary" disabled={articles.loadings.includes(`RECOVER_ARTICLE_${articleId}`)} onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}