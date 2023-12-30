import * as Actions from '../consts/actions/files';
import * as CommonActions from '../consts/actions/common';
import FileObject from '../consts/models/fileObject';
import { toast } from 'react-toastify';
import * as R from 'ramda';
import { createAction, createReducer } from '@reduxjs/toolkit'

const toastFileUploadSuccess = (fileName) => toast.success(`✔ ${fileName} successfully uploaded!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastFileUploadError = (fileName) => toast.error(`😭 ${fileName} upload failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});


const toastAddFolderSuccess = (folderName) => toast.success(`✔ ${folderName} folder successfully created!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastAddFolderError = (folderName) => toast.error(`😭 ${folderName} folder creation failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastFileDeleteSuccess = (fileName) => toast.dark(`🗑 ${fileName} successfully deleted!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastFileDeleteError = (fileName) => toast.error(`😭 ${fileName} delete failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastFileDownloadError = (fileName) => toast.error(`😭 ${fileName} download failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});


const FilesReducer = createReducer({
    items: [],
    path: [],
    loadings: [],
    reload: false,
    forceUpdate: false,
    stopReload: true
}, (builder) => {
    builder
        .addCase(createAction(Actions.FETCH_FILES_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_FILES')) {
                state.loadings.push('FETCH_FILES');
            }
            state.path = [];
            state.items = JSON.parse(JSON.stringify([]));
            state.reload = false;
        })
        .addCase(createAction(Actions.FETCH_FILES_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_FILES');
            if (!R.isNil(action.path)) {
                state.path = action.path;
            }
            state.items = action.data.map(f => new FileObject(f));
            if (state.stopReload !== true && state.forceUpdate === false) {
                state.stopReload = true;
                state.forceUpdate = true;
            }
        })
        .addCase(createAction(Actions.FETCH_FILES_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_FILES');
        })


        .addCase(createAction(Actions.UPLOAD_FILE_REQUEST), (state, action) => {
            if (!state.loadings.includes('UPLOAD_FILES')) {
                state.loadings.push('UPLOAD_FILES');
            }
        })
        .addCase(createAction(Actions.UPLOAD_FILE_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'UPLOAD_FILES');
            if (state.items.findIndex(f => action.file.id === f.id) === -1) {
                state.items.push(new FileObject(action.file));
            }
            toastFileUploadSuccess(action.file.name);
        })
        .addCase(createAction(Actions.UPLOAD_FILE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'UPLOAD_FILES');
            toastFileUploadError(action.file.name);
        })


        .addCase(createAction(Actions.ADD_FOLDER_REQUEST), (state, action) => {
            if (!state.loadings.includes('ADD_FOLDER')) {
                state.loadings.push('ADD_FOLDER');
            }
        })
        .addCase(createAction(Actions.ADD_FOLDER_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'ADD_FOLDER');
            let folderId = `${action.folder.parentFolder}/folder_${action.folder.name}`;
            if (state.items.findIndex(f => folderId === f.id) === -1) {
                state.items.push(new FileObject({
                    id: folderId,
                    name: action.folder.name,
                    fileType: 'folder',
                    timestamp: new Date().getTime(),
                    size: 0
                }));
            }
            toastAddFolderSuccess(action.folder.name);
        })
        .addCase(createAction(Actions.ADD_FOLDER_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'ADD_FOLDER');
            toastAddFolderError(action.folder.name);
        })

        .addCase(createAction(Actions.DELETE_FILE_REQUEST), (state, action) => {
            if (!state.loadings.includes('DELETE_FILE_' + action.file.id)) {
                state.loadings.push('DELETE_FILE_' + action.file.id);
            }
        })
        .addCase(createAction(Actions.DELETE_FILE_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'DELETE_FILE_' + action.file.id);
            state.items = state.items.filter(i => i.id !== action.file.id);
            toastFileDeleteSuccess(action.file.name);
        })
        .addCase(createAction(Actions.DELETE_FILE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'DELETE_FILE_' + action.file.id);
            toastFileDeleteError(action.file.name);
        })
        .addCase(createAction(Actions.DOWNLOAD_FILE_FAILURE), (state, action) => {
            toastFileDownloadError(action.file.name);
        })
        .addCase(createAction(Actions.STOP_FORCED_UPDATE), (state, action) => {
            state.forceUpdate = false;
        })
        .addCase(createAction(CommonActions.SIGNALR_RCV_MESSAGE), (state, action) => {
            if (action.message.page === "files" && action.message.action === "update" && state.reload === false && !state.loadings.includes('FETCH_FILES') && !R.isNil(action.message.payload.location) && action.message.payload.location === window.location.hash) {
                state.reload = true;
                state.stopReload = false;
            }
        })
});

export default FilesReducer;