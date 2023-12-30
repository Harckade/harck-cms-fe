import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import * as R from 'ramda';
import { Col, Container, Row } from 'react-bootstrap';

export const UsersTable = ({selectedUser, setSelectedUser,entriesToDisplay, entries, setEntries, handleShowEdit}) => {
    const users = useSelector(state => state.users);
    const settings = useSelector(state => state.settings);
    const sortOptions = { name: 'name', email: "email", role: "role"};
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState('name');

    const handleSelectUser = (item) => {
        if (selectedUser === item.id) {
            setSelectedUser(undefined);
        }
        else {
            setSelectedUser(item.id);
        }
    }

    const selectAndEdit = (item) => {
        if (selectedUser !== item.id){
            handleSelectUser(item);
        }
        handleShowEdit();
    }

    const sortUsers = () => {
        if (!R.isNil(users) && users.items.length > 0) {
            let tmpDocuments = JSON.parse(JSON.stringify(users.items));
            const tmpSort = R.sortBy(R.prop(sortBy));
            tmpDocuments = tmpSort(tmpDocuments);
            if (invertSort) {
                tmpDocuments = R.reverse(tmpDocuments);
            }
            setEntries(tmpDocuments);
        }
    };

    useEffect(() => {
        if (users.items !== []) {
            sortUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.items]);

    useEffect(() => {
        if (users.items !== []) {
            sortUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, invertSort]);

    return (
        entriesToDisplay.length > 0 ?
        <div className="table-responsive files-table">
            <table className={`align-middle table table-bordered table-hover ${settings.darkmode? 'table-dark': ''}`}>
                <thead className="sticky-table-header">
                    <tr>
                        <th className="text-center" onClick={() => {}}>
                            <input type="checkbox" id="selectAllFiles" name="select all users" value="select all users"  disabled={true} />
                        </th>
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
                                    <tr key={index} className={selectedUser === item.id ? "selected-row" : ""} onClick={() => handleSelectUser(item)} onKeyUp={(event) => { 
                                        if (event.code === 'Enter'){
                                            selectAndEdit(item);
                                        }
                                    }} onDoubleClick={() => {selectAndEdit(item)}}>
                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }} onClick={() => {}}>
                                            <input type="checkbox" id={`select-user-${index}`} name="select user" value="selected user" checked={selectedUser === item.id} onChange={() => { }} />
                                        </td>

                                        <td className='text-start text-truncate' style={{ maxWidth: '150px' }}>
                                            {item.name}
                                        </td>
                                        <td className='text-start text-truncate' style={{ maxWidth: '200px' }}>
                                            {item.email}
                                        </td>
                                        <td className='text-start capitalize'>
                                            {item.role}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                </tbody>
            </table>
        </div> : <div className='text-center'>{entries.length === 0 ? 'No users were added to the system yet. It should be impossible to see this message' : 'No users were found under selected filters or search query'}</div>
    );
}