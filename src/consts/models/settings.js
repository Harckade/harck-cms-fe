const Settings = function (_settings) {
    let settings = _settings || {};

    this.languages = settings !== null && settings !== undefined && settings.languages !== null && settings.languages !== undefined ?
        settings.languages.map(l => `${l[0].toLowerCase()}${l.substring(1)}`) : [];
    this.defaultLanguage = settings !== null && settings !== undefined && settings.defaultLanguage !== null && settings.defaultLanguage !== undefined ?
        `${settings.defaultLanguage[0].toLowerCase()}${settings.defaultLanguage.substring(1)}` : undefined;
    this.lastDeploymentDate = settings.lastDeploymentDate !== undefined ? new Date(settings.lastDeploymentDate): new Date();
    this.requiresDeployment = settings.requiresDeployment !== undefined ? settings.requiresDeployment: false;
};
export default Settings;