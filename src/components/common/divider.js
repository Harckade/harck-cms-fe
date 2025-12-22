import React from 'react';
import { useSelector } from 'react-redux';
import '../../design/custom.css';

export const Divider = ({title}) => {
    const settings = useSelector(state => state.settings);

    return(
    <React.Fragment>
        <hr className="simple" />
        <h1 className={'text-center header-title' +(settings.darkmode ? ' dark-mode': '')}>{title}</h1>
        <hr className="simple-end" />
    </React.Fragment>
    );
}