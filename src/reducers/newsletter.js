import * as Actions from '../consts/actions/newsletter';
import Newsletter from '../consts/models/newsletter';
import { toast } from 'react-toastify';
import { Languages } from '../consts/mappers/languages';
import * as R from 'ramda';
import SubscriptionTemplate from '../consts/models/subscriptionTemplate';
import Subscriber from '../consts/models/subscriber';
import { createAction, createReducer } from '@reduxjs/toolkit'

const toastNewsletterFetchError = () => toast.error(`😭 Something went wrong. Failed to load newsletters!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastNewsletterCreationSuccess = () => toast.success(`📰 A newsletter was successfully created!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastNewsletterCreationError = (message) => toast.error(`${R.isNil(message) ? '😭 Newsletter creation failed!!!' : message}`, {
    position: "bottom-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastNewsletterUpdateSuccess = () => toast.success(`📝 The newsletter was successfully updated!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastNewsletterUpdateError = () => toast.error(`😭 The newsletter update failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastNewsletterDeleteSuccess = (newsletterId) => toast.dark(`🗑 Newsletter with id ${newsletterId} successfully deleted!`, {
    position: "bottom-left",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastNewsletterDeleteError = (newsletterId) => toast.error(`😭 Newsletter with id ${newsletterId} delete failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastSubscriptionTemplateFetchError = () => toast.error(`😭 Something went wrong. Failed to load template!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastSubscriptionTemplateUpdateSuccess = () => toast.success(`📝 The template was successfully updated!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastSubscriptionTemplateUpdateError = () => toast.error(`😭 The template update failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastNewsletterSendSuccess = () => toast.success(`📰 The newsletter was successfully sent!`, {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastNewsletterSendError = (message) => toast.error(`${R.isNil(message) ? '😭 Newsletter send operation failed!!!' : message}`, {
    position: "bottom-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const toastSubscriberDeleteSuccess = (email) => toast.dark(`🗑 Subscriber with email ${email} successfully deleted!`, {
    position: "bottom-left",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const toastSubscriberDeleteError = (email) => toast.error(`😭 Subscriber with email ${email} delete failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

const emptyStrings = Object.keys(Languages).reduce(function (result, langKey) {
    result[langKey] = '';
    return result
}, {});

const emptyBoolean = Object.keys(Languages).reduce(function (result, langKey) {
    result[langKey] = false;
    return result
}, {});

const NewsletterReducer = createReducer({
    items: [],
    loadings: [],
    subscribers: [],
    reload: false,
    currentNewsletter: undefined,
    forceUpdate: false,
    htmlContent: JSON.parse(JSON.stringify(emptyStrings)),
    htmlContentLoaded: JSON.parse(JSON.stringify(emptyBoolean)),
    newsletterIdContent: undefined,
    stopReload: true,
    subscriptionTemplate: undefined,
    subscriptionTemplateContent: JSON.parse(JSON.stringify(emptyStrings)),
    subscriptionTemplateHtmlContentLoaded: JSON.parse(JSON.stringify(emptyBoolean))
}, (builder) => {
    builder
        .addCase(createAction(Actions.FETCH_NEWSLETTERS_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_NEWSLETTERS')) {
                state.loadings.push('FETCH_NEWSLETTERS');
            }
            state.reload = false;
        })
        .addCase(createAction(Actions.FETCH_NEWSLETTERS_SUCCESS), (state, action) => {
            if (state.loadings.includes('FETCH_NEWSLETTERS')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_NEWSLETTERS');
            }
            var tmpItems = action.data.map(d => new Newsletter(d));
            for (let i = 0; i < tmpItems.length; i++) {
                if (state.items.findIndex(item => item.id === tmpItems[i].id) === -1) {
                    state.items.push(tmpItems[i]);
                } else {
                    state.items[i] = tmpItems[i];
                }
            }
            if (state.stopReload !== true && state.forceUpdate === false) {
                state.stopReload = true;
                state.forceUpdate = true;
            }
        })
        .addCase(createAction(Actions.FETCH_NEWSLETTERS_FAILURE), (state, action) => {
            if (state.loadings.includes('FETCH_NEWSLETTERS')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_NEWSLETTERS');
            }
            toastNewsletterFetchError();
        })

        .addCase(createAction(Actions.ADD_UPDATE_NEWSLETTER_REQUEST), (state, action) => {
            if (!state.loadings.includes('ADD_UPDATE_NEWSLETTER'))
                state.loadings.push('ADD_UPDATE_NEWSLETTER');
        })
        .addCase(createAction(Actions.ADD_UPDATE_NEWSLETTER_SUCCESS), (state, action) => {
            if (state.currentNewsletter === undefined) {
                state.currentNewsletter = new Newsletter(action.data);
            }
            let currentDocIndex = state.items.findIndex(i => i.id === action.data.id);
            if (currentDocIndex === -1) {
                action.data.timestamp = new Date().getTime();
                state.items.push(new Newsletter(action.data));
                toastNewsletterCreationSuccess();
            }
            else {
                state.items[currentDocIndex] = new Newsletter(action.data);
                toastNewsletterUpdateSuccess();
            }
            if (!R.isNil(action.htmlContent) && !R.isNil(action.lang)) {
                state.htmlContent[action.lang] = action.htmlContent[action.lang];
            }
            state.loadings = state.loadings.filter(l => l !== 'ADD_UPDATE_NEWSLETTER');
        })
        .addCase(createAction(Actions.ADD_UPDATE_NEWSLETTER_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'ADD_UPDATE_NEWSLETTER');
            if (action.error === 'duplicate') {
                let title = R.isNil(action.newsletter.name) ? action.newsletter.Name[action.lang] : action.newsletter.name[action.lang];
                toastNewsletterCreationError(`A newsletter with "${title}" title in ${Languages[action.lang]} already exists. If a newsletter with same name does not appear on the table check recycle bin.`);
            } else if (R.isNil(action.newsletter) || R.isNil(action.newsletter.id)) {
                toastNewsletterCreationError();
            }
            else {
                toastNewsletterUpdateError();
            }
        })

        .addCase(createAction(Actions.DELETE_NEWSLETTER_REQUEST), (state, action) => {
            if (!state.loadings.includes(`DELETE_NEWSLETTER_${action.newsletter.id}`))
                state.loadings.push(`DELETE_NEWSLETTER_${action.newsletter.id}`);
        })
        .addCase(createAction(Actions.DELETE_NEWSLETTER_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_NEWSLETTER_${action.newsletter.id}`);
            state.items = state.items.filter(art => art.id !== action.newsletter.id);
            toastNewsletterDeleteSuccess(action.newsletter.id);
        })
        .addCase(createAction(Actions.DELETE_NEWSLETTER_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_NEWSLETTER_${action.newsletter.id}`);
            toastNewsletterDeleteError(action.newsletter.id);
        })

        .addCase(createAction(Actions.SELECT_NEWSLETTER), (state, action) => {
            if (action.id === undefined) {
                state.currentNewsletter = undefined;
                state.htmlContent = JSON.parse(JSON.stringify(emptyStrings));
                state.htmlContentLoaded = JSON.parse(JSON.stringify(emptyBoolean));
                state.loadings = [];
                state.newsletterIdContent = undefined;
            }
            else {
                let currentNewsletter = state.items.find(i => i.id === action.id);
                if (!R.isNil(currentNewsletter)) {
                    state.currentNewsletter = currentNewsletter;
                }
            }
        })

        .addCase(createAction(Actions.FETCH_NEWSLETTER_CONTENT_REQUEST), (state, action) => {
            state.htmlContent[action.lang] = '';
            if (!state.loadings.includes(`FETCH_NEWSLETTER_CONTENT_${action.lang.toUpperCase()}`))
                state.loadings.push(`FETCH_NEWSLETTER_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_NEWSLETTER_CONTENT_SUCCESS), (state, action) => {
            state.htmlContent[action.lang] = action.data;
            state.htmlContentLoaded[action.lang] = true;
            state.newsletterIdContent = action.id;
            state.loadings = state.loadings.filter(l => l !== `FETCH_NEWSLETTER_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_NEWSLETTER_CONTENT_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `FETCH_NEWSLETTER_CONTENT_${action.lang.toUpperCase()}`);
        })

        .addCase(createAction(Actions.FETCH_NEWSLETTER_SUCCESS), (state, action) => {
            if (!R.isNil(action.data) && !R.isNil(action.data.id)) {
                let itemAlreadyExists = state.items.findIndex(i => i.id === action.data.id);
                if (itemAlreadyExists === -1) {
                    state.items.push(new Newsletter(action.data));
                }
            }
        })

        .addCase(createAction(Actions.SEND_NEWSLETTER_REQUEST), (state, action) => {
            if (!state.loadings.includes(`SEND_NEWSLETTER_${action.id}`))
                state.loadings.push(`SEND_NEWSLETTER_${action.id}`);
        })
        .addCase(createAction(Actions.SEND_NEWSLETTER_SUCCESS), (state, action) => {
            toastNewsletterSendSuccess();
            state.loadings = state.loadings.filter(l => l !== `SEND_NEWSLETTER_${action.id}`);
        })
        .addCase(createAction(Actions.SEND_NEWSLETTER_FAILURE), (state, action) => {
            toastNewsletterSendError();
            state.loadings = state.loadings.filter(l => l !== `SEND_NEWSLETTER_${action.id}`);
        })

        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_SUB_TEMPLATE')) {
                state.loadings.push('FETCH_SUB_TEMPLATE');
            }
        })
        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_SUCCESS), (state, action) => {
            if (state.loadings.includes('FETCH_SUB_TEMPLATE')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_SUB_TEMPLATE');
            }
            state.subscriptionTemplate = new SubscriptionTemplate(action.data);
        })
        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_FAILURE), (state, action) => {
            if (state.loadings.includes('FETCH_SUB_TEMPLATE')) {
                state.loadings = state.loadings.filter(l => l !== 'FETCH_SUB_TEMPLATE');
            }
            toastSubscriptionTemplateFetchError();
        })

        .addCase(createAction(Actions.ADD_UPDATE_SUB_TEMPLATE_REQUEST), (state, action) => {
            if (!state.loadings.includes('ADD_SUB_TEMPLATE'))
                state.loadings.push('ADD_SUB_TEMPLATE');
        })
        .addCase(createAction(Actions.ADD_UPDATE_SUB_TEMPLATE_SUCCESS), (state, action) => {
            if (state.subscriptionTemplate === undefined) {
                state.subscriptionTemplate = new SubscriptionTemplate(action.data);
            }
            toastSubscriptionTemplateUpdateSuccess();
            if (!R.isNil(action.htmlContent) && !R.isNil(action.lang)) {
                state.subscriptionTemplateContent[action.lang] = action.subscriptionTemplateContent[action.lang];
            }
            state.loadings = state.loadings.filter(l => l !== 'ADD_SUB_TEMPLATE');
        })
        .addCase(createAction(Actions.ADD_UPDATE_SUB_TEMPLATE_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'ADD_SUB_TEMPLATE');
            toastSubscriptionTemplateUpdateError();
        })

        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_CONTENT_REQUEST), (state, action) => {
            state.subscriptionTemplateContent[action.lang] = '';
            if (!state.loadings.includes(`FETCH_SUB_TEMPLATE_CONTENT_${action.lang.toUpperCase()}`))
                state.loadings.push(`FETCH_SUB_TEMPLATE_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_CONTENT_SUCCESS), (state, action) => {
            state.subscriptionTemplateContent[action.lang] = action.data;
            state.subscriptionTemplateHtmlContentLoaded[action.lang] = true;
            state.loadings = state.loadings.filter(l => l !== `FETCH_SUB_TEMPLATE_CONTENT_${action.lang.toUpperCase()}`);
        })
        .addCase(createAction(Actions.FETCH_SUB_TEMPLATE_CONTENT_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `FETCH_SUB_TEMPLATE_CONTENT_${action.lang.toUpperCase()}`);
        })

        .addCase(createAction(Actions.FETCH_SUBSCRIBERS_REQUEST), (state, action) => {
            if (!state.loadings.includes(`FETCH_SUBSCRIBERS`))
                state.loadings.push(`FETCH_SUBSCRIBERS`);
        })
        .addCase(createAction(Actions.FETCH_SUBSCRIBERS_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `FETCH_SUBSCRIBERS`);
            if (!R.isNil(action.data) && action.data.length > 0) {
                var tmpSubscribers = action.data.map(d => new Subscriber(d));
                for (let i = 0; i < tmpSubscribers.length; i++) {
                    if (state.subscribers.findIndex(item => item.id === tmpSubscribers[i].id) === -1) {
                        state.subscribers.push(tmpSubscribers[i]);
                    } else {
                        state.subscribers[i] = tmpSubscribers[i];
                    }
                }
            }
        })
        .addCase(createAction(Actions.FETCH_SUBSCRIBERS_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `FETCH_SUBSCRIBERS`);
        })

        .addCase(createAction(Actions.DELETE_SUBSCRIBER_REQUEST), (state, action) => {
            if (!state.loadings.includes(`DELETE_SUBSCRIBER_${action.id}`))
                state.loadings.push(`DELETE_SUBSCRIBER_${action.id}`);
        })
        .addCase(createAction(Actions.DELETE_SUBSCRIBER_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_SUBSCRIBER_${action.id}`);
            state.subscribers = state.subscribers.filter(sub => sub.id !== action.id);
            toastSubscriberDeleteSuccess(action.email);
        })
        .addCase(createAction(Actions.DELETE_SUBSCRIBER_FAILURE), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== `DELETE_SUBSCRIBER_${action.id}`);
            toastSubscriberDeleteError(action.email);
        })
})

export default NewsletterReducer;