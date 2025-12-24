import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { BiBookAdd, BiRecycle } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { unselectDocument } from '../../actions/articles';
import { Languages } from '../../consts/mappers/languages';
import { Overlay } from '../common/overlay';
import { FilterBar } from '../common/filterBar';

export const Toolbar = ({ selectedArticle, handleShowNewArticle, handleShowDelete, handleShowRecycle, setSearchFilter, setFilters, filters, availableLanguages }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const articles = useSelector(state => state.articles);
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
                            <><Overlay text='New article' component={
                                <Button id="add-article" size="sm" variant='outline-primary' disabled={articles.loadings.includes('ADD_UPDATE_ARTICLE') || articles.loadings.includes('DELETE_ARTICLE')} onClick={() => handleShowNewArticle()}><BiBookAdd /></Button>}
                            />{' '}</>
                    }

                    <Overlay text='Edit' component={
                        <Button id="edit-article" size="sm" variant={R.isNil(selectedArticle) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-success'} disabled={R.isNil(selectedArticle)} onClick={() => {
                            dispatch(unselectDocument());
                            setTimeout(() => {
                                navigate("/articles/" + selectedArticle);
                            }, 100);
                        }}><FiEdit3 /></Button>}
                    />{settings.user.isViewer ? '' : ' '}
                    {
                        settings.user.isViewer ? '' :
                            <Overlay text='Delete' component={
                                <Button id="delete-article" size="sm" variant={R.isNil(selectedArticle) ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-danger'} disabled={R.isNil(selectedArticle)} onClick={() => handleShowDelete()}><FiTrash2 /></Button>}
                            />
                    }
                </Col>

                <Col md="6" xs="12" sm="12">
                    <div className='d-flex float-end'>
                        <FilterBar filterOptions={filterOptions} filters={filters} settings={settings} setFilters={setFilters} shortCss={true}/><span>  </span>
                        <InputGroup className={'search-short-length ' + (settings.darkmode ? 'input-dark-mode' : '')}>
                            <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                        </InputGroup><span>  </span>
                        {settings.user.isViewer ? '' :
                            <Overlay text='Recycle bin' component={
                                <Button id="recycle" size="sm" variant="link" className="transparent-btn" onClick={handleShowRecycle}><BiRecycle size={20} /></Button>}
                            />
                        }
                        
                    </div>
                </Col>
            </Row>
        </Container>
    );
}