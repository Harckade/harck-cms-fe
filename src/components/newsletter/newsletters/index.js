import { useDispatch, useSelector } from "react-redux";
import { NewslettersTable } from "./newslettersTable";
import { Toolbar } from "./toolbar";
import { Loading } from "../../common/loading";
import { NewsletterModal } from "./newsletterModal";
import { DeleteModal } from "./deleteModal";
import * as R from 'ramda';
import { useState } from "react";
import { useEffect } from "react";
import { getAllNewsletters } from '../../../actions/newsletter'
import * as diacritics from 'diacritics';

export const Newsletters = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);

    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [selectedNewsletter, setSelectedNewsletter] = useState(undefined);
    const [entries, setEntries] = useState([]);
    const [filters, setFilters] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [show, setShowAddNewNewsletter] = useState(false);

    const handleCloseAddNewNewsletter = () => setShowAddNewNewsletter(false);
    const handleShowAddNewNewsletter = () => setShowAddNewNewsletter(true);

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [currentLang, setCurrentLang] = useState()

    useEffect(() => {
        dispatcher(() => dispatch(getAllNewsletters()));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (newsletter.reload) {
            dispatcher(() => dispatch(getAllNewsletters()));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.reload]);

    useEffect(() => {
        setAvailableLanguages(settings.options.languages);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.options]);

    useEffect(() => {
        if (!R.isNil(selectedNewsletter) && newsletter.items.findIndex(art => art.id === selectedNewsletter.id) === -1) {
            setSelectedNewsletter(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.items.length]);

    useEffect(() => {
        if (availableLanguages.length > 0) {
            if (R.isNil(currentLang) && !R.isNil(availableLanguages) && currentLang !== availableLanguages[0]) {
                setCurrentLang(availableLanguages.length > 0 ? availableLanguages[0] : currentLang);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);

    if (R.isNil(newsletter)) {
        return <Loading />;
    }

    let entriesToDisplay = entries.filter(item => {
        let allLangName = filters.map(f => f.value).map(langKey => item.name[langKey]).join('');
        let itemText = diacritics.remove(`${allLangName}${item.date}${!R.isNil(item.sendDate) &&(!item.sendDate.startsWith("0") || !item.sendDate.startsWith("1601"))? item.sendDate: ''}`).replace(/ /g, '').toLowerCase().trim();
        if (allLangName === '' || (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim())))) {
            return '';
        }
        return item;
    });
    let selectedNewsletterObject = entries.find(e => selectedNewsletter === e.id);
    let allowDeletion = !R.isNil(selectedNewsletterObject) ?  selectedNewsletterObject.sendDate.startsWith('0') || selectedNewsletterObject.sendDate.startsWith('1601') : false;

    return <>
        <Toolbar selectedNewsletter={selectedNewsletter} handleShowNewNewsletter={handleShowAddNewNewsletter} handleShowDelete={handleShowDelete} setSearchFilter={setSearchFilter} setFilters={setFilters} filters={filters} availableLanguages={availableLanguages} allowDeletion={allowDeletion}/>
        {
            newsletter.loadings.includes('FETCH_NEWSLETTERS') || settings.loadings.includes('FETCH_SETTINGS') ?
                <Loading /> :
                <NewslettersTable selectedNewsletter={selectedNewsletter} setSelectedNewsletter={setSelectedNewsletter} entriesToDisplay={entriesToDisplay} entries={entries} setEntries={setEntries} availableLanguages={availableLanguages} filters={filters.map(f => f.value)} />
        }
        <NewsletterModal show={show} handleClose={handleCloseAddNewNewsletter} availableLanguages={availableLanguages} dispatcher={dispatcher} />
        <DeleteModal dispatcher={dispatcher} show={showDelete} availableLanguages={availableLanguages} selectedNewsletter={selectedNewsletterObject} handleClose={handleCloseDelete} />
    </>
}