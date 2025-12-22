import * as Actions from '../consts/actions/users';
import User from '../consts/models/user';
import { toast } from 'react-toastify';
import { createAction, createReducer } from '@reduxjs/toolkit'

//TOASTERS
const toastLoadUsersFail = () => toast.error('😭 Failed to load users!!!', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastInviteUserFail = (email) => toast.error(`😭 Failed to invite user: ${email}`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastInviteSuccess = (email) => toast.dark(`✔️ An invite was sent to: ${email}`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastEditUserFail = (user) => toast.error(`😭 Failed to edit ${user.email}'s user data!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastEditUserSuccess = (user) => toast.dark(`✔️ User ${user.email} was successfully updated`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastDeleteUserFail = (user) => toast.error(`😭 Failed to delete user ${user.name}`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
//

const UsersReducer = createReducer({
    items: [],
    loadings: []
}, (builder) => {
    builder
        .addCase(createAction(Actions.FETCH_USERS_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_USERS'))
                state.loadings.push('FETCH_USERS');
        })
        .addCase(createAction(Actions.FETCH_USERS_SUCCESS), (state, action) => {
            state.items = action.data.map(u => new User(u));
            state.loadings = state.loadings.filter(l => l !== 'FETCH_USERS');
        })
        .addCase(createAction(Actions.FETCH_USERS_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_USERS');
            toastLoadUsersFail();
        })

        .addCase(createAction(Actions.INVITE_USER_REQUEST), (state, action) => {
            if (!state.loadings.includes('INVITE_USER'))
                state.loadings.push('INVITE_USER');
        })
        .addCase(createAction(Actions.INVITE_USER_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'INVITE_USER');
            let tmpItems = JSON.parse(JSON.stringify(state.items));
            tmpItems.push(new User(action.data));
            toastInviteSuccess(action.data.email);
            state.items = tmpItems;
        })
        .addCase(createAction(Actions.INVITE_USER_FAILURE), (state, action) => {
            toastInviteUserFail(action.user.email);
            state.loadings = state.loadings.filter(l => l !== 'INVITE_USER');
        })

        .addCase(createAction(Actions.EDIT_USER_REQUEST), (state, action) => {
            if (!state.loadings.includes(`EDIT_USER_${action.user.id}`))
                state.loadings.push(`EDIT_USER_${action.user.id}`);
        })
        .addCase(createAction(Actions.EDIT_USER_SUCCESS), (state, action) => {
            let userIndex = state.items.findIndex(u => u.id === action.data.id);
            if (userIndex !== -1) {
                state.items[userIndex] = new User(action.data);
                state.items = JSON.parse(JSON.stringify(state.items));
            }
            toastEditUserSuccess(action.data);
            state.loadings = state.loadings.filter(l => l !== `EDIT_USER_${action.data.id}`);
        })
        .addCase(createAction(Actions.EDIT_USER_FAILURE), (state, action) => {
            toastEditUserFail(action.user);
            state.loadings = state.loadings.filter(l => l !== `EDIT_USER_${action.user.id}`);
        })

        .addCase(createAction(Actions.DELETE_USER_REQUEST), (state, action) => {
            if (!state.loadings.includes(`DELETE_USER_${action.user.id}`))
                state.loadings.push(`DELETE_USER_${action.user.id}`);
        })
        .addCase(createAction(Actions.DELETE_USER_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_USER_${action.user.id}`);
            state.items = state.items.filter(u => u.id !== action.user.id);
        })
        .addCase(createAction(Actions.DELETE_USER_FAILURE), (state, action) => {
            toastDeleteUserFail(action.user);
            state.loadings = state.loadings.filter(l => l !== `DELETE_USER_${action.user.id}`);
        })
})

export default UsersReducer;