import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticles } from '../../actions/articles';
import { ArticleModal } from './articleModal';
import { DeleteModal } from './deleteModal';
import * as diacritics from 'diacritics';
import { ArticlesTable } from './articlesTable';
import { Toolbar } from './toolbar';
import * as R from 'ramda';
import { Loading } from '../common/loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getArticleContentById } from '../../actions/articles';
import { RecycleBin } from './recycle';
import { RecoverModal } from './recycle/recoverModal'
import { RecyclePreviewModal } from './recycle/recyclePreviewModal';
import { PermanentDeleteModal } from './recycle/permanentDeleteModal';

export const Articles = ({ dispatcher }) => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const articles = useSelector(state => state.articles);
  const [selectedArticle, setSelectedArticle] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [show, setShowAddNewArticle] = useState(false);

  const handleCloseAddNewArticle = () => setShowAddNewArticle(false);
  const handleShowAddNewArticle = () => setShowAddNewArticle(true);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const [showRecycle, setShowRecycle] = useState(false);
  const handleCloseRecycle = () => setShowRecycle(false);
  const handleShowRecycle = () => setShowRecycle(true);

  const [showRecyclePreview, setShowRecyclePreview] = useState(false);
  const [selectedDeletedArticle, setSelectedDeletedArticle] = useState(undefined);
  const handleCloseRecyclePreview = () => {
    setShowRecyclePreview(false)
    setSelectedDeletedArticle(undefined);
  };
  const handleShowRecyclePreview = (deletedArticle) => {
    setShowRecyclePreview(true)
    setSelectedDeletedArticle(deletedArticle);
    if (showRecyclePreview === false) {
      dispatcher(() => dispatch(getArticleContentById(deletedArticle.id, currentLang)));
    }
  };

  const [showRecover, setShowRecover] = useState(false);
  const handleCloseRecover = () => setShowRecover(false);
  const handleShowRecover = () => setShowRecover(true);

  const [showPermanentDelete, setShowPermanentDelete] = useState(false);
  const handleClosePermanentDelete = () => setShowPermanentDelete(false);
  const handleShowPermanentDelete = () => setShowPermanentDelete(true);

  const [currentLang, setCurrentLang] = useState()

  useEffect(() => {
    dispatcher(() => dispatch(getAllArticles()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (articles.reload) {
      dispatcher(() => dispatch(getAllArticles()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles.reload]);

  useEffect(() => {
    setAvailableLanguages(settings.options.languages);
  }, [settings.options]);

  useEffect(() => {
    if (!R.isNil(selectedArticle) && articles.items.findIndex(art => art.id === selectedArticle.id) === -1) {
      setSelectedArticle(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles.items.length]);

  useEffect(() => {
    if (showRecyclePreview === true && !R.isNil(selectedDeletedArticle)) {
      dispatcher(() => dispatch(getArticleContentById(selectedDeletedArticle.id, currentLang)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  useEffect(() => {
    if (availableLanguages.length > 0) {
      if (R.isNil(currentLang) && !R.isNil(availableLanguages) && currentLang !== availableLanguages[0]) {
        setCurrentLang(availableLanguages.length > 0 ? availableLanguages[0] : currentLang);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableLanguages]);

  if (R.isNil(articles)) {
    return <Loading />;
  }

  let entriesToDisplay = entries.filter(item => {
    let allLangName = filters.map(f => f.value).map(langKey => item.name[langKey]).join('');
    let itemText = diacritics.remove(`${allLangName}${item.date}`).replace(/ /g, '').toLowerCase().trim();
    if (allLangName === '' || (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim())))) {
      return '';
    }
    return item;
  });

  return (
    <div className="Blog">
      <h4 className="text-center">
        Article Manager
      </h4>
      <Toolbar selectedArticle={selectedArticle} handleShowNewArticle={handleShowAddNewArticle} handleShowDelete={handleShowDelete} handleShowRecycle={handleShowRecycle} setSearchFilter={setSearchFilter} setFilters={setFilters} filters={filters} availableLanguages={availableLanguages} />
      {
        articles.loadings.includes('FETCH_ARTICLES') || settings.loadings.includes('FETCH_SETTINGS') ?
          <Loading /> :
          <ArticlesTable selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle} entriesToDisplay={entriesToDisplay} entries={entries} setEntries={setEntries} availableLanguages={availableLanguages} filters={filters.map(f => f.value)} />
      }
      {
        settings.user.isViewer ? '' :
          <>
            <ArticleModal show={show} handleClose={handleCloseAddNewArticle} availableLanguages={availableLanguages} dispatcher={dispatcher} />
            <DeleteModal show={showDelete} handleClose={handleCloseDelete} articleToDelete={entries.find(e => selectedArticle === e.id)} dispatcher={dispatcher} availableLanguages={availableLanguages} />
            <RecycleBin show={showRecycle} setCurrentLang={setCurrentLang} handleClose={handleCloseRecycle} handleShowRecover={handleShowRecover} handleShowPermanentDelete={handleShowPermanentDelete} availableLanguages={availableLanguages} handleCloseRecyclePreview={handleCloseRecyclePreview} handleShowRecyclePreview={handleShowRecyclePreview} dispatcher={dispatcher} selectedDeletedArticle={selectedDeletedArticle} />
            <RecyclePreviewModal show={showRecyclePreview} handleClose={handleCloseRecyclePreview} deletedArticle={selectedDeletedArticle} availableLanguages={availableLanguages} currentLang={currentLang} />
            <RecoverModal dispatcher={dispatcher} show={showRecover} handleClose={handleCloseRecover} handleCloseRecyclePreview={handleCloseRecyclePreview} deletedArticle={selectedDeletedArticle} />
            <PermanentDeleteModal dispatcher={dispatcher} show={showPermanentDelete} handleClose={handleClosePermanentDelete} handleCloseRecyclePreview={handleCloseRecyclePreview} deletedArticle={selectedDeletedArticle} availableLanguages={availableLanguages} />
          </>
      }
    </div>
  );
};
