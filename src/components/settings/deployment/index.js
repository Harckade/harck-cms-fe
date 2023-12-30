import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { DeployModal } from './deployModal';

export const Deployment = ({dispatcher}) => {
    const articles = useSelector(state => state.articles);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if(!R.isNil(articles.deployment)){
            if(articles.deployment === true){
                handleClose();
            }
        }
    }, [articles.deployment]);

    return (
        <div className='text-start'>
            <div className='text-center'>
                <p>If you made changes and it is not reflected on the website after a long time (~10minutes), consider deploying it manually using the button bellow.</p>
                <Button variant="outline-success" onClick={() => { handleShow(); }}>DEPLOY</Button>
            </div>
            <DeployModal dispatcher={dispatcher} show={show} handleClose={handleClose} />
        </div>
    );
}