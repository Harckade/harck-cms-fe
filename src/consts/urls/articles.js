let SERVER_ADDRESS = process.env.REACT_APP_BACKEND_API_HOST || process.env.REACT_APP_BACKEND_PRIVATE_API_HOST;
const base = '/cms';

export const ARTICLE_ID_URL = (articleId) => `${SERVER_ADDRESS}${base}/articles/${articleId}`;
export const ARTICLE_ID_CONTENT_URL = (articleId) => `${SERVER_ADDRESS}${base}/articles/${articleId}/content`;
export const ARTICLES_URL = () => `${SERVER_ADDRESS}${base}/articles`;
export const CONFIRM_UID = (uid) => `${SERVER_ADDRESS}${base}/${uid}`;
export const ARTICLE_BACKUP = (guid, lang) => `${SERVER_ADDRESS}${base}/articles/${guid}/${lang}/history`;
export const ARTICLE_BACKUP_CONTENT = (guid, lang, modificationDate) => `${SERVER_ADDRESS}${base}/articles/${guid}/${lang}/history/${modificationDate}`;
export const RESTORE_BACKUP = (guid, lang, modificationDate) => `${SERVER_ADDRESS}${base}/articles/${guid}/${lang}/history/${modificationDate}`;
export const ARTICLES_DELETED_URL = () => `${SERVER_ADDRESS}${base}/articles/deleted`;
export const ARTICLES_DELETED_RECOVER_URL = (articleId) => `${SERVER_ADDRESS}${base}/articles/${articleId}/recover`;
export const ARTICLES_PERMANENT_DELETE_URL = (articleId) => `${SERVER_ADDRESS}${base}/articles/${articleId}/permanent`;