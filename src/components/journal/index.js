import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJournal } from '../../actions/journal';
import * as diacritics from 'diacritics';
import { JournalTable } from './journalTable';
import { Toolbar } from './toolbar';
import * as R from 'ramda';
import { Loading } from '../common/loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import { subMonths } from 'date-fns'

export const Journal = ({ dispatcher }) => {
    const currentDate = new Date();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const journal = useSelector(state => state.journal);
    const settings = useSelector(state => state.settings);
    const [entries, setEntries] = useState([]);
    const filterOptions = [
        { value: 'AddFolder', label: 'AddFolder' },
        { value: 'DeleteFile', label: 'DeleteFile' },
        { value: 'InviteUser', label: 'InviteUser' },
        { value: 'DeleteUser', label: 'DeleteUser' },
        { value: 'EditUser', label: 'EditUser' },
        { value: 'UpdateSettings', label: 'UpdateSettings' },
        { value: 'LaunchDeployment', label: 'LaunchDeployment' },
        { value: 'UploadFile', label: 'UploadFile' },
        { value: 'AddUpdateArticle', label: 'AddUpdateArticle' },
        { value: 'DeleteArticleById', label: 'DeleteArticleById' },
        { value: 'PublishArticleById', label: 'PublishArticleById' }
    ]
    const [filters, setFilters] = useState(filterOptions);
    const [searchFilter, setSearchFilter] = useState('');
    const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState(currentDate);

    useEffect(() => {
        if (!R.isNil(startDate) && !R.isNil(endDate)){
            dispatcher(() => dispatch(getJournal(startDate, endDate)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    if (!R.isNil(settings) && !R.isNil(settings.user) && !settings.user.isAdministrator){
        navigate("/");
    }

    if (R.isNil(journal)) {
        return <Loading />;
    }
    
    let entriesToDisplay = entries.filter(item => {
        let itemText = diacritics.remove(item.userEmail + item.timestamp + item.userId + item.controllerMethod + item.description).replace(/ /g, '').toLowerCase().trim();
        if (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim()))) {
            return null;
        }

        if (filters.length === 0 || filters.filter(f => f.value === item.controllerMethod).length === 0) {
            return null;
        }
        return item;
    });

    return (
        <div className="Blog">
            <h4 className="text-center">
                Journal
            </h4>
            <Toolbar startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} setSearchFilter={setSearchFilter} setFilters={setFilters} filters={filters} filterOptions={filterOptions}/>
            {
                journal.loadings.includes('FETCH_JOURNAL') ?
                    <Loading /> :
                    <JournalTable entriesToDisplay={entriesToDisplay} entries={entries} setEntries={setEntries} />
            }
        </div>
    );
};
