import { Offcanvas, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { HistoryEntry } from './historyEntry';
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import { getArticleBackup } from '../../../actions/articles';

export const HistoryBar = ({ show, handleClose, handleCloseHistoryPreview, handleShowHistoryPreview, dispatcher, articleId, currentLang, handleShowRestore, selectedBackup }) => {
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);
    const dispatch = useDispatch();
    const sortByDate = R.sortBy(R.prop('modificationDate'));
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        if (!R.isNil(articleId) && !R.isNil(currentLang)) {
            dispatcher(() => dispatch(getArticleBackup(articleId, currentLang)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleId, currentLang]);

    let filteredArticles = articles.backups.length > 0 ? R.reverse(sortByDate(articles.backups)).filter(a => a.language.toLowerCase() === currentLang) : [];

    return (
        <Offcanvas show={show} onHide={() => { handleClose(); handleCloseHistoryPreview(); }} placement={'end'} className={settings.darkmode ? 'dark-mode' : ''}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {showAlert ? <Alert variant="primary" onClose={() => setShowAlert(false)} dismissible={true}>
                    Before restoring to a previous state, make sure that all current work is saved
                </Alert> : ''}
                {
                    filteredArticles.length > 0 ? filteredArticles.map(backup => {
                        return <HistoryEntry backup={backup} handleShowHistoryPreview={handleShowHistoryPreview} handleShowRestore={handleShowRestore} selectedBackup={selectedBackup}/>
                    }) : 'No history found'
                }
            </Offcanvas.Body>
        </Offcanvas>
    )
}