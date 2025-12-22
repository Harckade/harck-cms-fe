import React, { useEffect, useRef, useState } from 'react';
import { HtmlEditor } from './htmlEditor';
import * as R from 'ramda';
import { FormControl, InputGroup, Image, Breadcrumb, Button, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import { saveArticle, getArticleById, selectDocument, getArticleContentById, getArticleBackupContent } from '../../actions/articles';
import {sendSignalRMessage} from '../../actions/settings';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ImagePreviewModal } from './imagePreviewModal';
import { HistoryBar } from './history';
import { Languages } from '../../consts/mappers/languages';
import { FiSave, FiEyeOff } from 'react-icons/fi';
import { MdOutlineHistory } from 'react-icons/md';
import { Loading } from '../common/loading';
import { PublishModal } from './publishModal';
import { Overlay } from '../common/overlay';
import { HistoryPreviewModal } from './history/historyPreviewModal';
import { RestoreModal } from './history/restoreModal';
import { v4 as uuidv4 } from 'uuid';

export const ContentEditor = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const articles = useSelector(state => state.articles);
    const settings = useSelector(state => state.settings);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [currentLang, setCurrentLang] = useState(undefined);
    const [infoChanged, setInfoChanged] = useState(false);
    const [title, setTitle] = useState({});
    const [author, setAuthor] = useState({});
    const [description, setDescription] = useState({});
    const [tags, setTags] = useState({});
    const [content, setContent] = useState({});
    const [imgUrl, setImgUrl] = useState({});
    const [imgDescription, setImgDescription] = useState({});
    const [articleId, setArticleId] = useState(undefined);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const handleShowImagePreviewModal = () => setShowImagePreviewModal(true);
    const handleCloseImagePreviewModal = () => setShowImagePreviewModal(false);
    const editorReference = [useRef(null), useRef(null), useRef(null)];

    const [showPublishModal, setShowPublishyModal] = useState(false);
    const handleClosePublishModal = () => setShowPublishyModal(false);
    const handleShowPublishModal = () => setShowPublishyModal(true);

    const [showHistory, setShowHistory] = useState(false);
    const handleCloseHistory = () => setShowHistory(false);
    const handleShowHistory = () => setShowHistory(true);

    const [showHistoryPreview, setShowHistoryPreview] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(undefined);
    const handleCloseHistoryPreview = () => {
        setShowHistoryPreview(false)
        setSelectedBackup(undefined);
    };
    const handleShowHistoryPreview = (backup) => {
        setShowHistoryPreview(true)
        setSelectedBackup(backup);
        dispatcher(() => dispatch(getArticleBackupContent(backup.id, backup.language, backup.modificationDate)));
    };

    const [showRestore, setShowRestore] = useState(false);
    const handleCloseRestore = () => setShowRestore(false);
    const handleShowRestore = () => setShowRestore(true);

    const isLoadingContent = () => {
        return availableLanguages.length > 0 || availableLanguages.filter(langKey => articles.htmlContentLoaded[langKey] === true).length === availableLanguages.length ? false : true;
    };

    const canSave = (lang) => { return !settings.user.isViewer && isLoadingContent() === false && (infoChanged === true || JSON.stringify(content[lang]) !== JSON.stringify(articles.htmlContent[lang])) };

    const saveDoc = (lang) => {
        
        let tmpTags = availableLanguages.reduce(function (result, langKey) {
            result[langKey] = !R.isNil(tags[langKey]) && tags[langKey] !== '' && tags[langKey].length > 0 ? tags[langKey].split(';').map(t => t.trim()).filter(t => t !== '') : []
            return result
        }, {});

        if (canSave(lang)) {
            let articleToSave = {
                Name: { [lang]: title[lang] },
                Author: { [lang]: author[lang] },
                Description: { [lang]: description[lang] },
                HtmlContent: { [lang]: content[lang] },
                ImageUrl: { [lang]: imgUrl[lang] },
                ImageDescription: { [lang]: imgDescription[lang] },
                Tags: { [lang]: tmpTags[lang] }
            };
            if (!R.isNil(articleId)) {
                articleToSave.Id = articleId;
            }
            dispatcher(() => dispatch(saveArticle(articleToSave, lang)));

            dispatcher(() => dispatch(sendSignalRMessage({
                action: "save",
                page: "articles",
                payload: {
                    id: articleToSave.Id
                },
                randomId: uuidv4()
            })));
        }
    };

    const handleKeyDown = (event) => {
        if (event.code === 'KeyS' && event.ctrlKey === true) {
            event.preventDefault();
            saveDoc(currentLang);
        }
    }

    useEffect(() => {
        setAvailableLanguages(settings.options.languages);
    }, [settings.options]);

    useEffect(() => {
        if (availableLanguages.length > 0) {
            if (articles.items.filter(i => i.id === id).length === 0) {
                dispatcher(() => dispatch(getArticleById(id)));
            }
            setArticleId(id);
            if (R.isNil(currentLang) && !R.isNil(availableLanguages) && currentLang !== availableLanguages[0]) {
                setCurrentLang(availableLanguages.length > 0 ? availableLanguages[0] : currentLang);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLanguages]);


    
    useEffect(() => {
        setTimeout(() => {
            if ((R.isNil(articles.currentArticle) && !R.isNil(id) && articles.items.length > 0) || (!R.isNil(articles.currentArticle) && articleId !== id)) {
                if (articles.articleIdContent !== id) {
                    dispatcher(() => dispatch(selectDocument(id)));
                }
            }
        }, 50)
    });

    useEffect(() => {
        if (!R.isNil(articles.currentArticle) && !R.isNil(articleId)) {
            if (articles.articleIdContent === undefined) {
                availableLanguages.forEach((langKey) => { dispatcher(() => dispatch(getArticleContentById(articles.currentArticle.id, langKey))); });
            }
        }

        function reduceByProp(propery) {
            return availableLanguages.reduce(function (result, langKey) {
                result[langKey] = !R.isNil(articles.currentArticle[propery][langKey]) ? articles.currentArticle[propery][langKey] : ''
                return result
            }, {});
        }

        if (!R.isNil(articles.currentArticle)) {
            setArticleId(articles.currentArticle.id);
            setDescription(reduceByProp('description'));
            setTitle(reduceByProp('name'));
            setAuthor(reduceByProp('author'));
            setImgUrl(reduceByProp('imageUrl'));
            setImgDescription(reduceByProp('imageDescription'));

            setTags(availableLanguages.reduce(function (result, langKey) {
                result[langKey] = !R.isNil(articles.currentArticle.tags[langKey]) && articles.currentArticle.tags[langKey].length > 0 ? articles.currentArticle.tags[langKey].join('; ') : ''
                return result
            }, {}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.currentArticle]);

    useEffect(() => {
        if (articles.articleIdContent !== undefined && articles.articleIdContent === id && isLoadingContent() === false) {
            setContent(articles.htmlContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.articleIdContent, articles.htmlContent, articles.htmlContent[currentLang]]);

    useEffect(() => {
        if (articles.restoreSuccess === true) {
            handleCloseRestore();
            handleCloseHistoryPreview();
            handleCloseHistory();
            setContent({ ...articles.htmlContent, [currentLang]: articles.htmlContent[currentLang] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles.restoreSuccess]);

    return (
        <div className="Blog" onKeyDown={handleKeyDown}>
            <h4 className="text-center">
                Article Editor
            </h4>

            <Container fluid>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Link className={`breadcrumb-item ${settings.darkmode ? 'breadcrumb-item-dark' : ''}`} to="/articles">Articles</Link>
                            <Breadcrumb.Item active>{articleId}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    {
                        settings.user.isViewer ? '' :
                            <Col>
                                <section id="toolbar" aria-label="toolbar" className="text-end">{' '}
                                    <Overlay text="Save Ctrl+S" component={
                                        <Button id='save-article' size="sm" variant={settings.darkmode ? "outline-light" : "outline-dark"} disabled={R.isNil(articles.currentArticle)} onClick={() => {
                                            saveDoc(currentLang);
                                        }}><FiSave size={20} />
                                        </Button>}
                                    />{' '}
                                    <Overlay text={!R.isNil(articles.currentArticle) && articles.currentArticle.published === true ? 'Unpublish' : 'Publish'} component={
                                        <Button id='publish-unpublish-article' size="sm" variant={!R.isNil(articles.currentArticle) && articles.currentArticle.published === true ? "outline-danger" : "outline-primary"} className="align-middle"
                                            disabled={R.isNil(articles.currentArticle) || articles.loadings.includes(`SET_DOCUMENT_PUBLISH_${articleId}`) ? true : false} onClick={(event) => {
                                                event.preventDefault();
                                                handleShowPublishModal();
                                            }}><FiEyeOff />
                                        </Button>}
                                    />{' '}
                                    <Overlay text='History' component={
                                        <Button id='articles-history' size="sm" variant={"outline-secondary"} className="align-middle" onClick={(event) => {
                                            event.preventDefault();
                                            handleShowHistory();
                                        }}><MdOutlineHistory size={15} />
                                        </Button>}
                                    />
                                </section>
                            </Col>
                    }
                </Row>
            </Container>

            {R.isNil(articles.currentArticle) || isLoadingContent() ? <Loading /> :
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
                                <FormControl placeholder='Article title' aria-label="title" aria-describedby="inputGroup-sizing-sm"
                                    value={title[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                        let newTitle = structuredClone(title);
                                        newTitle[langKey] = event.target.value;
                                        setTitle(newTitle);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>
                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Description</span>
                                <FormControl placeholder='Article description' aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                    value={description[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                        let newDesc = structuredClone(description);
                                        newDesc[langKey] = event.target.value;
                                        setDescription(newDesc);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>

                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Tags</span>
                                <FormControl placeholder={'Article tags separeted by \';\''} aria-label="tags" aria-describedby="inputGroup-sizing-sm"
                                    value={tags[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                        let newTags = structuredClone(tags);
                                        newTags[langKey] = event.target.value;
                                        setTags(newTags);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>

                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Author</span>
                                <FormControl placeholder='Article author' aria-label="author" aria-describedby="inputGroup-sizing-sm"
                                    value={author[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                        let newAuthor = structuredClone(author);
                                        newAuthor[langKey] = event.target.value;
                                        setAuthor(newAuthor);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                            </InputGroup>

                            <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                <span className="input-group-text">Image URL</span>
                                <FormControl placeholder='This image will apear alongside title and description in the preview window' aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                    defaultValue={imgUrl[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                        let newImgUrls = structuredClone(imgUrl);
                                        newImgUrls[langKey] = event.target.value;
                                        setImgUrl(newImgUrls);
                                        if (infoChanged === false) {
                                            setInfoChanged(true);
                                        }
                                    }} />
                                {!R.isNil(imgUrl[langKey]) && imgUrl[langKey] !== '' ? <span style={{ cursor: 'pointer' }}><Image src={imgUrl[langKey]} alt="article image" thumbnail style={{ width: '38px', height: '38px' }} onClick={() => { handleShowImagePreviewModal(); }} /></span> : ''}
                            </InputGroup>

                            {
                                !R.isNil(imgUrl[langKey]) && imgUrl[langKey] !== '' ?
                                    <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                        <span className="input-group-text">Image description</span>
                                        <FormControl placeholder='Image description. Will appear at description and "alt" text' aria-label="description" aria-describedby="inputGroup-sizing-sm"
                                            defaultValue={imgDescription[langKey]} disabled={settings.user.isViewer} onChange={(event) => {
                                                let newImgDescription = structuredClone(imgDescription);
                                                newImgDescription[langKey] = event.target.value;
                                                setImgDescription(newImgDescription);
                                                if (infoChanged === false) {
                                                    setInfoChanged(true);
                                                }
                                            }} />
                                    </InputGroup>
                                    : ''
                            }
                            {
                                articles.htmlContentLoaded[langKey] === false ? <Loading /> :
                                    <React.Fragment>
                                        <div ref={editorReference[index]}>
                                            <HtmlEditor defaultContents={content[langKey]} updateContent={(contents) => setContent({ ...content, [langKey]: contents })} disabled={settings.user.isViewer} />
                                        </div>
                                    </React.Fragment>
                            }
                        </Tab>;
                    })}
                </Tabs>
            }
            <ImagePreviewModal show={showImagePreviewModal} handleClose={handleCloseImagePreviewModal} url={imgUrl[currentLang]} />

            {settings.user.isViewer ? '' :
                <>
                    <PublishModal show={showPublishModal} handleClose={handleClosePublishModal} dispatcher={dispatcher} articleId={articleId} />
                    <HistoryPreviewModal show={showHistoryPreview} handleClose={handleCloseHistoryPreview} backup={selectedBackup} />
                    <HistoryBar show={showHistory} handleClose={handleCloseHistory} handleShowRestore={handleShowRestore} availableLanguages={availableLanguages} handleCloseHistoryPreview={handleCloseHistoryPreview} handleShowHistoryPreview={handleShowHistoryPreview} dispatcher={dispatcher} articleId={articleId} currentLang={currentLang} selectedBackup={selectedBackup} />
                    <RestoreModal dispatcher={dispatcher} show={showRestore} handleClose={handleCloseRestore} backup={selectedBackup} />
                </>
            }

        </div>
    );
}