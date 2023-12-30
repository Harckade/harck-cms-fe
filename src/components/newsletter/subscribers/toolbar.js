import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../design/custom.css';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import { FiTrash2 } from 'react-icons/fi';
import { MultiSelect } from 'react-multi-select-component';
import { Languages } from '../../../consts/mappers/languages';
import { Overlay } from '../../common/overlay';

export const Toolbar = ({ selectedSubscriber, handleShowDelete, setSearchFilter, setFilters, filters, availableLanguages }) => {
    const settings = useSelector(state => state.settings);
    const filterOptions = availableLanguages.map((langKey) => { return { value: langKey, label: Languages[langKey] } });

    useEffect(() => {
        if (availableLanguages.length > 0) {
            setFilters(filterOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);

    const ovverrides = {
        "selectSomeItems": "Filter by language",
        "allItemsAreSelected": "All languages are selected"
    };

    return (
        <Container id="subscribers-toolbar" fluid className={`files-toolbar ${settings.darkmode ? 'dark-mode' : ''}`}>
            <Row>
                <Col xs="6">
                    {
                        settings.user.isViewer ? '' :
                            <Overlay text='Delete' component={
                                <Button id="delete-sibscriber" size="sm" variant={R.isNil(selectedSubscriber) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-danger'} disabled={R.isNil(selectedSubscriber)} onClick={() => handleShowDelete()}><FiTrash2 /></Button>}
                            />
                    }
                </Col>
                <Col md="6" xs="12" sm="12">
                    <div className='d-flex float-end'>
                        <MultiSelect
                            options={filterOptions}
                            value={filters}
                            onChange={(val) => setFilters(val)}
                            labelledBy="Filter by language"
                            hasSelectAll={true}
                            overrideStrings={ovverrides}
                            className={'search-short-length ' + (settings.darkmode ? 'input-dark-mode' : '')}
                        /><span>  </span>
                        <InputGroup className={'search-short-length ' + (settings.darkmode ? 'input-dark-mode' : '')}>
                            <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                        </InputGroup><span>  </span>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}