import React, {useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Form, FormControl, Image, InputGroup, Modal, Tab, Tabs } from 'react-bootstrap';
import { saveArticle } from '../../actions/articles';
import { Languages } from '../../consts/mappers/languages';

export  const ArticleModal = ({ show, handleClose, availableLanguages, dispatcher }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);
    const [newArticle, setNewArticle] = useState({
        author: {},
        imgUrl: {},
        imgDescription: {},
        title: {},
        description: {},
        tags: {}
    });

    const beforeClose = () => {
        handleClose();
        setTimeout(() => {
            setNewArticle({
                author: {},
                imgUrl: {},
                imgDescription: {},
                title: {},
                description: {},
                tags: {}
            });
            setValidated(false);
        }, 10);
    }

    useEffect(() => {
        beforeClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.items.length]);

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

    let createnewArticle = availableLanguages.filter(t => !R.isNil(newArticle.title[t]) && newArticle.title[t] !== '').length > 0;

    return (
        <Modal show={show} onHide={beforeClose}>
            <Modal.Header className={settings.darkmode ? 'dark-mode': ''}>
                <Modal.Title>Create new Article</Modal.Title>
            </Modal.Header>

            <Modal.Body className={settings.darkmode ? 'dark-mode': ''}>
                <Form validated={validated} ref={formRef}>
                    <Tabs id="language-tabs" className={settings.darkmode ? 'dark-mode-tabs': ''}>
                        {availableLanguages.map((language, index) => {
                            return <Tab key={index} title={Languages[language]} eventKey={language}>
                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                <span className="input-group-text">Title</span>
                                    <FormControl required={!createnewArticle} placeholder={'Article title in ' + Languages[language]} aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newArticle.title) && !R.isNil(newArticle.title[language]) ? newArticle.title[language] : ''} onChange={(event) => {
                                            let newTitle = JSON.parse(JSON.stringify(newArticle.title));
                                            newTitle[language] = event.target.value;
                                            setNewArticle({ ...newArticle, title: newTitle });
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a title.
                                    </Form.Control.Feedback>
                                </InputGroup>

                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                    <span className="input-group-text">Description</span>
                                    <FormControl placeholder={'Article description in ' + Languages[language]} aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newArticle.description) && !R.isNil(newArticle.description[language]) ? newArticle.description[language] : ''} onChange={(event) => {
                                            let newDescription = JSON.parse(JSON.stringify(newArticle.description));
                                            newDescription[language] = event.target.value;
                                            setNewArticle({ ...newArticle, description: newDescription });
                                        }} />
                                </InputGroup>

                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                    <span className="input-group-text">Tags</span>
                                    <FormControl placeholder={'Article tags ' + Languages[language] + ' separeted by \';\''} aria-label="tags" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newArticle.tags) && !R.isNil(newArticle.tags[language]) ? newArticle.tags[language] : ''} onChange={(event) => {
                                            let newTags = JSON.parse(JSON.stringify(newArticle.tags));
                                            newTags[language] = event.target.value;
                                            setNewArticle({ ...newArticle, tags: newTags });
                                        }} />
                                </InputGroup>

                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                <span className="input-group-text">Author</span>
                                    <FormControl required={!createnewArticle} placeholder={'Article author in ' + Languages[language]} aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newArticle.author) && !R.isNil(newArticle.author[language]) ? newArticle.author[language] : ''} onChange={(event) => {
                                            let newAuthor = JSON.parse(JSON.stringify(newArticle.author));
                                            newAuthor[language] = event.target.value;
                                            setNewArticle({ ...newArticle, author: newAuthor });
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide who is the author.
                                    </Form.Control.Feedback>
                                </InputGroup>

                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                    <span className="input-group-text">Image URL</span>
                                    <FormControl placeholder='This image will apear alongside title and description in the preview window' aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                        value={!R.isNil(newArticle.imgUrl) && !R.isNil(newArticle.imgUrl[language]) ? newArticle.imgUrl[language]: ''} onChange={(event) => {
                                            let newImageUrl= JSON.parse(JSON.stringify(newArticle.imgUrl));
                                            newImageUrl[language] = event.target.value;
                                            setNewArticle({ ...newArticle, imgUrl: newImageUrl });
                                        }} />
                                </InputGroup>
                                {
                                    !R.isNil(newArticle.imgUrl) && !R.isNil(newArticle.imgUrl[language]) && newArticle.imgUrl[language] !== '' ?
                                        <div className='text-center'>
                                            <Image src={newArticle.imgUrl[language]} thumbnail style={{ width: '100px', height: '100px' }} />
                                        </div> : ''
                                }
                                {
                                    !R.isNil(newArticle.imgUrl[language]) && newArticle.imgUrl[language] !== '' ?
                                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode': ''}`}>
                                            <span className="input-group-text">Image description</span>
                                            <FormControl placeholder='Image description. Also appear as "alt" text' aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                                value={!R.isNil(newArticle.imgDescription) && !R.isNil(newArticle.imgDescription[language]) ? newArticle.imgDescription[language] : ''} onChange={(event) => {
                                                    let newImageUrl = JSON.parse(JSON.stringify(newArticle.imgDescription));
                                                    newImageUrl[language] = event.target.value;
                                                    setNewArticle({ ...newArticle, imgDescription: newImageUrl });
                                                }} />
                                        </InputGroup>
                                        : ''
                                }
                            </Tab>;
                        })}
                    </Tabs>
                </Form>
            </Modal.Body>

            <Modal.Footer className={settings.darkmode ? 'dark-mode': ''}>
                <Button variant="success" className={articles.loadings.includes('ADD_UPDATE_ARTICLE') ? "progress-bar-striped progress-bar-animated": ''} disabled={articles.loadings.includes('ADD_UPDATE_ARTICLE')} onClick={(event) => {
                    handleSubmit(event);
                    if (createnewArticle === true) {
                        const tempTags = availableLanguages.reduce(function(result, langKey) {
                            result[langKey] = !R.isNil(newArticle.tags[langKey]) ? newArticle.tags[langKey].split(';').map(t => t.trim()).filter(t => t !== '') : []
                            return result
                          }, {});
                        dispatcher(() => dispatch(saveArticle({
                            name: newArticle.title,
                            author: newArticle.author,
                            description: newArticle.description,
                            imageUrl: newArticle.imgUrl,
                            imageDescription: newArticle.imgDescription,
                            tags: tempTags
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