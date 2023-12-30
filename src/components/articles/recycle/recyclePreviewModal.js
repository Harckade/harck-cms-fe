import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FormControl, InputGroup, Image } from 'react-bootstrap';
import { Loading } from '../../common/loading';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import * as R from 'ramda';

export const RecyclePreviewModal = ({ show, handleClose, deletedArticle, currentLang }) => {
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);

    return (
        <Offcanvas show={show} onHide={handleClose} placement={'bottom'} className={'preview-history ' + (settings.darkmode ? 'dark-mode' : '')}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Preview</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

                {R.isNil(deletedArticle) || R.isNil(articles) || articles.loadings.includes(`FETCH_ARTICLE_CONTENT_${currentLang.toUpperCase()}`) ? <Loading /> :
                    <>

                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Title</span>
                            <FormControl placeholder='No title was provided' aria-label="title" aria-describedby="inputGroup-sizing-sm" value={!R.isNil(deletedArticle.name[currentLang]) ? deletedArticle.name[currentLang]: ''} disabled={true} />
                        </InputGroup>
                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Description</span>
                            <FormControl placeholder='No description was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" value={!R.isNil(deletedArticle.description[currentLang]) ? deletedArticle.description[currentLang]: ''} disabled={true} />
                        </InputGroup>
                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Tags</span>
                            <FormControl placeholder={'No tag was provided'} aria-label="tags" aria-describedby="inputGroup-sizing-sm" value={!R.isNil(deletedArticle.tags[currentLang]) ? deletedArticle.tags[currentLang]: ''} disabled={true} />
                        </InputGroup>

                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Author</span>
                            <FormControl placeholder='No author was provided' aria-label="author" aria-describedby="inputGroup-sizing-sm" value={!R.isNil(deletedArticle.author[currentLang]) ? deletedArticle.author[currentLang]: ''} disabled={true} />
                        </InputGroup>

                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Image URL</span>
                            <FormControl placeholder='No image URL was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" defaultValue={!R.isNil(deletedArticle.imageUrl[currentLang]) ? deletedArticle.imageUrl[currentLang]: ''} disabled={true} />
                            {!R.isNil(deletedArticle.imageUrl[currentLang]) && deletedArticle.imageUrl[currentLang] !== '' ? <span style={{ cursor: 'pointer' }}><Image src={deletedArticle.imageUrl[currentLang]} alt="article image" thumbnail style={{ width: '38px', height: '38px' }} /></span> : ''}
                        </InputGroup>

                        {
                            !R.isNil(deletedArticle.imageUrl[currentLang]) && deletedArticle.imageUrl[currentLang] !== '' ?
                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                    <span className="input-group-text">Image description</span>
                                    <FormControl placeholder='No image description was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" defaultValue={deletedArticle.imageDescription[currentLang]} disabled={true} />
                                </InputGroup>
                                : ''
                        }
                        {
                            R.isNil(articles) || R.isNil(articles.htmlContent[currentLang]) || articles.loadings.includes('FETCH_ARTICLE_CONTENT') ? <Loading /> :
                                R.isNil(articles.htmlContent[currentLang]) || articles.htmlContent[currentLang] === '' ? <i>Empty content</i> :
                                    <div data-color-mode={settings.darkmode ? "dark" : "light"} >
                                        <MDEditor.Markdown className={(settings.darkmode ? 'input-dark-mode' : '')}
                                            source={articles.htmlContent[currentLang]}
                                            rehypePlugins={[[rehypeSanitize({ attributes: ['video'] })]]}
                                        />
                                    </div>
                        }
                    </>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
}