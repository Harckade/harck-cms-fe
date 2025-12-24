import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../design/custom.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { BiBookAdd } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { unselectDocument } from '../../../actions/newsletter';
import { Languages } from '../../../consts/mappers/languages';
import { Overlay } from '../../common/overlay';
import { FilterBar } from '../../common/filterBar';

export const Toolbar = ({ selectedNewsletter, handleShowNewNewsletter, handleShowDelete, setSearchFilter, setFilters, filters, availableLanguages, allowDeletion }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newsletter = useSelector(state => state.newsletter);
    const settings = useSelector(state => state.settings);
    const filterOptions = availableLanguages.map((langKey) => { return { value: langKey, label: Languages[langKey] } });

    useEffect(() => {
        if (availableLanguages.length > 0) {
            setFilters(filterOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);

    return (
        <Container fluid className={`files-toolbar ${settings.darkmode ? 'dark-mode' : ''}`}>
            <Row>
                <Col xs="6">
                    {
                        settings.user.isViewer ? '' :
                            <><Overlay text='New newsletter' component={
                                <Button id="add-newsletter" size="sm" variant='outline-primary' disabled={newsletter.loadings.includes('ADD_UPDATE_NEWSLETTER') || newsletter.loadings.includes('DELETE_NEWSLETTER')} onClick={() => handleShowNewNewsletter()}><BiBookAdd /></Button>}
                            />{' '}</>
                    }

                    <Overlay text='Edit' component={
                        <Button id="edit-newsletter" size="sm" variant={R.isNil(selectedNewsletter) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-success'} disabled={R.isNil(selectedNewsletter)} onClick={() => {
                            dispatch(unselectDocument());
                            setTimeout(() => {
                                navigate("/newsletter/" + selectedNewsletter);
                            }, 100);
                        }}><FiEdit3 /></Button>}
                    />{settings.user.isViewer ? '' : ' '}
                    {
                        settings.user.isViewer ? '' :
                            <Overlay text='Delete' component={
                                <Button id="delete-newsletter" size="sm" variant={R.isNil(selectedNewsletter) || !allowDeletion ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-danger'} disabled={R.isNil(selectedNewsletter) || allowDeletion === false} onClick={() => handleShowDelete()}><FiTrash2 /></Button>}
                            />
                    }
                </Col>

                <Col md="6" xs="12" sm="12">
                    <div className='d-flex float-end'>
                        <FilterBar filterOptions={filterOptions} filters={filters} settings={settings} setFilters={setFilters} shortCss={true}/><span>  </span>
                        <InputGroup className={'search-short-length ' + (settings.darkmode ? 'input-dark-mode' : '')}>
                            <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                        </InputGroup><span>  </span>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}