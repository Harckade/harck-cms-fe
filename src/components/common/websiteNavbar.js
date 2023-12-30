import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import '../../design/custom.css';
import { Link } from 'react-router-dom';
import logo_cms from '../../design/logo_cms.svg';
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { BsPersonCircle } from 'react-icons/bs';
import { MdSecurity } from 'react-icons/md';
import { Overlay } from './overlay';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings} from '../../actions/settings';
import * as R from 'ramda';
import {SignalR} from './signalR';

function handleLogout(instance) {
    instance.logoutPopup().catch(e => {
        console.error(e);
    });
}

export const WebsiteNavbar = ({ dispatcher }) => {
    const { instance, accounts } = useMsal();

    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notificationRef = useRef(null);
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            if (!R.isNil(settings) && !R.isNil(settings.options) && settings.options.languages.length === 0 && !settings.loadings.includes('FETCH_SETTINGS')) {
                dispatcher(() => dispatch(getSettings()));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    useEffect(() => {
        if (!R.isNil(notificationRef) && !R.isNil(notificationRef.current)) {
            notificationRef.current.firstChild.className = 'nav-link';
        }
    }, [notificationRef]);

    return (
        <Navbar bg={settings.darkmode ? 'dark' : 'white'} variant={settings.darkmode ? 'dark' : 'light'} sticky='top' expand="lg" className='main-nav'>
            <Link to='/' className='logo navbar-brand'><img src={logo_cms} className='logo-image' alt="NET-CMS logo" /></Link>
            <Navbar.Toggle />
            <Navbar.Collapse>
                {isAuthenticated ?
                    <>
                        <Nav className="me-auto" >
                            <Link className='nav-link' to="/articles">Articles</Link>
                            <Link className='nav-link' to="/files">Files</Link>
                            <Link className='nav-link' to='/settings'>Settings</Link>
                            {!R.isNil(settings.user) && settings.user.isAdministrator ? <Link className='nav-link' to='/journal'>Journal</Link> : ''}
                            {!R.isNil(settings.user) && settings.user.isAdministrator ? <Link className='nav-link' to='/newsletter'>Newsletter</Link> : ''}
                            <Link className='nav-link' to='/about'>About</Link>
                        </Nav>
                        <Nav>
                            <Overlay placement="left" text="profile" component={
                                <NavDropdown
                                    title={<BsPersonCircle size={25} />}
                                    direction="down"
                                    align="end"
                                    menuVariant={settings.darkmode ? 'dark' : 'light'}
                                    id="profile"
                                >
                                    <NavDropdown.ItemText className="text-center">{settings.user.email}</NavDropdown.ItemText>
                                    <NavDropdown.ItemText className="text-center capitalize"><MdSecurity />{settings.user.role} Role</NavDropdown.ItemText>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as="button" className="text-center" onClick={(event) => {
                                        event.preventDefault();
                                        handleLogout(instance);
                                    }}>Sign out</NavDropdown.Item>
                                </NavDropdown>} />
                        </Nav>
                        {<SignalR instance={instance} accounts={accounts}/>}
                    </>
                    : ''
                }
            </Navbar.Collapse>
        </Navbar>
    );
};