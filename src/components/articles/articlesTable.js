import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TiArrowSortedUp, TiArrowSortedDown, TiLockClosed, TiLockOpenOutline } from 'react-icons/ti';
import * as R from 'ramda';
import { Col, Container, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { unselectDocument, stopForcedUpdate } from '../../actions/articles';
import { FiEyeOff } from 'react-icons/fi';
import { Languages } from '../../consts/mappers/languages';
import { Overlay } from '../common/overlay';

export const ArticlesTable = ({selectedArticle, setSelectedArticle, entriesToDisplay, entries, setEntries, availableLanguages, filters}) => {
    const dispatch = useDispatch();
    const articles = useSelector(state => state.articles);
    const settings = useSelector(state => state.settings);
    const navigate = useNavigate();

    const sortOptions = availableLanguages.concat(['date']);
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState('date');

    const handleSelectArticle = (item) => {
        if (selectedArticle === item.id) {
            setSelectedArticle(undefined);
        }
        else {
            setSelectedArticle(item.id);
        }
    }

    const openArticle = (item) => {
        dispatch(unselectDocument());
        setTimeout(() => {
            navigate("/articles/" + item.id);
        }, 100);
    }
    
    function sortDocuments() {
        if (!R.isNil(articles) && articles.items.length > 0) {
            let tmpDocuments = JSON.parse(JSON.stringify(articles.items));
            if (sortBy === 'date') {
                const tmpSort = R.sortBy(R.prop(sortBy));
                tmpDocuments = tmpSort(tmpDocuments);
            }
            else{
                tmpDocuments = tmpDocuments.sort(function (a, b) {
                    let nameA = R.isNil(a.name[sortBy]) ? '': a.name[sortBy];
                    let nameB = R.isNil(b.name[sortBy]) ? '': b.name[sortBy];
                    return nameA.localeCompare(nameB);
                });
            }
            if (invertSort) {
                tmpDocuments = R.reverse(tmpDocuments);
            }
            setEntries(tmpDocuments);
        }
        else{
            setEntries([]);
        }
    };

    useEffect(() => {
        if (articles.items !== []) {
            sortDocuments();
        }else{
            setEntries([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.items.length]);

    useEffect(() => {
        if (articles.forceUpdate === true){
            if (articles.items !== []) {
                sortDocuments();
            }else{
                setEntries([]);
            }
            dispatch(stopForcedUpdate());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.forceUpdate]);

    useEffect(() => {
        if (articles.items !== []) {
            sortDocuments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, invertSort]);

    return (
        entriesToDisplay.length > 0 ?
        <div className="table-responsive files-table">
            <table className={`align-middle table table-bordered table-hover${settings.darkmode? ' table-dark': ''}`}>
                <thead className="sticky-table-header">
                    <tr>
                        <th className="text-center" onClick={() => {
  
                        }}>
                            <input type="checkbox" id="selectAllFiles" name="select all articles" value="select all articles"  disabled={true} />
                        </th>
                        {
                            sortOptions.map((op, index) => {
                                if (op !== 'date' && !filters.includes(op)){
                                    return '';
                                }
                                return (
                                    <th className={'text-start col'} key={index} onClick={() => {
                                        if (sortBy === op) {
                                            setInvertSort(!invertSort);
                                        }
                                        else {
                                            setInvertSort(false);
                                        }
                                        setSortBy(op);
                                    }}>
                                        <Container>
                                            <Row>
                                                <Col className="text-start">
                                                    {op === 'date' ? 'updated' : Languages[op].toLowerCase()}
                                                </Col>
                                                <Col className="text-end">
                                                    {sortBy === op ? invertSort ? <TiArrowSortedDown /> : <TiArrowSortedUp /> : ' '}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </th>
                                )
                            })
                            }
                            <Overlay placement="top" text='Is published?' component={
                                <th className="text-center">
                                    <FiEyeOff />
                                </th>}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            entriesToDisplay.map((item, index) => {
                                return (
                                    <tr key={index} className={selectedArticle === item.id ? "selected-row" : ""} onClick={(ev) => handleSelectArticle(item, ev)} onKeyUp={(event) => { 
                                        if (event.code === 'Enter'){
                                            openArticle(item);
                                        }
                                    }} onDoubleClick={() => openArticle(item)} style={{ cursor: 'pointer' }}>
                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }} onClick={() => handleSelectArticle(item)}>
                                            <input type="checkbox" id={`select-article-${index}`} name="select article" value="selected article" checked={selectedArticle === item.id} onChange={()=>{}} />
                                        </td>
                                        
                                        {availableLanguages.map((langKey) => {
                                            if (!filters.includes(langKey)) {
                                                return '';
                                            }
                                            return (
                                                <td key={`name-${langKey}`} className='text-start text-truncate align-middle' style={{ minWidth: "140px", maxWidth: '200px' }}>
                                                    {R.isNil(item.name[langKey]) || item.name[langKey].trim() === '' ? <em className="article-empty-title">Empty title</em> : item.name[langKey]}
                                                    {!R.isNil(item.description[langKey]) && item.description[langKey] !== '' ? <section about="article description" className='description text-truncate'> {item.description[langKey]}</section>: ''}
                                                </td>)
                                        })}

                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.date}
                                        </td>

                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }}>
                                            {item.published === true ? <TiLockOpenOutline /> : <TiLockClosed />}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                </tbody>
            </table>
        </div> : <div className='text-center'>{entries.length === 0 ? 'No articles yet' : 'No articles were found under selected filters or search query'}</div>
    );
}