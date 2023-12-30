import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Newsletters } from './newsletters';
import { Subscribers } from './subscribers';
import { SubscriptionTemplate } from './subscriptionTemplate';

export const Newsletter = ({ dispatcher }) => {
    const settings = useSelector(state => state.settings);

    return (
        <>
            <h4 className="text-center">
                Newsletter Management
            </h4>
            <Tabs defaultActiveKey={"newsletters"} id="newsletter-options" className={`mb-2 ${settings.darkmode ? 'dark-mode-tabs' : ''}`}>
                <Tab eventKey="newsletters" title="Newsletters">
                    <Newsletters dispatcher={dispatcher} />
                </Tab>
                <Tab eventKey="subscription-template" title="subscription Template">
                    <SubscriptionTemplate dispatcher={dispatcher} />
                </Tab>
                {settings.user.isViewer ? '' : <Tab eventKey="subscribers" title="Subscribers">
                    <Subscribers dispatcher={dispatcher} />
                </Tab>}
            </Tabs>
        </>
    );
}