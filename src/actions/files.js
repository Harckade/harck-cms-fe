import * as Actions from '../consts/actions/files';
import * as Url from '../consts/urls/files';
import * as R from 'ramda';
import {logOutUser} from './common';
import axios from 'axios';

export function uploadFile(file, path){
    return (dispatch) => {
		var formData = new FormData();
		formData.append("file", file);
		let fileType = 'binary';
		if(file.type.startsWith('image/')){
			fileType = 'image';
		}
		else if(file.type.startsWith('video/')){
			fileType = 'video';
		}
        else if(file.type.startsWith('application/pdf')){
			fileType = 'pdf';
		}

		let _file =  {name: file.name, fileType: fileType, timestamp: Date.now(), size: file.size, id: fileType + '_' + file.name};
		dispatch({ type: Actions.UPLOAD_FILE_REQUEST, file:_file, path:path});
		return axios.post(Url.FILES_URL(!R.isNil(path)? path: ''), formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(() => {
			dispatch({
				type: Actions.UPLOAD_FILE_SUCCESS,
				file: _file
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.UPLOAD_FILE_FAILURE,
				response: error.response,
				file: _file
			});
			throw error.statusText;
		});
	};
}

export function getAllBinaries(path){
    return (dispatch) => {
        let pathArray = !R.isNil(path) && path !== '' ? path.split('/') : [];
		dispatch({ type: Actions.FETCH_FILES_REQUEST, path: path});
		return axios.get(Url.FILES_URL(!R.isNil(path)? path: ''))
		.then((response) => {
			dispatch({
				type: Actions.FETCH_FILES_SUCCESS,
                path: pathArray,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			else if(error.response.status === 404){
				window.location = '#/files';
				return;
			}
			dispatch({
				type: Actions.FETCH_FILES_FAILURE,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function getFileUrlFromId(name){
	return Url.FILE_BY_NAME_URL(name);
}

export function downloadFile(f) {
	return (dispatch) => {
		dispatch({ type: Actions.DOWNLOAD_FILE_REQUEST, id: f.id });
		return axios.get(Url.FILE_BY_NAME_URL(f.id), {
			responseType: 'arraybuffer',
			headers: {
				'Content-Type': null,
				'Accept': '*'
			}
		}
		)
			.then((response) => {
				var file = new Blob([response.data]);
				var fileurl = window.URL.createObjectURL(file);
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.href = fileurl;
				a.download = `${f.name}${f.fileType === 'folder' ? '.zip': ''}`;
				a.target = '_blank';
				a.click();
				dispatch({
					type: Actions.DOWNLOAD_FILE_SUCCESS,
					data: response.data
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.DOWNLOAD_FILE_FAILURE,
					response: error.response,
					file: f
				});
			});
	};
}

export function downloadZip(files) {
	return (dispatch) => {
		dispatch({ type: Actions.DOWNLOAD_ZIP_REQUEST, files: files });
		return axios.post(Url.FILES_ZIP_URL(), files, {
			responseType: 'arraybuffer',
			headers: {
				'Content-Type': 'application/zip',
				'Accept': '*'
			}
		}
		)
			.then((response) => {
				var file = new Blob([response.data]);
				var fileurl = window.URL.createObjectURL(file);
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.href = fileurl;
				a.download = "files.zip";
				a.target = '_blank';
				a.click();
				dispatch({
					type: Actions.DOWNLOAD_ZIP_SUCCESS,
					data: response.data
				});
			})
			.catch((error) => {
				if (error.response.status === 401) {
					logOutUser();
					return;
				}
				dispatch({
					type: Actions.DOWNLOAD_ZIP_FAILURE,
					response: error.response
				});
			});
	};
}

export function deleteFile(file){
    return (dispatch) => {
		dispatch({ type: Actions.DELETE_FILE_REQUEST, file:file});
		return axios.delete(Url.CMS_FILE_BY_ID_URL(file.id))
		.then((response) => {
			dispatch({
				type: Actions.DELETE_FILE_SUCCESS,
				data: response.data,
				file: file
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.DELETE_FILE_FAILURE,
				response: error.response,
				file: file
			});
			throw error.statusText;
		});
	};
}


export function addFolder(folder){
    return (dispatch) => {
		dispatch({ type: Actions.ADD_FOLDER_REQUEST, folder: folder });
		return axios.put(Url.FILES_URL(), folder)
		.then((response) => {
			dispatch({
				type: Actions.ADD_FOLDER_SUCCESS,
                folder: folder,
				data: response.data
			});
		})
		.catch((error) => {
			if(error.response.status === 401){
				logOutUser();
				return;
			}
			dispatch({
				type: Actions.ADD_FOLDER_FAILURE,
				folder: folder,
				response: error.response
			});
			throw error.statusText;
		});
	};
}

export function stopForcedUpdate() {
	return (dispatch) => {
		dispatch({
			type: Actions.STOP_FORCED_UPDATE
		});
	}
}