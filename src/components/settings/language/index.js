import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../design/custom.css';
import { Languages } from '../../../consts/mappers/languages';
import { MultiSelect } from 'react-multi-select-component';
import * as R from 'ramda';
import { Alert, Button, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../../actions/settings';
import { Loading } from '../../common/loading';

export const Language = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const [currentLanguages, setCurrentLanguages] = useState([]);
    const [defaultLanguage, setDefaultLanguage] = useState(undefined);

    const multiSelectOption = (langKey) => {
        return { value: langKey, label: Languages[langKey] };
    }

    const languageOptions = Object.keys(Languages).map((langKey) => multiSelectOption(langKey));
    const ovverrides = { "selectSomeItems": "Select languages" };

    useEffect(() => {
        if (!R.isNil(settings.options) && !R.isNil(settings.options.languages) && settings.options.languages.length !== 0) {
            setCurrentLanguages(settings.options.languages.map((l) => multiSelectOption(l)));
        }
        if (!R.isNil(settings.options) && !R.isNil(settings.options.defaultLanguage)) {
            setDefaultLanguage(settings.options.defaultLanguage);
        }
    }, [settings.options]);

    if (settings.loadings.includes("FETCH_SETTINGS"))
        return <Loading />;

    return (
        <div className='text-start text-margins'>
            <Alert variant={settings.user.isAdministrator ? "primary" : "warning"} className={settings.user.isAdministrator ? '' : 'text-center'}>
                {
                    settings.user.isAdministrator ? 'Please have in mind, that if you already created an article in a language that you are about to disable the article will remain stored on the system, but its content will not be available on the CMS until you activate the language again.'
                        : 'Only an administrator can update system languages'
                }
            </Alert>
            {settings.user.isAdministrator ? <p>Update CMS languages by selecting them from the following menu</p> : ''}
            <MultiSelect
                options={languageOptions}
                value={currentLanguages}
                onChange={(val) => setCurrentLanguages(val)}
                labelledBy="Languages"
                hasSelectAll={true}
                overrideStrings={ovverrides}
                disabled={!settings.user.isAdministrator}
                className={settings.darkmode ? 'input-dark-mode' : ''}
            />
            <InputGroup size="md" aria-label="Default language" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                <span className="input-group-text">Default language</span>
                <select value={defaultLanguage} className="form-control" disabled={!settings.user.isAdministrator} onChange={(event) => {
                    setDefaultLanguage(event.target.value);
                }}>
                    {currentLanguages.map((lang, index) => {
                        return <option key={index} value={lang.value}>{lang.label}</option>
                    })}
                </select>
            </InputGroup>
            <br />
            {
                settings.user.isAdministrator ?
                    <div className="text-center">
                        <Button variant="outline-success" className={settings.loadings.includes('UPDATE_SETTINGS') ? "progress-bar-striped progress-bar-animated" : ''} disabled={currentLanguages.length === 0 || settings.loadings.includes("FETCH_SETTINGS") || settings.loadings.includes("UPDATE_SETTINGS")} onClick={() => {
                            dispatcher(() => dispatch(updateSettings({ languages: currentLanguages.map(el => el.value), defaultLanguage: defaultLanguage })));
                        }}>Apply changes</Button>
                        {currentLanguages.length === 0 ? <div className="error-message text-center">Select at least one language</div> : ''}
                    </div>
                    : ''
            }
        </div>
    );
}