import React, { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import * as R from 'ramda';
import { FormControl, InputGroup, Button, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import { saveSubscriptionTemplate, getSubscriptionTemplate, getSubscriptionTemplateContent } from '../../../actions/newsletter';
import { sendSignalRMessage } from '../../../actions/settings';
import { useDispatch, useSelector } from 'react-redux';

import { Languages } from '../../../consts/mappers/languages';
import { FiSave } from 'react-icons/fi';
import { Loading } from '../../common/loading';
import { Overlay } from '../../common/overlay';
import { v4 as uuidv4 } from 'uuid';

export const SubscriptionTemplate = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const newsletter = useSelector(state => state.newsletter);
    const settings = useSelector(state => state.settings);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [currentLang, setCurrentLang] = useState(undefined);
    const [infoChanged, setInfoChanged] = useState(false);
    const [subject, setSubject] = useState({});
    const [author, setAuthor] = useState({});
    const [content, setContent] = useState({});
    const [contentLoaded, setContentLoaded] = useState(false);
    const editorReference = [useRef(null), useRef(null), useRef(null)];

    const isLoadingContent = () => {
        return availableLanguages.length > 0 || availableLanguages.filter(langKey => newsletter.subscriptionTemplatehtmlContentLoaded[langKey] === true).length === availableLanguages.length ? false : true;
    };

    const canSave = (lang) => { return !settings.user.isViewer && isLoadingContent() === false && (infoChanged === true || JSON.stringify(content[lang]) !== JSON.stringify(newsletter.subscriptionTemplateContent[lang])) };

    const saveDoc = (lang) => {
        if (canSave(lang)) {
            let templateToSave = {
                Subject: { [lang]: subject[lang] },
                Author: { [lang]: author[lang] },
                HtmlContent: { [lang]: content[lang] }
            };
            dispatcher(() => dispatch(saveSubscriptionTemplate(templateToSave, lang)));

            dispatcher(() => dispatch(sendSignalRMessage({
                action: "save",
                page: "subscriptionTemplate",
                payload: {
                    id: templateToSave.Id
                },
                randomId: uuidv4()
            })));
        }
    };

    useEffect(() => {
        setAvailableLanguages(settings.options.languages);
    }, [settings.options]);

    useEffect(() => {
        if (availableLanguages.length > 0) {
            if (R.isNil(newsletter.subscriptionTemplate)) {
                dispatcher(() => dispatch(getSubscriptionTemplate()));
            }
            if (R.isNil(currentLang) && !R.isNil(availableLanguages) && currentLang !== availableLanguages[0]) {
                setCurrentLang(availableLanguages.length > 0 ? availableLanguages[0] : currentLang);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);


    useEffect(() => {
        if (!R.isNil(newsletter.subscriptionTemplate)) {
            if (contentLoaded === false) {
                setContentLoaded(true);
                availableLanguages.forEach((langKey) => { dispatcher(() => dispatch(getSubscriptionTemplateContent(langKey))); });
            }
        }

        function reduceByProp(propery) {
            return availableLanguages.reduce(function (result, langKey) {
                result[langKey] = !R.isNil(newsletter.subscriptionTemplate[propery][langKey]) ? newsletter.subscriptionTemplate[propery][langKey] : ''
                return result
            }, {});
        }

        if (!R.isNil(newsletter.subscriptionTemplate)) {
            setSubject(reduceByProp('subject'));
            setAuthor(reduceByProp('author'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.subscriptionTemplate]);

    useEffect(() => {
        if (newsletter.subscriptionTemplate !== undefined && isLoadingContent() === false) {
            setContent(newsletter.subscriptionTemplateContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.subscriptionTemplateContent, newsletter.subscriptionTemplateContent[currentLang]]);

    return (
        <div className="Blog" >
            <Container fluid>
                <Row>
                    {
                        settings.user.isViewer ? '' :
                            <Col>
                                <section id="toolbar" aria-label="toolbar" className="text-end">{' '}
                                    <Overlay text="Save" component={
                                        <Button id='save-newsletter' size="sm" variant={settings.darkmode ? "outline-light" : "outline-dark"} disabled={R.isNil(newsletter.subscriptionTemplate) || R.isNil(content) || R.isNil(currentLang) || R.isNil(content[currentLang]) || !content[currentLang].includes('{{confirmationUrl}}')} onClick={() => {
                                            saveDoc(currentLang);
                                        }}><FiSave size={20} />
                                        </Button>}
                                    />{' '}
                                </section>
                            </Col>
                    }
                </Row>
            </Container>

            {R.isNil(newsletter.subscriptionTemplate) || isLoadingContent() ? <Loading /> :
                <Tabs id="language-tabs" className={settings.darkmode ? 'dark-mode-tabs' : ''} onClick={(e) => {
                    setCurrentLang(e.target.dataset.rrUiEventKey);
                }}>
                    {availableLanguages.map((langKey, index) => {
                        let saveElements = !R.isNil(editorReference[index]) && !R.isNil(editorReference[index].current) ? editorReference[index].current.getElementsByClassName("se-btn _se_command_save se-resizing-enabled se-tooltip") : undefined;
                        if (!R.isNil(saveElements) && saveElements.length > 0) {
                            saveElements[0].removeAttribute("disabled");
                        }
                        return <Tab key={index} title={Languages[langKey]} eventKey={langKey}>
                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Subject</span>
                                <FormControl placeholder='Confirmation email title' aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                    value={subject[langKey]} onChange={(event) => {
                                        let newSubject = structuredClone(subject);
                                        newSubject[langKey] = event.target.value;
                                        setSubject(newSubject);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>

                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Author</span>
                                <FormControl placeholder='Confirmation email author' aria-label="author" aria-describedby="inputGroup-sizing-sm"
                                    value={author[langKey]} onChange={(event) => {
                                        let newAuthor = structuredClone(author);
                                        newAuthor[langKey] = event.target.value;
                                        setAuthor(newAuthor);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>
                            {
                                newsletter.subscriptionTemplateHtmlContentLoaded[langKey] === false ? <Loading /> :
                                    <React.Fragment >
                                        <div ref={editorReference[index]}>
                                            <Editor langKey={langKey} defaultContents={content[langKey] === ''? '<mjml><mj-body></mj-body></mjml>': content[langKey]} updateContent={(contents) => setContent({ ...content, [langKey]: contents })} />
                                        </div>
                                    </React.Fragment>
                            }
                        </Tab>;
                    })}
                </Tabs>
            }
        </div>
    );
}