import React  from 'react';
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import {Main} from './components';
import {Provider} from 'react-redux';
import configurationStore from './consts/initialization/configurationStore';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from './consts/initialization/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);
const store = configurationStore({});
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <Main instance={msalInstance} />
      </MsalProvider>
    </React.StrictMode>
  </Provider>
);

serviceWorker.unregister();