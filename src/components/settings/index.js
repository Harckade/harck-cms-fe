import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import { useSelector } from 'react-redux';
import { Language } from './language';
import { Users } from './users';
import { Deployment } from './deployment';
import { Interface } from './interface';
import { Tabs, Tab } from 'react-bootstrap';

export const Settings = ({ dispatcher }) => {
    const settings = useSelector(state => state.settings);

    return (
        <>
            <h4 className="text-center">
                Settings
            </h4>

            <Tabs defaultActiveKey={settings.user.isViewer ? "languages" : "users"} id="settings-options" className={`mb-2 ${settings.darkmode ? 'dark-mode-tabs' : ''}`}>
                {
                    settings.user.isAdministrator ?
                        <Tab eventKey="users" title="Users">
                            <Users dispatcher={dispatcher} />
                        </Tab>
                        : ''
                }
                <Tab eventKey="languages" title="Languages">
                    <Language dispatcher={dispatcher} />
                </Tab>
                <Tab eventKey="interface" title="Interface">
                    <Interface />
                </Tab>
                {
                    settings.user.isAdministrator || settings.user.isEditor ?
                        <Tab eventKey="deployment" title="Deployment">
                            <Deployment dispatcher={dispatcher} />
                        </Tab>
                        : ''
                }
            </Tabs>
        </>
    );
}