import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {Divider} from '../common/divider';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../../consts/initialization/authConfig';

function handleLogin(instance) {
  instance.loginPopup(loginRequest).catch(e => {
    console.error(e);
  });
}

export const Login = () => {
  const { instance } = useMsal();

  return (
    <div>
      <div className='text-center'>
        <h1>Harck-CMS</h1>
        <p>Please login into the portal or contact the administrator for support.</p>
      </div>
      <Divider title='🚀 Welcome 🚀' />
      <br/>
      <div className="">
        <Container fluid className='justify-content-md-center'>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <div className="text-center">
                <Button id="sign-in-button" onClick={() => {
                  handleLogin(instance);
                }}>Sign in</Button>
              </div>
            </Col>
          </Row>
        </Container>
        <br/>
        <br/>
        <p className='text-center'>Build your own website using Harck-CMS. Visit <a href="https://www.harckade.com">www.harckade.com</a> to find out more</p>
      </div>
    </div>
  );
};
