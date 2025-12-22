import { Offcanvas,  Tabs, Tab, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RecycleEntry } from './recycleEntry';
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import { getDeletedArticles } from '../../../actions/articles';
import { Languages } from '../../../consts/mappers/languages';
import { Loading } from '../../common/loading';

export const RecycleBin = ({ show, handleClose, handleCloseRecyclePreview, handleShowRecyclePreview, dispatcher, handleShowRecover, handleShowPermanentDelete, selectedDeletedArticle, availableLanguages, setCurrentLang }) => {
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(true);
    const sortByDate = R.sortBy(R.prop('modificationDate'));

    useEffect(() => {
        dispatcher(() => dispatch(getDeletedArticles()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let filteredArticles = articles.recycleBin.length > 0 ? R.reverse(sortByDate(articles.recycleBin)) : [];

    return (
        <Offcanvas show={show} onHide={() => { handleClose(); handleCloseRecyclePreview(); }} placement={'end'} className={settings.darkmode ? 'dark-mode' : ''} >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Recycle bin</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {
                    articles.loadings.includes('FETCH_DELETED_ARTICLES') ? <Loading /> :
                        <>
                            {showAlert ?
                                <Alert variant="primary" onClose={() => setShowAlert(false)} dismissible={true}>
                                    After 30 days of being deleted the article is permanently removed from the recycle bin.
                                </Alert>
                                : ''
                            }

                            {filteredArticles.length > 0 ?
                                <Tabs id="language-tabs" className={settings.darkmode ? 'dark-mode-tabs' : ''} onClick={(e) => {
                                    setCurrentLang(e.target.dataset.rrUiEventKey);
                                }}>
                                    {availableLanguages.map((langKey, index) => {
                                        return <Tab key={'recycle-' + langKey + '-' + index} title={Languages[langKey]} eventKey={langKey}>
                                            {
                                                filteredArticles.map(art => {
                                                    return <RecycleEntry deletedArticle={art} lang={langKey} handleShowRecyclePreview={handleShowRecyclePreview} handleCloseRecyclePreview={handleCloseRecyclePreview} handleShowPermanentDelete={handleShowPermanentDelete} handleShowRecover={handleShowRecover} selectedDeletedArticle={selectedDeletedArticle} />
                                                })
                                            }
                                        </Tab>;
                                    })}
                                </Tabs>
                                : 'Recycle bin is empty'}
                        </>
                }
            </Offcanvas.Body>
        </Offcanvas>
    )
}