import React, { useEffect } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNewsletter } from '../../../actions/newsletter';
import { Loading } from '../../common/loading';
import * as R from 'ramda';

export const DeleteModal = ({ dispatcher, show, handleClose, selectedNewsletter, availableLanguages }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);

    let newsletterId = !R.isNil(selectedNewsletter) ? selectedNewsletter.id : '';
    
    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.items.length]);

    return (
        <Modal show={show} onHide={newsletter.loadings.includes(`DELETE_NEWSLETTER_${newsletterId}`) ? null : handleClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode' : ''}>
                <Modal.Title>Permanently Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Alert variant="danger">
                    This action is irreversible! Once the newsletter is deleted it is not possible to recover it.
                </Alert>
                {R.isNil(selectedNewsletter) ? <Loading /> :
                    <>
                        Are you sure that you want to permanently delete this newsletter?
                        <ul>
                            <li key='newsletterId' className="text-truncate"><i><strong>ID:</strong> {newsletterId}</i></li>
                            {
                                availableLanguages.map((langKey) => {
                                    return <li key={`delete-${langKey}`} className="text-truncate"> <strong>{langKey.toUpperCase()}:</strong> {R.isNil(selectedNewsletter) || R.isNil(selectedNewsletter.name) || R.isNil(selectedNewsletter.name[langKey]) || selectedNewsletter.name[langKey] === '' ? <em className="article-empty-title">Empty title</em> : selectedNewsletter.name[langKey]}</li>
                                })
                            }
                        </ul>
                    </>
                }
            </Modal.Body>
            <Modal.Footer className={settings.darkmode ? 'dark-mode' : ''}>
                <Button variant="success" disabled={newsletter.loadings.includes(`DELETE_NEWSLETTER_${newsletterId}`)} className={newsletter.loadings.includes(`DELETE_NEWSLETTER_${newsletterId}`) ? "progress-bar-striped progress-bar-animated" : ''} onClick={() => {
                    if (!R.isNil(selectedNewsletter)) {
                        dispatcher(() => dispatch(deleteNewsletter(selectedNewsletter)));
                    }
                }}>
                    Yes
                </Button>
                <Button variant="secondary" disabled={newsletter.loadings.includes(`DELETE_NEWSLETTER_${newsletterId}`)} onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}