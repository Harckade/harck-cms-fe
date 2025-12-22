import * as Actions from '../consts/actions/settings';
import * as CommonActions from '../consts/actions/common';
import * as Url from '../consts/urls/settings';
import {logOutUser} from './common';
import axios from 'axios';
import SignalRMessage from '../consts/models/signalRMessage';

export function setUserData(userData){
	return (dispatch) => { dispatch({type: Actions.SET_USER_DATA, userData: userData});}
}

export function setThemeMode(isDark){
	if (isDark){
		document.body.classList.add('dark-mode');
	}
	else{
		document.body.classList.remove('dark-mode');
	}
	return (dispatch) => { 
		dispatch({type: Actions.READ_STORAGE_DARKMODE, data: isDark});
	}
}

export function getSettings(){
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_SETTINGS_REQUEST });
		return axios.get(Url.SETTINGS_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_SETTINGS_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_SETTINGS_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function updateSettings(settings){
    return (dispatch) => {
		dispatch({ type: Actions.UPDATE_SETTINGS_REQUEST, settings: settings });
		return axios.post(Url.SETTINGS_URL(), {languages: settings.languages, defaultLanguage: settings.defaultLanguage})
		.then((response) => {
			dispatch({
				type: Actions.UPDATE_SETTINGS_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.UPDATE_SETTINGS_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function launchDeployment(){
    return (dispatch) => {
		dispatch({ type: Actions.LAUNCH_DEPLOYMENT_REQUEST});
		return axios.get(Url.DEPLOY_URL())
		.then(() => {
			dispatch({
				type: Actions.LAUNCH_DEPLOYMENT_SUCCESS
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.LAUNCH_DEPLOYMENT_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function storeSignalRConnection(connection) {
	return (dispatch) => {
		dispatch({
			type: Actions.SIGNALR_CONNECTED,
			connection: connection
		});
	}
}

export function sendSignalRMessage(message) {
	return (dispatch) => {
		dispatch({ type: CommonActions.SIGNALR_SEND_MESSAGE_REQUEST, message });
		return axios.post(Url.SEND_NOTIFICATIONS_URL(), new SignalRMessage({
			action: message.action,
			page: message.page,
			payload: JSON.stringify(message.payload),
			randomId: message.randomId
		}))
			.then(() => {
				dispatch({
					type: Actions.SIGNALR_SEND_MESSAGE_SUCCESS,
					message: message
				});
			})
			.catch((error) => {
				dispatch({
					type: Actions.SIGNALR_SEND_MESSAGE_FAILURE,
					response: error.response
				});
				throw error.statusText;
			});
	};
}

export function receivedSignalRMessage(message) {
	return (dispatch) => {
		dispatch({
			type: CommonActions.SIGNALR_RCV_MESSAGE,
			message: new SignalRMessage(message)
		});
	}
}