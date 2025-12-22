import React, { useEffect } from 'react';
import { Routes, Route, HashRouter as Router, Navigate } from 'react-router-dom';
import { WebsiteNavbar } from './common/websiteNavbar';
import { Home } from './home';
import { Articles } from './articles';
import { Login } from './login';
import { Files } from './files';
import { About } from './about';
import { ContentEditor } from './editor';
import { NewsletterEditor } from './newsletter/newsletters/newsletterEditor';
import { Settings } from './settings';
import { Journal } from './journal';
import { Newsletter } from './newsletter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../design/custom.css';
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from '@azure/msal-react';
import { apiRequest } from '../consts/initialization/authConfig';
import * as R from 'ramda';
import { setUserData, setThemeMode } from '../actions/settings';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export const Main = ({ instance, history }) => {
    const { accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    function sendRequest(response, func){
        axios.interceptors.request.use(async config => {
            config.headers.authorization = `Bearer ${response.accessToken}`
            return config
        }, (error) => {
            return Promise.reject(error)
        });
        func();
    }

    function dispatcher(func) {
        const request = {
            ...apiRequest,
            account: accounts[0]
        };
        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => sendRequest(response, func))
            .catch((e) => {
                instance.acquireTokenPopup(request).then((response) => sendRequest(response, func));
            });
    }

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(setUserData(accounts[0]));
            let darkmode = localStorage.getItem('darkmode');
            dispatch(setThemeMode(!R.isNil(darkmode) ? JSON.parse(darkmode) : false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    //console.log(instance);

    return (
        <Router history={history}>
            {isAuthenticated ? <WebsiteNavbar dispatcher={dispatcher} /> : ''}
            {
                isAuthenticated === false ? <Login /> :
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/articles" element={<Articles dispatcher={dispatcher} />} />
                        <Route path="/articles/:id" element={<ContentEditor dispatcher={dispatcher} />} />
                        <Route path='/files/*' element={<Files dispatcher={dispatcher} />} />
                        <Route exact path='/about' element={<About />} />
                        <Route exact path='/settings' element={<Settings dispatcher={dispatcher} />} />
                        <Route exact path='/journal' element={<Journal dispatcher={dispatcher} />} />
                        <Route exact path='/newsletter' element={<Newsletter dispatcher={dispatcher} />} />
                        <Route path="/newsletter/:id" element={<NewsletterEditor dispatcher={dispatcher} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
            }
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Router>
    )
}
