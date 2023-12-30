import React, { useEffect } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { permanentlyDeleteArticle } from '../../../actions/articles';
import { Loading } from '../../common/loading';
import * as R from 'ramda';

export const PermanentDeleteModal = ({ dispatcher, show, handleClose, deletedArticle, handleCloseRecyclePreview, availableLanguages }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);

    let articleId = !R.isNil(deletedArticle) ? deletedArticle.id : '';
    
    useEffect(()=> {

        if (!R.isNil(deletedArticle) && !R.isNil(articles.recycleBin) && articles.recycleBin.findIndex(art => art.id === deletedArticle.id) === -1){
            handleClose();
            handleCloseRecyclePreview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.recycleBin.length]);

    return (
        <Modal show={show} onHide={articles.loadings.includes(`PERMANENT_DELETE_ARTICLE_${articleId}`) ? null : handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Permanently Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="danger">
                    This action is irreversible! Once the article is deleted it is not possible to recover it.
                </Alert>
                {R.isNil(deletedArticle) ? <Loading /> :
                    <>
                        Are you sure that you want to permanently delete this article?
                        <ul>
                            <li key='articleId' className="text-truncate"><i><strong>ID:</strong> {articleId}</i></li>
                            {
                                availableLanguages.map((langKey) => {
                                    return <li key={`delete-${langKey}`} className="text-truncate"> <strong>{langKey.toUpperCase()}:</strong> {R.isNil(deletedArticle) || R.isNil(deletedArticle.name) || R.isNil(deletedArticle.name[langKey]) || deletedArticle.name[langKey] === '' ? <em className="article-empty-title">Empty title</em> : deletedArticle.name[langKey]}</li>
                                })
                            }
                        </ul>
                    </>
                }
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={articles.loadings.includes(`PERMANENT_DELETE_ARTICLE_${articleId}`)} className={articles.loadings.includes(`PERMANENT_DELETE_ARTICLE_${articleId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    if (!R.isNil(deletedArticle)) {
                        dispatcher(() => dispatch(permanentlyDeleteArticle(deletedArticle)));
                    }
                }}>
                    Yes
                </Button>
                <Button variant="secondary" disabled={articles.loadings.includes(`PERMANENT_DELETE_ARTICLE_${articleId}`)} onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}