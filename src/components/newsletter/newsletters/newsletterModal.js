import React, {useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Form, FormControl, InputGroup, Modal, Tab, Tabs } from 'react-bootstrap';
import { saveNewsletter } from '../../../actions/newsletter';
import { Languages } from '../../../consts/mappers/languages';

export  const NewsletterModal = ({ show, handleClose, availableLanguages, dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const newsletter = useSelector(state => state.newsletter);
    const [newNewsletter, setNewNewsletter] = useState({
        author: {},
        title: {}

    });

    const beforeClose = () => {
        handleClose();
        setTimeout(() => {
            setNewNewsletter({
                author: {},
                title: {}
            });
            setValidated(false);
        }, 10);
    }

    useEffect(() => {
        beforeClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsletter.items.length]);

    const formRef = useRef(null);
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = formRef.current;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    let createnewNewsletter = availableLanguages.filter(t => !R.isNil(newNewsletter.title[t]) && newNewsletter.title[t] !== '').length > 0;

    return (
        <Modal show={show} onHide={beforeClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Create new Newsletter</Modal.Title>
            </Modal.Header>

            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                <Form validated={validated} ref={formRef}>
                    <Tabs id="language-tabs" className={settings.darkmode ? 'dark-mode-tabs': ''}>
                        {availableLanguages.map((language, index) => {
                            return <Tab key={index} title={Languages[language]} eventKey={language}>
                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                <span className="input-group-text">Title</span>
                                    <FormControl required={!createnewNewsletter} placeholder={'Newsletter title in ' + Languages[language]} aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newNewsletter.title) && !R.isNil(newNewsletter.title[language]) ? newNewsletter.title[language] : ''} onChange={(event) => {
                                            let newTitle = JSON.parse(JSON.stringify(newNewsletter.title));
                                            newTitle[language] = event.target.value;
                                            setNewNewsletter({ ...newNewsletter, title: newTitle });
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a title.
                                    </Form.Control.Feedback>
                                </InputGroup>

                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                <span className="input-group-text">Author</span>
                                    <FormControl required={!createnewNewsletter} placeholder={'Newsletter author in ' + Languages[language]} aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newNewsletter.author) && !R.isNil(newNewsletter.author[language]) ? newNewsletter.author[language] : ''} onChange={(event) => {
                                            let newAuthor = JSON.parse(JSON.stringify(newNewsletter.author));
                                            newAuthor[language] = event.target.value;
                                            setNewNewsletter({ ...newNewsletter, author: newAuthor });
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide who is the author.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Tab>;
                        })}
                    </Tabs>
                </Form>
            </Modal.Body>

            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button variant="success" className={newsletter.loadings.includes('ADD_UPDATE_NEWSLETTER') ? "progress-bar-striped progress-bar-animated": ''} disabled={newsletter.loadings.includes('ADD_UPDATE_NEWSLETTER')} onClick={(event) => {
                    handleSubmit(event);
                    if (createnewNewsletter === true) {
                        dispatcher(() => dispatch(saveNewsletter({
                            name: newNewsletter.title,
                            author: newNewsletter.author
                        })));
                    }
                }}>
                    Create
                </Button>
                <Button variant="secondary" onClick={beforeClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}