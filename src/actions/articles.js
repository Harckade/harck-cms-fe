import * as Actions from '../consts/actions/articles';
import * as Url from '../consts/urls/articles';
import {logOutUser} from './common';
import axios from 'axios';

export function getAllArticles(){
	
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_ALL_ARTICLES_REQUEST });
		return axios.get(Url.ARTICLES_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_ALL_ARTICLES_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_ALL_ARTICLES_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function getDeletedArticles() {
	return (dispatch) => {
		dispatch({ type: Actions.FETCH_DELETED_ARTICLES_REQUEST });
		return axios.get(Url.ARTICLES_DELETED_URL())
			.then((response) => {
				dispatch({
					type: Actions.FETCH_DELETED_ARTICLES_SUCCESS,
					data: response.data
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.FETCH_DELETED_ARTICLES_FAILURE,
					response: error.response
				});
				throw error.statusText;
			});
	};
}

export function recoverDeletedArticle(article) {
	return (dispatch) => {
		dispatch({ type: Actions.RECOVER_ARTICLE_REQUEST, article: article });
		return axios.patch(Url.ARTICLES_DELETED_RECOVER_URL(article.id))
			.then((response) => {
				dispatch({
					type: Actions.RECOVER_ARTICLE_SUCCESS,
					data: response.data,
					article: article
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.RECOVER_ARTICLE_FAILURE,
					response: error.response,
					article: article
				});
				throw error.statusText;
			});
	};
}

export function permanentlyDeleteArticle(article) {
	return (dispatch) => {
		dispatch({ type: Actions.PERMANENT_DELETE_ARTICLE_REQUEST, article: article });
		return axios.delete(Url.ARTICLES_PERMANENT_DELETE_URL(article.id))
			.then((response) => {
				dispatch({
					type: Actions.PERMANENT_DELETE_ARTICLE_SUCCESS,
					data: response.data,
					article: article
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.PERMANENT_DELETE_ARTICLE_FAILURE,
					response: error.response,
					article: article
				});
				throw error.statusText;
			});
	};
}

export function saveArticle(article, lang){
    return (dispatch) => {
		dispatch({ type: Actions.ADD_UPDATE_ARTICLE_REQUEST, article: article, lang: lang });
		return axios.put(Url.ARTICLES_URL(), article, {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.ADD_UPDATE_ARTICLE_SUCCESS,
				data: response.data,
				htmlContent: article.HtmlContent,
				lang: lang
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			else if(error.response.status === 409){
				dispatch({
					type: Actions.ADD_UPDATE_ARTICLE_FAILURE,
					error: 'duplicate',
					article: article,
					lang: error.response.data.toLowerCase()
				})
				return;
			}
			dispatch({
				type: Actions.ADD_UPDATE_ARTICLE_FAILURE,
				response: error.response,
				article: article
			});
			throw error.statusText;
		});
	};
}

export function getArticleById(id){
    return (dispatch) => {
		dispatch({ type: Actions.GET_ARTICLE_REQUEST, id: id });
		return axios.get(Url.ARTICLE_ID_URL(id))
		.then((response) => {
			dispatch({
				type: Actions.GET_ARTICLE_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.GET_ARTICLE_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function deleteArticle(article){
    return (dispatch) => {
		dispatch({ type: Actions.DELETE_ARTICLE_REQUEST, article: article });
		return axios.delete(Url.ARTICLE_ID_URL(article.id))
		.then(() => {
			dispatch({
				type: Actions.DELETE_ARTICLE_SUCCESS,
				article: article
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.DELETE_ARTICLE_FAILURE,
				response: error.response,
				article: article
			});
			throw error.statusText;
		});
	};
}

export function getArticleContentById(id, lang){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_ARTICLE_CONTENT_REQUEST, id: id, lang: lang });
		return axios.get(Url.ARTICLE_ID_CONTENT_URL(id), {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.FETCH_ARTICLE_CONTENT_SUCCESS,
				data: response.data,
				lang: lang,
				id: id
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_ARTICLE_CONTENT_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function setPublishArticleById(id){
    return (dispatch) => {
		dispatch({ type: Actions.SET_ARTICLE_PUBLISH_REQUEST, id: id });
		return axios.patch(Url.ARTICLE_ID_URL(id))
		.then(() => {
			dispatch({
				type: Actions.SET_ARTICLE_PUBLISH_SUCCESS,
				id: id
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.SET_ARTICLE_PUBLISH_FAILURE,
				response: error.response,
				id: id
			});
			throw error.statusText;
		});
	};
}

export function getArticleBackup(id, lang) {
	return (dispatch) => {
		dispatch({ type: Actions.FETCH_ARTICLE_BACKUP_REQUEST, id: id, lang: lang });
		return axios.get(Url.ARTICLE_BACKUP(id, lang))
			.then((response) => {
				dispatch({
					type: Actions.FETCH_ARTICLE_BACKUP_SUCCESS,
					data: response.data,
					id: id,
					lang: lang
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.FETCH_ARTICLE_BACKUP_FAILURE,
					response: error.response,
					id: id,
					lang: lang
				});
				throw error.statusText;
			});
	};
}

export function getArticleBackupContent(id, lang, modificationDate) {
	return (dispatch) => {
		dispatch({ type: Actions.FETCH_ARTICLE_BACKUP_CONTENT_REQUEST, id: id, lang: lang, modificationDate: modificationDate });
		return axios.get(Url.ARTICLE_BACKUP_CONTENT(id, lang, modificationDate.toISOString()))
			.then((response) => {
				dispatch({
					type: Actions.FETCH_ARTICLE_BACKUP_CONTENT_SUCCESS,
					data: response.data,
					id: id,
					lang: lang,
					modificationDate: modificationDate
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.FETCH_ARTICLE_BACKUP_CONTENT_FAILURE,
					response: error.response,
					id: id,
					lang: lang,
					modificationDate: modificationDate
				});
				throw error.statusText;
			});
	};
}

export function restoreArticleFromBackup(id, lang, modificationDate) {
	return (dispatch) => {
		dispatch({ type: Actions.RESTORE_ARTICLE_BACKUP_REQUEST, id: id, lang: lang, modificationDate: modificationDate });
		return axios.patch(Url.RESTORE_BACKUP(id, lang, modificationDate.toISOString()))
			.then((response) => {
				dispatch({
					type: Actions.RESTORE_ARTICLE_BACKUP_SUCCESS,
					data: response.data,
					id: id,
					lang: lang,
					modificationDate: modificationDate
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.RESTORE_ARTICLE_BACKUP_FAILURE,
					response: error.response,
					id: id,
					lang: lang,
					modificationDate: modificationDate
				});
				throw error.statusText;
			});
	};
}

export function selectDocument(id) {
	return (dispatch) => {
		dispatch({ type: Actions.SELECT_ARTICLE, id: id })
	}
};

export function unselectDocument(){
	return (dispatch) => {
		dispatch({ type: Actions.SELECT_ARTICLE, id: undefined })
	}
};

export function stopForcedUpdate() {
	return (dispatch) => {
		dispatch({
			type: Actions.STOP_FORCED_UPDATE
		});
	}
}