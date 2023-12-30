import * as Actions from '../consts/actions/journal';
import * as Url from '../consts/urls/journal';
import {logOutUser} from './common';
import axios from 'axios';

export function getJournal(startDate, endDate){
	
    return (dispatch) => {
		dispatch({ type: Actions.FETCH_JOURNAL_REQUEST });
		return axios.get(Url.JOURNAL_URL(), {params: {startDate: startDate, endDate: endDate}})
		.then((response) => {
			dispatch({
				type: Actions.FETCH_JOURNAL_SUCCESS,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.FETCH_JOURNAL_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}