import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TiArrowSortedUp, TiArrowSortedDown} from 'react-icons/ti';
import * as R from 'ramda';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { unselectDocument, stopForcedUpdate } from '../../../actions/newsletter';
import { Languages } from '../../../consts/mappers/languages';

export const NewslettersTable = ({ selectedNewsletter, setSelectedNewsletter, entriesToDisplay, entries, setEntries, availableLanguages, filters }) => {
    const dispatch = useDispatch();
    const newsletter = useSelector(state => state.newsletter);
    const settings = useSelector(state => state.settings);
    const navigate = useNavigate();

    const sortOptions = availableLanguages.concat(['date', 'sendDate']);
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState('date');

    const handleSelectArticle = (item) => {
        if (selectedNewsletter === item.id) {
            setSelectedNewsletter(undefined);
        }
        else {
            setSelectedNewsletter(item.id);
        }
    }

    const openArticle = (item) => {
        dispatch(unselectDocument());
        setTimeout(() => {
            navigate("/newsletter/" + item.id);
        }, 100);
    }

    function sortDocuments() {
        if (!R.isNil(newsletter) && newsletter.items.length > 0) {
            let tmpDocuments = JSON.parse(JSON.stringify(newsletter.items));
            if (sortBy === 'date' || sortBy === 'sendDate') {
                const tmpSort = R.sortBy(R.prop(sortBy));
                tmpDocuments = tmpSort(tmpDocuments);
            }
            else {
                tmpDocuments = tmpDocuments.sort(function (a, b) {
                    let nameA = R.isNil(a.name[sortBy]) ? '' : a.name[sortBy];
                    let nameB = R.isNil(b.name[sortBy]) ? '' : b.name[sortBy];
                    return nameA.localeCompare(nameB);
                });
            }
            if (invertSort) {
                tmpDocuments = R.reverse(tmpDocuments);
            }
            setEntries(tmpDocuments);
        }
        else {
            setEntries([]);
        }
    };

    useEffect(() => {
        if (newsletter.items !== []) {
            sortDocuments();
        } else {
            setEntries([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.items.length]);

    useEffect(() => {
        if (newsletter.forceUpdate === true) {
            if (newsletter.items !== []) {
                sortDocuments();
            } else {
                setEntries([]);
            }
            dispatch(stopForcedUpdate());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.forceUpdate]);

    useEffect(() => {
        if (newsletter.items !== []) {
            sortDocuments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, invertSort]);

    return (
        entriesToDisplay.length > 0 ?
            <div className="table-responsive files-table">
                <table className={`align-middle table table-bordered table-hover${settings.darkmode ? ' table-dark' : ''}`}>
                    <thead className="sticky-table-header">
                        <tr>
                            <th className="text-center" onClick={() => {

                            }}>
                                <input type="checkbox" id="selectAllFiles" name="select all newsletters" value="select all newsletters" disabled={true} />
                            </th>
                            {
                                sortOptions.map((op, index) => {
                                    if (op !== 'date' && op !== 'sendDate' && !filters.includes(op)) {
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
                                                        {op === 'date' ? 'updated' :
                                                            op === 'sendDate' ? 'send date' :
                                                                Languages[op].toLowerCase()}
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
                        </tr>
                    </thead>
                    <tbody>
                        {
                            entriesToDisplay.map((item, index) => {
                                let wasNotSent = item.sendDate.startsWith('0') || item.sendDate.startsWith('1601');
                                return (
                                    <tr key={index} className={selectedNewsletter === item.id ? "selected-row" : ""} onClick={(ev) => handleSelectArticle(item, ev)} onKeyUp={(event) => {
                                        if (event.code === 'Enter') {
                                            openArticle(item);
                                        }
                                    }} onDoubleClick={() => openArticle(item)} style={{ cursor: 'pointer' }}>
                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }} onClick={() => handleSelectArticle(item)}>
                                            <input type="checkbox" id={`select-newsletter-${index}`} name="select newsletter" value="selected newsletter" checked={selectedNewsletter === item.id} onChange={() => { }} />
                                        </td>

                                        {availableLanguages.map((langKey) => {
                                            if (!filters.includes(langKey)) {
                                                return '';
                                            }
                                            return (
                                                <td key={`name-${langKey}`} className='text-start text-truncate align-middle' style={{ minWidth: "140px", maxWidth: '200px' }}>
                                                    {R.isNil(item.name[langKey]) || item.name[langKey].trim() === '' ? <em className="article-empty-title">Empty title</em> : item.name[langKey]}
                                                    {!R.isNil(item.author[langKey]) && item.author[langKey] !== '' ? <section about="newsletter author" className='description text-truncate'> {item.author[langKey]}</section> : ''}
                                                </td>)
                                        })}

                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.date}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {wasNotSent ? <em className="article-empty-title">To be sent</em>: item.sendDate}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div> : <div className='text-center'>{entries.length === 0 ? 'No newsletters yet' : 'No newsletters were found under selected filters or search query'}</div>
    );
}