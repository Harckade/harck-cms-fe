import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiArrowSortedUp, TiArrowSortedDown} from 'react-icons/ti';
import * as R from 'ramda';
import { Col, Container, Row } from 'react-bootstrap';
import { Languages } from '../../../consts/mappers/languages';

export const SubscribersTable = ({ selectedSubscriber, setSelectedSubscriber, entriesToDisplay, entries, setEntries }) => {
    const newsletter = useSelector(state => state.newsletter);
    const settings = useSelector(state => state.settings);

    const sortOptions = ['emailAddress', 'subscriptionDate', 'language', 'confirmed'];
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState('subscriptionDate');

    const handleSelectArticle = (item) => {
        if (selectedSubscriber === item.id) {
            setSelectedSubscriber(undefined);
        }
        else {
            setSelectedSubscriber(item.id);
        }
    }

    function sortDocuments() {
        if (!R.isNil(newsletter) && newsletter.subscribers.length > 0) {
            let tmpSubscribers = JSON.parse(JSON.stringify(newsletter.subscribers));
            if (sortBy === 'subscriptionDate' || sortBy === 'confirmed') {
                const tmpSort = R.sortBy(R.prop(sortBy));
                tmpSubscribers = tmpSort(tmpSubscribers);
            }
            else {
                tmpSubscribers = tmpSubscribers.sort(function (a, b) {
                    let nameA = R.isNil(a[sortBy]) ? '' : sortBy==="language"? Languages[a[sortBy]]: a[sortBy];
                    let nameB = R.isNil(b[sortBy]) ? '' : sortBy==="language"? Languages[b[sortBy]]: b[sortBy];
                    return nameA.localeCompare(nameB);
                });
            }
            if (invertSort) {
                tmpSubscribers = R.reverse(tmpSubscribers);
            }
            setEntries(tmpSubscribers);
        }
        else {
            setEntries([]);
        }
    };

    useEffect(() => {
        if (newsletter.subscribers !== []) {
            sortDocuments();
        } else {
            setEntries([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.subscribers.length]);

    useEffect(() => {
        if (newsletter.subscribers !== []) {
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
                                <input type="checkbox" id="selectAllSubscribers" name="select all subscribers" value="select all subscribers" disabled={true} />
                            </th>
                            
                            {
                                sortOptions.map((op, index) => {
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
                                                        {op === 'subscriptionDate' ? 'subscription date' :
                                                            op === 'emailAddress' ? 'email address' :
                                                                op === 'confirmed' ? 'confirmed' :  op === 'language' ? 'language' : ' '}
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
                                return (
                                    <tr key={index} className={selectedSubscriber === item.id ? "selected-row" : ""} onClick={(ev) => handleSelectArticle(item, ev)} style={{ cursor: 'pointer' }}>
                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }} onClick={() => handleSelectArticle(item)}>
                                            <input type="checkbox" id={`select-subscriber-${index}`} name="select subscriber" value="selected subscriber" checked={selectedSubscriber === item.id} onChange={() => { }} />
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.emailAddress}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.subscriptionDate}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {Languages[item.language]}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {!item.confirmed ? <em className="article-empty-title">Not confirmed</em>: "Confirmed"}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div> : <div className='text-center'>{entries.length === 0 ? 'No subscribers yet' : 'No subscribers were found under selected filters or search query'}</div>
    );
}