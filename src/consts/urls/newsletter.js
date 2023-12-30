let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_NEWSLETTER_API_HOST;
const base = '/cms';

export const NEWSLETTERS_URL = () => `${SERVER_ADDRESS}${base}/newsletters`;
export const NEWSLETTER_ID_URL = (newsletterId) => `${SERVER_ADDRESS}${base}/newsletters/${newsletterId}`;
export const NEWSLETTER_ID_CONTENT_URL = (newsletterId) => `${SERVER_ADDRESS}${base}/newsletters/${newsletterId}/content`;
export const NEWSLETTER_ID_SEND_URL = (newsletterId) => `${SERVER_ADDRESS}${base}/newsletters/${newsletterId}/send`;

export const SUBSCRIBERS_URL = () => `${SERVER_ADDRESS}${base}/subscribers`;
export const SUBSCRIBERS_ID_URL = (subscriberId) => `${SERVER_ADDRESS}${base}/subscribers/${subscriberId}`;

export const SUBSCRIPTION_TEMPLATE_URL = () => `${SERVER_ADDRESS}${base}/subscription-template`;
export const SUBSCRIPTION_TEMPLATE_CONTENT_URL = () => `${SERVER_ADDRESS}${base}/subscription-template/content`;