import * as Actions from '../consts/actions/newsletter';
import * as Url from '../consts/urls/newsletter';
import {logOutUser} from './common';
import axios from 'axios';

export function getAllNewsletters(){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_NEWSLETTERS_REQUEST });
		return axios.get(Url.NEWSLETTERS_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_NEWSLETTERS_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_NEWSLETTERS_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function deleteNewsletter(newsletter) {
	return (dispatch) => {
		dispatch({ type: Actions.DELETE_NEWSLETTER_REQUEST, newsletter: newsletter });
		return axios.delete(Url.NEWSLETTER_ID_URL(newsletter.id))
			.then((response) => {
				dispatch({
					type: Actions.DELETE_NEWSLETTER_SUCCESS,
					data: response.data,
					newsletter: newsletter
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.DELETE_NEWSLETTER_FAILURE,
					response: error.response,
					newsletter: newsletter
				});
				throw error.statusText;
			});
	};
}

export function saveNewsletter(newsletter, lang){
    return (dispatch) => {
		dispatch({ type: Actions.ADD_UPDATE_NEWSLETTER_REQUEST, newsletter: newsletter, lang: lang });
		return axios.put(Url.NEWSLETTERS_URL(), newsletter, {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.ADD_UPDATE_NEWSLETTER_SUCCESS,
				data: response.data,
				htmlContent: newsletter.HtmlContent,
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
					type: Actions.ADD_UPDATE_NEWSLETTER_FAILURE,
					error: 'duplicate',
					newsletter: newsletter,
					lang: error.response.data.toLowerCase()
				})
				return;
			}
			dispatch({
				type: Actions.ADD_UPDATE_NEWSLETTER_FAILURE,
				response: error.response,
				newsletter: newsletter
			});
			throw error.statusText;
		});
	};
}

export function getNewsletterById(id){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_NEWSLETTER_REQUEST, id: id });
		return axios.get(Url.NEWSLETTER_ID_URL(id))
		.then((response) => {
			dispatch({
				type: Actions.FETCH_NEWSLETTER_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_NEWSLETTER_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function getNewsletterContentById(id, lang){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_NEWSLETTER_CONTENT_REQUEST, id: id, lang: lang });
		return axios.get(Url.NEWSLETTER_ID_CONTENT_URL(id), {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.FETCH_NEWSLETTER_CONTENT_SUCCESS,
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
				type: Actions.FETCH_NEWSLETTER_CONTENT_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function sendNewsletterById(id){
    return (dispatch) => {
		dispatch({ type: Actions.SEND_NEWSLETTER_REQUEST, id: id });
		return axios.get(Url.NEWSLETTER_ID_SEND_URL(id))
		.then((response) => {
			dispatch({
				type: Actions.SEND_NEWSLETTER_SUCCESS,
				data: response.data,
				id: id
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.SEND_NEWSLETTER_FAILURE,
				response: error.response,
				id: id
			});
			throw error.statusText;
		});
	};
}

export function getAllSubscribers(){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_SUBSCRIBERS_REQUEST });
		return axios.get(Url.SUBSCRIBERS_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_SUBSCRIBERS_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_SUBSCRIBERS_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	}; 
}

export function deleteSubscriberById(subscriber){
    return (dispatch) => {
		dispatch({ type: Actions.DELETE_SUBSCRIBER_REQUEST, id: subscriber.id, emailAddress: subscriber.emailAddress });
		return axios.delete(Url.SUBSCRIBERS_ID_URL(subscriber.id))
		.then(() => {
			dispatch({
				type: Actions.DELETE_SUBSCRIBER_SUCCESS,
				id: subscriber.id,
				email: subscriber.emailAddress
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.DELETE_SUBSCRIBER_FAILURE,
				response: error.response,
				id: subscriber.id,
				email: subscriber.emailAddress
			});
			throw error.statusText;
		});
	}; 
}

export function selectDocument(id) {
	return (dispatch) => {
		dispatch({ type: Actions.SELECT_NEWSLETTER, id: id })
	}
};

export function unselectDocument(){
	return (dispatch) => {
		dispatch({ type: Actions.SELECT_NEWSLETTER, id: undefined })
	}
};

export function stopForcedUpdate() {
	return (dispatch) => {
		dispatch({
			type: Actions.STOP_FORCED_UPDATE
		});
	}
}

export function saveSubscriptionTemplate(template, lang){
    return (dispatch) => {
		dispatch({ type: Actions.ADD_UPDATE_SUB_TEMPLATE_REQUEST, template: template, lang: lang });
		return axios.put(Url.SUBSCRIPTION_TEMPLATE_URL(), template, {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.ADD_UPDATE_SUB_TEMPLATE_SUCCESS,
				data: response.data,
				htmlContent: template.HtmlContent,
				lang: lang
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.ADD_UPDATE_SUB_TEMPLATE_FAILURE,
				response: error.response,
				template: template
			});
			throw error.statusText;
		});
	};
}

export function getSubscriptionTemplate(){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_SUB_TEMPLATE_REQUEST });
		return axios.get(Url.SUBSCRIPTION_TEMPLATE_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_SUB_TEMPLATE_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_SUB_TEMPLATE_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function getSubscriptionTemplateContent(lang){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_SUB_TEMPLATE_CONTENT_REQUEST, lang: lang });
		return axios.get(Url.SUBSCRIPTION_TEMPLATE_CONTENT_URL(), {params: {lang: lang}})
		.then((response) => {
			dispatch({
				type: Actions.FETCH_SUB_TEMPLATE_CONTENT_SUCCESS,
				data: response.data,
				lang: lang
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_SUB_TEMPLATE_CONTENT_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}