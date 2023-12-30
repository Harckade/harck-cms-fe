import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../actions/users';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Loading } from '../../common/loading';
import * as diacritics from 'diacritics';
import { NewUserModal } from './newUserModal';
import { DeleteModal } from './deleteModal';
import { EditModal } from './editModal';
import { UsersTable } from './usersTable';
import { Toolbar } from './toolbar';

export const Users = ({dispatcher}) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);

    const [selectedUser, setSelectedUser] = useState(undefined);
    const [showAddNew, setAddNew] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [entries, setEntries] = useState([]);

    const handleCloseNew = () => setAddNew(false);
    const handleAddNew = () => setAddNew(true);

    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const handleShowEdit = () => setShowEdit(true);
    const handleCloseEdit = () => setShowEdit(false);

    const [searchFilter, setSearchFilter] = useState('');
    const rolesOptions = [
        { value: 'viewer', label: 'Viewer' },
        { value: 'editor', label: 'Editor' },
        { value: 'administrator', label: 'Administrator' }
    ];
    const [filters, setFilters] = useState(rolesOptions);

    useEffect(() => {
        dispatcher(() => dispatch(getUsers()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (R.isNil(users) || users.loadings.includes('FETCH_USERS')) {
        return <Loading />;
    }

    let entriesToDisplay = entries.filter(item => {
        let itemText = diacritics.remove(item.name + item.email + item.role).replace(/ /g, '').toLowerCase().trim();
        if (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim()))) {
            return null;
        }

        if (filters.length === 0 || filters.filter(f => f.value === item.role.toLowerCase()).length === 0) {
            return null;
        }
        return item;
    });

    return (
        <div>
            <Toolbar selectedUser={selectedUser} handleAddNew={handleAddNew} handleShowDelete={handleShowDelete} handleShowEdit={handleShowEdit} setFilters={setFilters} filters={filters} setSearchFilter={setSearchFilter} rolesOptions={rolesOptions}/>
            <UsersTable selectedUser={selectedUser} setSelectedUser={setSelectedUser} entriesToDisplay={entriesToDisplay} entries={entries} setEntries={setEntries} handleShowEdit={handleShowEdit}/>
            <NewUserModal show={showAddNew} handleClose={handleCloseNew} dispatcher={dispatcher} />
            <DeleteModal show={showDelete} handleClose={handleCloseDelete} user={entries.find(e => selectedUser === e.id)} dispatcher={dispatcher} />
            <EditModal show={showEdit} handleClose={handleCloseEdit} user={entries.find(e => selectedUser === e.id)} dispatcher={dispatcher} rolesOptions={rolesOptions}/>
        </div>
    );
};
