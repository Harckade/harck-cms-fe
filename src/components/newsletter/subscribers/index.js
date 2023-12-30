import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../common/loading";
import * as R from 'ramda';
import { useState } from "react";
import { useEffect } from "react";
import * as diacritics from 'diacritics';
import { getAllSubscribers } from "../../../actions/newsletter";
import { SubscribersTable } from "./subscribersTable";
import { Toolbar } from "./toolbar";
import { Languages } from "../../../consts/mappers/languages";
import { DeleteModal } from "./deleteModal";

export const Subscribers = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [selectedSubscriber, setSelectedSubscriber] = useState(undefined);
    const [entries, setEntries] = useState([]);
    const [filters, setFilters] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(()=>{
        dispatcher(() => dispatch(getAllSubscribers()));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setAvailableLanguages(settings.options.languages);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.options]);

    let entriesToDisplay = entries.filter(item => {
        let allLangName = filters.map(f => f.value).map(langKey => item.language === langKey).filter(r => r === true);
        let itemText = diacritics.remove(`${item.confirmed}${item.emailAddress}${Languages[item.language]}${!R.isNil(item.subscriptionDate) &&(!item.subscriptionDate.startsWith("0") || !item.subscriptionDate.startsWith("1601"))? item.subscriptionDate: ''}`).replace(/ /g, '').toLowerCase().trim();
        if (allLangName.length === 0 ||  (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim())))) {
            return '';
        }
        return item;
    });
    let selectedSubscriberObject = entries.find(e => selectedSubscriber === e.id);
    return <>
        <Toolbar selectedSubscriber={selectedSubscriber} handleShowDelete={handleShowDelete} setFilters={setFilters} setSearchFilter={setSearchFilter} filters={filters} availableLanguages={availableLanguages} />
        {
            (R.isNil(newsletter) || newsletter.loadings.includes("FETCH_SUBSCRIBERS")) || settings.loadings.includes('FETCH_SETTINGS') ? <Loading /> :
                <SubscribersTable selectedSubscriber={selectedSubscriber} setSelectedSubscriber={setSelectedSubscriber} entriesToDisplay={entriesToDisplay} entries={entries} setEntries={setEntries} />
        }
         <DeleteModal dispatcher={dispatcher} show={showDelete}  selectedSubscriber={selectedSubscriberObject} handleClose={handleCloseDelete} />
    </>
}