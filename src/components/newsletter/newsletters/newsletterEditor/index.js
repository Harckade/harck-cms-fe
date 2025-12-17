import React, { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import * as R from 'ramda';
import { FormControl, InputGroup, Breadcrumb, Button, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import { saveNewsletter, getNewsletterById, selectDocument, getNewsletterContentById } from '../../../../actions/newsletter';
import { sendSignalRMessage } from '../../../../actions/settings';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { SendModal } from './sendModal';
import { Languages } from '../../../../consts/mappers/languages';
import { FiSave } from 'react-icons/fi';
import { RiMailSendLine } from 'react-icons/ri';
import { Loading } from '../../../common/loading';
import { Overlay } from '../../../common/overlay';
import { v4 as uuidv4 } from 'uuid';

export const NewsletterEditor = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const newsletter = useSelector(state => state.newsletter);
    const settings = useSelector(state => state.settings);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [currentLang, setCurrentLang] = useState(undefined);
    const [infoChanged, setInfoChanged] = useState(false);
    const [title, setTitle] = useState({});
    const [author, setAuthor] = useState({});
    const [content, setContent] = useState({});
    const [newsletterId, setNewsletterId] = useState(undefined);
    const [showSendModal, setShowSendModal] = useState(false);
    const handleCloseSendModal = () => setShowSendModal(false);
    const handleShowSendModal = () => setShowSendModal(true);

    const editorReference = [useRef(null), useRef(null), useRef(null)];

    const isLoadingContent = () => {
        return availableLanguages.length > 0 || availableLanguages.filter(langKey => newsletter.htmlContentLoaded[langKey] === true).length === availableLanguages.length ? false : true;
    };

    const canSave = (lang) => { return !settings.user.isViewer && isLoadingContent() === false && (infoChanged === true || JSON.stringify(content[lang]) !== JSON.stringify(newsletter.htmlContent[lang])) };

    const saveDoc = (lang) => {
        if (canSave(lang)) {
            let newsletterToSave = {
                Name: { [lang]: title[lang] },
                Author: { [lang]: author[lang] },
                HtmlContent: { [lang]: content[lang] }
            };
            if (!R.isNil(newsletterId)) {
                newsletterToSave.Id = newsletterId;
            }
            dispatcher(() => dispatch(saveNewsletter(newsletterToSave, lang)));

            dispatcher(() => dispatch(sendSignalRMessage({
                action: "save",
                page: "newsletter",
                payload: {
                    id: newsletterToSave.Id
                },
                randomId: uuidv4()
            })));
        }
    };

    useEffect(() => {
        setAvailableLanguages(settings.options.languages);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.options]);

    useEffect(() => {
        if (availableLanguages.length > 0) {
            if (newsletter.items.filter(i => i.id === id).length === 0) {
                dispatcher(() => dispatch(getNewsletterById(id)));
            }
            setNewsletterId(id);
            if (R.isNil(currentLang) && !R.isNil(availableLanguages) && currentLang !== availableLanguages[0]) {
                setCurrentLang(availableLanguages.length > 0 ? availableLanguages[0] : currentLang);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);



    useEffect(() => {
        setTimeout(() => {
            if ((R.isNil(newsletter.currentNewsletter) && !R.isNil(id) && newsletter.items.length > 0) || (!R.isNil(newsletter.currentNewsletter) && newsletterId !== id)) {
                if (newsletter.newsletterIdContent !== id) {
                    dispatcher(() => dispatch(selectDocument(id)));
                }
            }
        }, 50)
    });

    useEffect(() => {
        if (!R.isNil(newsletter.currentNewsletter) && !R.isNil(newsletterId)) {
            if (newsletter.newsletterIdContent === undefined) {
                availableLanguages.forEach((langKey) => { dispatcher(() => dispatch(getNewsletterContentById(newsletter.currentNewsletter.id, langKey))); });
            }
        }

        function reduceByProp(propery) {
            return availableLanguages.reduce(function (result, langKey) {
                result[langKey] = !R.isNil(newsletter.currentNewsletter[propery][langKey]) ? newsletter.currentNewsletter[propery][langKey] : ''
                return result
            }, {});
        }

        if (!R.isNil(newsletter.currentNewsletter)) {
            setNewsletterId(newsletter.currentNewsletter.id);
            setTitle(reduceByProp('name'));
            setAuthor(reduceByProp('author'));
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.currentNewsletter]);

    useEffect(() => {
        if (newsletter.newsletterIdContent !== undefined && newsletter.newsletterIdContent === id && isLoadingContent() === false) {
            setContent(newsletter.htmlContent);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.newsletterIdContent, newsletter.htmlContent, newsletter.htmlContent[currentLang]]);

    var alreadySent = !R.isNil(newsletter) && !R.isNil(newsletter.currentNewsletter) ? !(newsletter.currentNewsletter.sendDate.toString().startsWith('0') || newsletter.currentNewsletter.sendDate.toString().startsWith('1601') === false) : true;

    return (
        <div className="Blog" >
            <h4 className="text-center">
                Newsletter Editor
            </h4>

            <Container fluid>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Link className={`breadcrumb-item ${settings.darkmode ? 'breadcrumb-item-dark' : ''}`} to="/newsletter">Newsletter</Link>
                            <Breadcrumb.Item active>{newsletterId}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    {
                        settings.user.isViewer ? '' :
                            <Col>
                                <section id="toolbar" aria-label="toolbar" className="text-end">{' '}
                                    <Overlay text="Save" component={
                                        <Button id='save-newsletter' size="sm" variant={settings.darkmode ? "outline-light" : "outline-dark"} disabled={R.isNil(newsletter.currentNewsletter) || R.isNil(content) || R.isNil(currentLang) || R.isNil(content[currentLang]) || !content[currentLang].includes('{{unsubscribeUrl}}')} onClick={() => {
                                            saveDoc(currentLang);
                                        }}><FiSave size={20} />
                                        </Button>}
                                    />{' '}
                                    <Overlay text={!R.isNil(newsletter.currentNewsletter) && !alreadySent ? 'Send' : ''} component={
                                        <Button id='send-newsletter' size="sm" variant={!R.isNil(newsletter.currentNewsletter) && !alreadySent ? "outline-success" : "outline-secondary"} className="align-middle"
                                            disabled={R.isNil(newsletter.currentNewsletter) || alreadySent || content[currentLang] !== newsletter.htmlContent[currentLang] || newsletter.loadings.includes(`SEND_NEWSLETTER_${newsletterId}`) ? true : false} onClick={(event) => {
                                                event.preventDefault();
                                                handleShowSendModal();
                                            }}><RiMailSendLine />
                                        </Button>}
                                    />{' '}
                                </section>
                            </Col>
                    }
                </Row>
            </Container>

            {R.isNil(newsletter.currentNewsletter) || isLoadingContent() ? <Loading /> :
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
                                <span className="input-group-text">Title</span>
                                <FormControl placeholder='Newsletter title' aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                    value={title[langKey]} onChange={(event) => {
                                        let newTitle = structuredClone(title);
                                        newTitle[langKey] = event.target.value;
                                        setTitle(newTitle);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>

                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Author</span>
                                <FormControl placeholder='Newsletter author' aria-label="author" aria-describedby="inputGroup-sizing-sm"
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
                                newsletter.htmlContentLoaded[langKey] === false ? <Loading /> :
                                    <React.Fragment >
                                        <div ref={editorReference[index]}>
                                            <Editor langKey={langKey} defaultContents={content[langKey]} updateContent={(contents) => setContent({ ...content, [langKey]: contents })} />
                                        </div>
                                    </React.Fragment>
                            }
                        </Tab>;
                    })}
                </Tabs>
            }
            {settings.user.isViewer ? '' :
                <SendModal show={showSendModal} handleClose={handleCloseSendModal} dispatcher={dispatcher} newsletterId={newsletterId} />}
        </div>
    );
}