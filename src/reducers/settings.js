import * as Actions from '../consts/actions/settings';
import { toast } from 'react-toastify';
import Settings from '../consts/models/settings';
import { Languages } from '../consts/mappers/languages';
import User from '../consts/models/user';
import { createAction, createReducer } from '@reduxjs/toolkit'

//TOASTERS
const toastUpdateSettingsSuccess = () => toast.dark('✔️ Settings successfully updated!', {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastGetSettingsFail = () => toast.error('😭 Failed to load settings!!!', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastUpdateSettingsFail = () => toast.error(`😭 Failed to update settings`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
//

//DEPLOYMENT TOASTERS
const toastDeploySuccess = () => toast.dark('☕ Deployment launched. Wait a little bit..!', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastDeployError = () => toast.error('😭 Deployment Failed!!!', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
//

const sort = (options) => {
    let camelCaseEntries = options.languages.map(langKey => `${langKey[0].toLowerCase()}${langKey.substring(1)}`)
    let sortedByLangTitle = Object.keys(Languages).filter(l => camelCaseEntries.includes(l));
    return { languages: sortedByLangTitle, defaultLanguage: options.defaultLanguage, lastDeploymentDate: options.lastDeploymentDate, requiresDeployment: options.requiresDeployment }
}


const SettingsReducer = createReducer({
    options: new Settings(),
    user: new User(),
    darkMode: false,
    loadings: [],
    deployment: undefined,
    signalRconnection: undefined
}, (builder) => {
    builder
        .addCase(createAction(Actions.FETCH_SETTINGS_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_SETTINGS'))
                state.loadings.push('FETCH_SETTINGS');
        })
        .addCase(createAction(Actions.FETCH_SETTINGS_SUCCESS), (state, action) => {
            state.options = new Settings(sort(action.data));
            state.loadings = state.loadings.filter(l => l !== 'FETCH_SETTINGS');
        })
        .addCase(createAction(Actions.FETCH_SETTINGS_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_SETTINGS');
            toastGetSettingsFail();
        })
        .addCase(createAction(Actions.UPDATE_SETTINGS_REQUEST), (state, action) => {
            if (!state.loadings.includes('UPDATE_SETTINGS'))
                state.loadings.push('UPDATE_SETTINGS');
        })
        .addCase(createAction(Actions.UPDATE_SETTINGS_SUCCESS), (state, action) => {
            toastUpdateSettingsSuccess();
            state.options = new Settings(sort(action.data));
            state.loadings = state.loadings.filter(l => l !== 'UPDATE_SETTINGS');
        })
        .addCase(createAction(Actions.UPDATE_SETTINGS_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'UPDATE_SETTINGS');
            toastUpdateSettingsFail();
        })

        .addCase(createAction(Actions.LAUNCH_DEPLOYMENT_REQUEST), (state, action) => {
            state.deployment = undefined;
            if (!state.loadings.includes('LAUNCH_DEPLOYMENT'))
                state.loadings.push('LAUNCH_DEPLOYMENT');
        })
        .addCase(createAction(Actions.LAUNCH_DEPLOYMENT_SUCCESS), (state, action) => {
            toastDeploySuccess();
            state.loadings = state.loadings.filter(l => l !== 'LAUNCH_DEPLOYMENT');
            state.deployment = true;
            state.options.requiresDeployment = false;
            state.options.lastDeploymentDate = new Date().getTime();
        })
        .addCase(createAction(Actions.LAUNCH_DEPLOYMENT_FAILURE), (state, action) => {
            toastDeployError();
            state.loadings = state.loadings.filter(l => l !== 'LAUNCH_DEPLOYMENT');
            state.deployment = undefined;
        })

        .addCase(createAction(Actions.SET_USER_DATA), (state, action) => {
            state.user = new User({ id: action.userData.localAccountId, email: action.userData.username, name: action.userData.name, role: action.userData.idTokenClaims.roles[0] });
        })

        .addCase(createAction(Actions.READ_STORAGE_DARKMODE), (state, action) => {
            state.darkmode = action.data;
        })

        .addCase(createAction(Actions.SIGNALR_CONNECTED), (state, action) => {
            state.signalRconnection = action.connection;
        })
});

export default SettingsReducer;