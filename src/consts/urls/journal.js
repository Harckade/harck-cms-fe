let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_ADMIN_API_HOST;
const base = '/cms';

export const JOURNAL_URL = () => `${SERVER_ADDRESS}${base}/journal`;