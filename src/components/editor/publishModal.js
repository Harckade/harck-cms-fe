import React, { useEffect } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setPublishArticleById } from '../../actions/articles';
import * as R from 'ramda';

export const PublishModal = ({ dispatcher, show, handleClose, articleId }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const article = useSelector(state => state.articles);

    useEffect(() => {
        if (!article.loadings.includes(`SET_ARTICLE_PUBLISH_${articleId}`)) {
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [article.loadings.length]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>{!R.isNil(article.currentArticle) && article.currentArticle.published === true ? 'Unpublish' : 'Publish'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="primary">
                    In order to {!R.isNil(article.currentArticle) && article.currentArticle.published === true ? 'remove' : 'publish'} this article {!R.isNil(article.currentArticle) && article.currentArticle.published === true ? 'from' : 'at'} the static website, please launch the deployment after completing this operation.
                </Alert>
                <p>{!R.isNil(article.currentArticle) && article.currentArticle.published === true ? "The article's content will remain stored. Hide this article from the publishing list?" : 'The article will be published in all languages except for those that have an empty title (even if there is any content). It can take several minutes (~10) to be reflected on your website.'}</p>
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={article.loadings.includes(`SET_ARTICLE_PUBLISH_${articleId}`)} className={article.loadings.includes(`SET_ARTICLE_PUBLISH_${articleId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    dispatcher(() => dispatch(setPublishArticleById(articleId)));
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