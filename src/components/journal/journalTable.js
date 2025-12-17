import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import * as R from 'ramda';
import { Col, Container, Row } from 'react-bootstrap';

export const JournalTable = ({ entriesToDisplay, entries, setEntries }) => {
    const journal = useSelector(state => state.journal);
    const settings = useSelector(state => state.settings);

    const sortOptions = { timeStamp: 'timestamp', userEmail: "user email", userId: "user Id", controllerMethod: "action", description: "description" };
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState('timeStamp');

    const sortByProp = (property) => {
        let tmpFiles = JSON.parse(JSON.stringify(journal.items));
        const tmpSort = Object.prototype.toString.call(tmpFiles[0][property]) === "[object String]" ? R.sortBy(R.compose(R.toLower, R.prop(property))) : R.sortBy(R.prop(property));
        tmpFiles = tmpSort(tmpFiles);
        if (invertSort) {
            tmpFiles = R.reverse(tmpFiles);
        }
        setEntries(tmpFiles);
    };

    const sortDocuments = () => {
        if (!R.isNil(journal) && journal.items.length > 0) {
            sortByProp(sortBy);
        }
        else{
            setEntries([]);
        }
    };
   
    useEffect(() => {
        sortDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journal.items.length]);

    useEffect(() => {
        sortDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, invertSort]);

    return (
        entriesToDisplay.length > 0 ?
            <div className="table-responsive files-table">
                <table className={`align-middle table table-bordered table-hover${settings.darkmode ? ' table-dark' : ''}`}>
                    <thead className="sticky-table-header">
                        <tr>
                            {
                                Object.keys(sortOptions).map((op, index) => {
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
                                                        {sortOptions[op]}
                                                    </Col>
                                                    <Col className="text-end">
                                                        {sortBy === sortOptions[op] ? invertSort ? <TiArrowSortedDown /> : <TiArrowSortedUp /> : ' '}
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
                                    <tr key={index}>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.timeStamp}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.userEmail}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.userId}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.controllerMethod}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "50px", maxWidth: '180px' }}>
                                            {item.description === ''? <em className="article-empty-title">Empty description</em>: item.description}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div> : <div className='text-center'>{entries.length === 0 ? 'No journal entries yet' : 'No journal entries were found under selected filters or search query'}</div>
    );
}