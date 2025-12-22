import * as R from 'ramda';

const User = function(_user){
    let user = _user || {};
 
    this.name = user.name;
    this.email = user.email;
    this.role = !R.isNil(user) && !R.isNil(user.role) ? user.role.toLowerCase(): '';
    this.id = user.id;
    this.isAdministrator = this.role === 'administrator';
    this.isEditor = this.role === 'editor';
    this.isViewer = this.role === 'viewer';
};
export default User;