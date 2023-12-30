import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Modal } from 'react-bootstrap';
import { deleteArticle } from '../../actions/articles';

export const DeleteModal = ({ show, handleClose, articleToDelete, dispatcher, availableLanguages }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);

    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.items.length]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Delete article</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>This article will be permanently deleted: {R.isNil(articleToDelete) ? '' :
                <ul>
                    {
                        availableLanguages.map((langKey) => {
                            return <li key={`delete-${langKey}`} className="text-truncate"> <strong>{langKey.toUpperCase()}:</strong> {R.isNil(articleToDelete) || R.isNil(articleToDelete.name) || R.isNil(articleToDelete.name[langKey]) || articleToDelete.name[langKey] === '' ? <em className="article-empty-title">Empty title</em> : articleToDelete.name[langKey]}</li>
                        })
                    }
                </ul>
            }</Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button variant="danger" className={!R.isNil(articleToDelete) && articles.loadings.includes('DELETE_ARTICLE_' + articleToDelete.id) ? "progress-bar-striped progress-bar-animated": ''} disabled={R.isNil(articleToDelete) || articles.loadings.includes('DELETE_ARTICLE_' + articleToDelete.id)} onClick={() => {
                    dispatcher(() => dispatch(deleteArticle(articleToDelete)));
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