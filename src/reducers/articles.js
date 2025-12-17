import * as Actions from '../consts/actions/articles';
import * as CommonActions from '../consts/actions/common';
import Article from '../consts/models/article';
import ArticleBackup from '../consts/models/articleBackup';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import { Languages } from '../consts/mappers/languages';
import { createAction, createReducer } from '@reduxjs/toolkit'

//ARTICLE TOASTERS
const toastArticleCreationSuccess = () => toast.success(`📰 An article was successfully created!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastArticleFetchError = () => toast.error(`😭 Something went wrong. Failed to load articles!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});


const toastArticleCreationError = (message) => toast.error(`${R.isNil(message) ? '😭 Article creation failed!!!' : message}`, {
    position: "bottom-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleBackupFetchError = () => toast.error(`😭 Fetch article's backups failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleBackupContentFetchError = () => toast.error(`😭 Failed to fetch article backup content!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleRestoreBackupSuccess = () => toast.success(`📰 The article was successfully restored to the previous state!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastArticleRestoreBackupError = () => toast.error(`😭 Failed to restore article to previous state!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleUpdateSuccess = () => toast.success(`📝 The article was successfully updated! The changes will be reflected on your website in a couple of minutes.`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastArticleUpdateError = () => toast.error(`😭 The article update failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticlePublishrror = () => toast.error(`😭 Article's publish operation failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleDeleteSuccess = (articleId) => toast.dark(`🗑 Article with id ${articleId} successfully deleted!`, {
    position: "bottom-left",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastArticleDeleteError = (articleId) => toast.error(`😭 Article with id ${articleId} delete failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleRecoverSuccess = (articleId) => toast.dark(`Article with id ${articleId} successfully recover!`, {
    position: "bottom-left",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastRecoverArticleError = (articleId) => toast.error(`😭 Article with id ${articleId} recovery failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticlePermanentDeleteSuccess = (articleId) => toast.dark(`Article with id ${articleId} was permanently deleted!`, {
    position: "bottom-left",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastArticlePermanentDeleteError = (articleId) => toast.error(`😭 Article with id ${articleId} permanent deletetion operation failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleFetchDeletedError = () => toast.error(`😭 Failed to load articles from the recycle bin!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastArticleWasUpdated = () => toast.warn(`Somebody just edited this article. Refresh the page to see changes.`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});
//

const emptyStrings = Object.keys(Languages).reduce(function (result, langKey) {
    result[langKey] = '';
    return result
}, {});

const emptyBoolean = Object.keys(Languages).reduce(function (result, langKey) {
    result[langKey] = false;
    return result
}, {});

const ArticlesReducer = createReducer({
    items: [],
    currentArticle: undefined,
    htmlContent: JSON.parse(JSON.stringify(emptyStrings)),
    htmlContentLoaded: JSON.parse(JSON.stringify(emptyBoolean)),
    articleIdContent: undefined,
    loadings: [],
    files: [],
    backups: [],
    backupContent: undefined,
    restoreSuccess: false,
    recycleBin: [],
    reload: false,
    forceUpdate: false,
    stopReload: true,
    randomId: undefined
}, (builder) => {
    builder
        .addCase(createAction(Actions.ADD_UPDATE_ARTICLE_REQUEST), (state, action) => {
            if (!state.loadings.includes('ADD_UPDATE_ARTICLE'))
                state.loadings.push('ADD_UPDATE_ARTICLE');
        })
        .addCase(createAction(Actions.ADD_UPDATE_ARTICLE_SUCCESS), (state, action) => {
            if (state.currentArticle === undefined) {
                state.currentArticle = new Article(action.data);
            }
            let currentDocIndex = state.items.findIndex(i => i.id === action.data.id);
            if (currentDocIndex === -1) {
                action.data.timestamp = new Date().getTime();
                state.items.push(new Article(action.data));
                toastArticleCreationSuccess();
            }
            else {
                state.items[currentDocIndex] = new Article(action.data);
                toastArticleUpdateSuccess();
            }
            if (!R.isNil(action.htmlContent) && !R.isNil(action.lang)) {
                state.htmlContent[action.lang] = action.htmlContent[action.lang];
            }
            state.loadings = state.loadings.filter(l => l !== 'ADD_UPDATE_ARTICLE');
        })
        .addCase(createAction(Actions.ADD_UPDATE_ARTICLE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'ADD_UPDATE_ARTICLE');
            if (action.error === 'duplicate') {
                let title = R.isNil(action.article.name) ? action.article.Name[action.lang] : action.article.name[action.lang];
                toastArticleCreationError(`An article with "${title}" title in ${Languages[action.lang]} already exists. If article with same name does not appear on the table check recycle bin.`);
            } else if (R.isNil(action.article) || R.isNil(action.article.id)) {
                toastArticleCreationError();
            }
            else {
                toastArticleUpdateError();
            }
        })
        .addCase(createAction(Actions.DELETE_ARTICLE_REQUEST), (state, action) => {
            if (!state.loadings.includes(`DELETE_ARTICLE_${action.article.id}`))
                state.loadings.push(`DELETE_ARTICLE_${action.article.id}`);
        })
        .addCase(createAction(Actions.DELETE_ARTICLE_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_ARTICLE_${action.article.id}`);
            let deletedArticle = state.items.find(a => a.id === action.article.id);
            deletedArticle.markedAsDeletedDate = new Date();
            state.recycleBin.push(deletedArticle);
            state.items = state.items.filter(art => art.id !== action.article.id);
            toastArticleDeleteSuccess(action.article.id);
        })
        .addCase(createAction(Actions.DELETE_ARTICLE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_ARTICLE_${action.article.id}`);
            toastArticleDeleteError(action.article.id);
        })
        .addCase(createAction(Actions.RECOVER_ARTICLE_REQUEST), (state, action) => {

            if (!state.loadings.includes(`RECOVER_ARTICLE_${action.article.id}`))
                state.loadings.push(`RECOVER_ARTICLE_${action.article.id}`);
        })
        .addCase(createAction(Actions.RECOVER_ARTICLE_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `RECOVER_ARTICLE_${action.article.id}`);
            state.items.push(state.recycleBin.find(art => art.id === action.article.id));
            state.recycleBin = state.recycleBin.filter(art => art.id !== action.article.id);
            toastArticleRecoverSuccess(action.article.id);
        })
        .addCase(createAction(Actions.RECOVER_ARTICLE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `RECOVER_ARTICLE_${action.article.id}`);
            toastRecoverArticleError(action.article.id);
        })
        .addCase(createAction(Actions.PERMANENT_DELETE_ARTICLE_REQUEST), (state, action) => {
            if (!state.loadings.includes(`PERMANENT_DELETE_ARTICLE_${action.article.id}`))
                state.loadings.push(`PERMANENT_DELETE_ARTICLE_${action.article.id}`);
        })
        .addCase(createAction(Actions.PERMANENT_DELETE_ARTICLE_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `PERMANENT_DELETE_ARTICLE_${action.article.id}`);
            state.recycleBin = state.recycleBin.filter(art => art.id !== action.article.id);
            toastArticlePermanentDeleteSuccess(action.article.id);
        })
        .addCase(createAction(Actions.PERMANENT_DELETE_ARTICLE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `PERMANENT_DELETE_ARTICLE_${action.article.id}`);
            toastArticlePermanentDeleteError(action.article.id);
        })
        .addCase(createAction(Actions.FETCH_DELETED_ARTICLES_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_DELETED_ARTICLES')) {
                state.loadings.push('FETCH_DELETED_ARTICLES');
            }
        })
        .addCase(createAction(Actions.FETCH_DELETED_ARTICLES_SUCCESS), (state, action) => {
            if (state.loadings.includes('FETCH_DELETED_ARTICLES')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_DELETED_ARTICLES');
            }
            var tmpDeletedItems = action.data.map(d => new Article(d));
            for (let i = 0; i < tmpDeletedItems.length; i++) {
                if (state.recycleBin.findIndex(item => item.id === tmpDeletedItems[i].id) === -1) {
                    state.recycleBin.push(tmpDeletedItems[i]);
                }
            }
        })
        .addCase(createAction(Actions.FETCH_DELETED_ARTICLES_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_DELETED_ARTICLES');
            toastArticleFetchDeletedError();
        })

        .addCase(createAction(Actions.SELECT_ARTICLE), (state, action) => {
            if (action.id === undefined) {
                state.currentArticle = undefined;
                state.htmlContent = JSON.parse(JSON.stringify(emptyStrings));
                state.htmlContentLoaded = JSON.parse(JSON.stringify(emptyBoolean));
                state.loadings = [];
                state.articleIdContent = undefined;
            }
            else {
                let currentArticle = state.items.find(i => i.id === action.id);
                if (!R.isNil(currentArticle)) {
                    state.currentArticle = currentArticle;
                }
            }
        })
        .addCase(createAction(Actions.GET_ARTICLE_SUCCESS), (state, action) => {
            if (!R.isNil(action.data) && !R.isNil(action.data.id)) {
                let itemAlreadyExists = state.items.findIndex(i => i.id === action.data.id);
                if (itemAlreadyExists === -1) {
                    state.items.push(new Article(action.data));
                }
            }
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_CONTENT_REQUEST), (state, action) => {
            state.htmlContent[action.lang] = '';
            if (!state.loadings.includes(`FETCH_ARTICLE_CONTENT_${action.lang.toUpperCase()}`))
                state.loadings.push(`FETCH_ARTICLE_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_CONTENT_SUCCESS), (state, action) => {
            state.htmlContent[action.lang] = action.data;
            state.htmlContentLoaded[action.lang] = true;
            state.articleIdContent = action.id;
            state.loadings = state.loadings.filter(l => l !== `FETCH_ARTICLE_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_CONTENT_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `FETCH_ARTICLE_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.SET_ARTICLE_PUBLISH_REQUEST), (state, action) => {
            if (!state.loadings.includes(`SET_ARTICLE_PUBLISH_${action.id}`))
                state.loadings.push(`SET_ARTICLE_PUBLISH_${action.id}`);
        })
        .addCase(createAction(Actions.SET_ARTICLE_PUBLISH_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `SET_ARTICLE_PUBLISH_${action.id}`);
            let itemIndex = state.items.findIndex(i => i.id === action.id);
            if (itemIndex !== -1) {
                state.items[itemIndex].published = !state.items[itemIndex].published;
                if (state.items[itemIndex].publishDate === new Date('0001-01-01T00:00:00')) {
                    state.items[itemIndex].publishDate = new Date();
                }
            }
        })
        .addCase(createAction(Actions.SET_ARTICLE_PUBLISH_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `SET_ARTICLE_PUBLISH_${action.id}`);
            toastArticlePublishrror();
        })
        .addCase(createAction(Actions.FETCH_ALL_ARTICLES_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_ALL_ARTICLES')) {
                state.loadings.push('FETCH_ALL_ARTICLES');
            }
            state.reload = false;
        })
        .addCase(createAction(Actions.FETCH_ALL_ARTICLES_SUCCESS), (state, action) => {
            if (action.type === createAction(Actions.FETCH_ALL_ARTICLES_SUCCESS) && state.loadings.includes('FETCH_ALL_ARTICLES')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_ALL_ARTICLES');
            }
            var tmpItems = action.data.map(d => new Article(d));
            for (let i = 0; i < tmpItems.length; i++) {
                if (state.items.findIndex(item => item.id === tmpItems[i].id) === -1) {
                    state.items.push(tmpItems[i]);
                } else {
                    state.items[i] = tmpItems[i];
                }
            }
            if (state.stopReload !== true && state.forceUpdate === false) {
                state.stopReload = true;
                state.forceUpdate = true;
            }
        })
        .addCase(createAction(Actions.FETCH_ALL_ARTICLES_FAILURE), (state, action) => {
            if (state.loadings.includes('FETCH_ALL_ARTICLES')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_ALL_ARTICLES');
            }
            toastArticleFetchError();
        })
        .addCase(createAction(Actions.STOP_FORCED_UPDATE), (state, action) => {
            state.forceUpdate = false;
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_REQUEST), (state, action) => {
            if (!state.loadings.includes(`FETCH_ARTICLE_BACKUP_${action.id.toUpperCase()}_${action.lang.toUpperCase()}`))
                state.loadings.push(`FETCH_ARTICLE_BACKUP_${action.id.toUpperCase()}_${action.lang.toUpperCase()}`);
            state.backups = [];
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `FETCH_ARTICLE_BACKUP_${action.id.toUpperCase()}_${action.lang.toUpperCase()}`);
            var tmpBackups = action.data.map(d => new ArticleBackup(d));
            for (let i = 0; i < tmpBackups.length; i++) {
                if (state.backups.findIndex(item => item.id === tmpBackups[i].id && JSON.stringify(item.modificationDate) === JSON.stringify(tmpBackups[i].modificationDate)) === -1) {
                    state.backups.push(tmpBackups[i]);
                }
            }
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `FETCH_ARTICLE_BACKUP_${action.id.toUpperCase()}_${action.lang.toUpperCase()}`);
            toastArticleBackupFetchError();
        })

        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_CONTENT_REQUEST), (state, action) => {
            if (!state.loadings.includes(`FETCH_ARTICLE_BACKUP_CONTENT`))
                state.loadings.push(`FETCH_ARTICLE_BACKUP_CONTENT`);
            state.backupContent = undefined;
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_CONTENT_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `FETCH_ARTICLE_BACKUP_CONTENT`);
            state.backupContent = action.data;
        })
        .addCase(createAction(Actions.FETCH_ARTICLE_BACKUP_CONTENT_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `FETCH_ARTICLE_BACKUP_CONTENT`);
            toastArticleBackupContentFetchError();
        })
        .addCase(createAction(Actions.RESTORE_ARTICLE_BACKUP_REQUEST), (state, action) => {
            if (!state.loadings.includes(`RESTORE_ARTICLE_BACKUP`)) {
                state.loadings.push(`RESTORE_ARTICLE_BACKUP`);
            }
            state.restoreSuccess = false;
        })
        .addCase(createAction(Actions.RESTORE_ARTICLE_BACKUP_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `RESTORE_ARTICLE_BACKUP`);
            let currentArticleIndex = state.items.findIndex(i => i.id === action.data.id);
            if (currentArticleIndex === -1) {
                toastArticleRestoreBackupError();
            }
            else {
                state.items[currentArticleIndex] = new Article(action.data);
                if (!R.isNil(action.lang)) {
                    state.htmlContent[action.lang.toLowerCase()] = state.backupContent;
                }
                toastArticleRestoreBackupSuccess();
                state.restoreSuccess = true;
            }
        })
        .addCase(createAction(Actions.RESTORE_ARTICLE_BACKUP_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(s => s !== `RESTORE_ARTICLE_BACKUP`);
            toastArticleRestoreBackupError();
        })
        .addCase(createAction(CommonActions.SIGNALR_SEND_MESSAGE_REQUEST), (state, action) => {
            state.randomId = action.message.randomId;
        })
        .addCase(createAction(CommonActions.SIGNALR_RCV_MESSAGE), (state, action) => {
            if (action.message.page === "articles" && action.message.action === "save" && state.reload === false && !state.loadings.includes('FETCH_ALL_ARTICLES')) {
                if (!window.location.hash.includes(state.articleIdContent)) {
                    state.reload = true;
                }
                state.stopReload = false;
                if (action.message.payload.id === state.articleIdContent && action.message.randomId !== state.randomId) {
                    toastArticleWasUpdated();
                }
            }
        })
});

export default ArticlesReducer;