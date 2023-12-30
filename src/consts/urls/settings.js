let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_ADMIN_API_HOST;
let SERVER_PRIVATE_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_PRIVATE_API_HOST;
let SERVER_SIGNALR_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_SIGNALR_API_HOST;
const base = '/cms';

export const SETTINGS_URL = () => `${SERVER_ADDRESS}${base}/settings`;
export const NOTIFICATIONS_URL = () => `${SERVER_SIGNALR_ADDRESS}${base}/notifications`;
export const SEND_NOTIFICATIONS_URL = () => `${SERVER_SIGNALR_ADDRESS}${base}/notifications/sendMessage`;
export const DEPLOY_URL = () => `${SERVER_PRIVATE_ADDRESS}${base}/deploy`;