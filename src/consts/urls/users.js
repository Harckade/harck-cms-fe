let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_ADMIN_API_HOST;
const base = '/cms';

export const FETCH_USERS_URL = () => `${SERVER_ADDRESS}${base}/users`;
export const DELETE_USER_URL = (id) => `${SERVER_ADDRESS}${base}/users/${id}`;