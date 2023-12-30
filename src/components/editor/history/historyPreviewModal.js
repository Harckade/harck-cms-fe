import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FormControl, InputGroup, Image } from 'react-bootstrap';
import { Loading } from '../../common/loading';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import * as R from 'ramda';

export const HistoryPreviewModal = ({ show, handleClose, backup }) => {
    const settings = useSelector(state => state.settings);
    const articles = useSelector(state => state.articles);

    return (
        <Offcanvas show={show} onHide={handleClose} placement={'bottom'} className={'preview-history ' + (settings.darkmode ? 'dark-mode' : '')}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Preview</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {R.isNil(backup) || R.isNil(articles) || articles.loadings.includes(`FETCH_ARTICLE_BACKUP_${backup.id.toUpperCase()}_${backup.language.toUpperCase()}`) ? <Loading /> :
                    <>
                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Title</span>
                            <FormControl placeholder='No title was provided' aria-label="title" aria-describedby="inputGroup-sizing-sm" value={backup.name} disabled={true} />
                        </InputGroup>
                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Description</span>
                            <FormControl placeholder='No description was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" value={backup.description} disabled={true} />
                        </InputGroup>
                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Tags</span>
                            <FormControl placeholder={'No tag was provided'} aria-label="tags" aria-describedby="inputGroup-sizing-sm" value={backup.tags} disabled={true} />
                        </InputGroup>

                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Author</span>
                            <FormControl placeholder='No author was provided' aria-label="author" aria-describedby="inputGroup-sizing-sm" value={backup.author} disabled={true} />
                        </InputGroup>

                        <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                            <span className="input-group-text">Image URL</span>
                            <FormControl placeholder='No image URL was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" defaultValue={backup.imgUrl} disabled={true} />
                            {!R.isNil(backup.imgUrl) && backup.imgUrl !== '' ? <span style={{ cursor: 'pointer' }}><Image src={backup.imgUrl} alt="article image" thumbnail style={{ width: '38px', height: '38px' }} /></span> : ''}
                        </InputGroup>

                        {
                            !R.isNil(backup.imgUrl) && backup.imgUrl !== '' ?
                                <InputGroup size="sm" className={`mb-3 ${settings.darkmode ? 'input-dark-mode' : ''}`}>
                                    <span className="input-group-text">Image description</span>
                                    <FormControl placeholder='No image description was provided' aria-label="description" aria-describedby="inputGroup-sizing-sm" defaultValue={backup.imgDescription} disabled={true} />
                                </InputGroup>
                                : ''
                        }
                    </>
                }
                {
                    R.isNil(articles) || R.isNil(articles.backupContent) || articles.loadings.includes('FETCH_ARTICLE_BACKUP_CONTENT') ? <Loading /> :
                        articles.backupContent === '' ? <i>Empty content</i> :
                            <div data-color-mode={settings.darkmode ? "dark" : "light"} >
                                <MDEditor.Markdown
                                    source={articles.backupContent}
                                    rehypePlugins={[[rehypeSanitize({ attributes: ['video'] })]]}
                                />
                            </div>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
}