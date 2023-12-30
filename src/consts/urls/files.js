import * as R from 'ramda'
let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_PRIVATE_API_HOST;
let FILES_SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_FILES_API_HOST;
const base = '/cms';

export const FILES_URL = (path) => `${SERVER_ADDRESS}${base}/files${path !== '' && !R.isNil(path) ? ('/'+path) : ''}`;
export const FILES_ZIP_URL = () => `${SERVER_ADDRESS}${base}/zip-files`;
export const FILE_BY_NAME_URL = (path) => `${FILES_SERVER_ADDRESS}/files/${path}`;
export const CMS_FILE_BY_ID_URL = (path) => `${SERVER_ADDRESS}${base}/files/${path}`;