import * as Actions from '../consts/actions/users';
import * as Url from '../consts/urls/users';
import {logOutUser} from './common';
import axios from 'axios';

export function getUsers(){
	
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_USERS_REQUEST });
		return axios.get(Url.FETCH_USERS_URL())
		.then((response) => {
			dispatch({
				type: Actions.FETCH_USERS_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_USERS_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}


export function inviteUser(user){
    return (dispatch) => {
		dispatch({ type: Actions.INVITE_USER_REQUEST, user: user });
		return axios.post(Url.FETCH_USERS_URL(), user)
		.then((response) => {
			dispatch({
				type: Actions.INVITE_USER_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.INVITE_USER_FAILURE,
				user: user,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function deleteUser(user){
    return (dispatch) => {
		dispatch({ type: Actions.DELETE_USER_REQUEST, user: user });
		return axios.delete(Url.DELETE_USER_URL(user.id))
		.then((response) => {
			dispatch({
				type: Actions.DELETE_USER_SUCCESS,
				user: user,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.DELETE_USER_FAILURE,
				user: user,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function editUser(user){
    return (dispatch) => {
		dispatch({ type: Actions.EDIT_USER_REQUEST, user: user });
		return axios.patch(Url.FETCH_USERS_URL(), user)
		.then((response) => {
			dispatch({
				type: Actions.EDIT_USER_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.EDIT_USER_FAILURE,
				user: user,
				response: error.response
			});
			throw error.statusText;
		});
	};
}