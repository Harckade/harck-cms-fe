import React, { useEffect, useState } from 'react';
import { downloadFile, stopForcedUpdate } from '../../actions/files';
import * as R from 'ramda';
import { Col, Container, Row } from 'react-bootstrap';
import { FiCopy } from 'react-icons/fi';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { FileIcon } from './fileIcon';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../common/loading';

export const FilesTable = ({ selectedFiles, setSelectedFiles, entriesToDisplay, entries, setEntries, dispatcher, setSelectedFile, handleShowPreview, navigateToFolder }) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const files = useSelector(state => state.files);
    const sortOptions = { name: 'name', date: "date", size: "size", url: "url" };
    const [invertSort, setInvertSort] = useState(true);
    const [sortBy, setSortBy] = useState(sortOptions.date);
    //https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    function niceBytes(a) { let b = 0, c = parseInt(a, 10) || 0; for (; 1024 <= c && ++b;)c /= 1024; return c.toFixed(10 > c && 0 < b ? 1 : 0) + " " + ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][b] }

    const handleSelectFile = (item) => {
        if (selectedFiles.includes(item.id)) {
            setSelectedFiles(JSON.parse(JSON.stringify(selectedFiles.filter(i => i !== item.id))));
        }
        else {
            let tmpFiles = JSON.parse(JSON.stringify(selectedFiles));
            tmpFiles.push(item.id);
            setSelectedFiles(tmpFiles);
        }
    }

    const toastUrlCopied = (url) => toast.dark(`✔️ Url copied: ${url}`, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    const toastUrlCopiedError = () => toast.error('😭 Automatic copy failed. Please copy the url manually', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const copyUrl = async (url) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(url);
        } else {
            return document.execCommand('copy', true, url);
        }
    };

    const sortByProp = (property) => {
        let tmpFiles = JSON.parse(JSON.stringify(files.items));
        const tmpSort = Object.prototype.toString.call(tmpFiles[0][property]) === "[object String]" ? R.sortBy(R.compose(R.toLower, R.prop(property))) : R.sortBy(R.prop(property));
        tmpFiles = tmpSort(tmpFiles);
        if (invertSort) {
            tmpFiles = R.reverse(tmpFiles);
        }
        setEntries(tmpFiles);
    };

    const sortDocuments = () => {
        if (!R.isNil(files) && files.items.length > 0) {
            sortByProp(sortBy);
        }
        else{
            setEntries([]);
        }
    };

    const openFolder = (item) => {
        if (item.fileType === 'image' || item.fileType === 'video' || item.fileType === 'audio' || item.fileType === 'pdf') {
            setSelectedFile(item);
            handleShowPreview();
        }
        else if (item.fileType === 'folder') {
            navigateToFolder(item.name, files.path);
        }
        else {
            dispatcher(() => dispatch(downloadFile(item)));
        }
    }

    useEffect(() => {
        if (files.items !== []) {
            sortDocuments();
        }
        else{
            setEntries([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.items.length]);

    useEffect(() => {
        if (files.items !== []) {
            sortDocuments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, invertSort]);

    useEffect(() => {
        if (files.forceUpdate === true){
            if (files.items !== []) {
                sortDocuments();
            }else{
                setEntries([]);
            }
            dispatch(stopForcedUpdate());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.forceUpdate]);

    if (files.loadings.includes('FETCH_FILES'))
        return <Loading />

    return (
        entriesToDisplay.length > 0 ?
            <div className="table-responsive files-table">
                <table id='files-table' className={`align-middle table table-bordered table-hover ${settings.darkmode? ' table-dark': ''}`}>
                    <thead className="sticky-table-header">
                        <tr>
                            <th className="text-center" onClick={() => {
                                if (!R.isNil(entriesToDisplay) && selectedFiles.length !== 0 && selectedFiles.length === entriesToDisplay.length) {
                                    setSelectedFiles([]);
                                }
                                else {
                                    setSelectedFiles(entriesToDisplay.map(e => e.id));
                                }
                            }}>
                                <input type="checkbox" id="selectAllFiles" name="select all files" value="select all files" checked={selectedFiles.length !== 0 && selectedFiles.length === entriesToDisplay.length} onChange={() => { }} />
                            </th>
                            {
                                Object.keys(sortOptions).map((op, index) => {
                                    return (
                                        <th className={'text-start col'} key={'header-' + index} onClick={() => {
                                            if (sortBy === sortOptions[op]) {
                                                setInvertSort(!invertSort);
                                            }
                                            else {
                                                setInvertSort(false);
                                            }
                                            setSortBy(sortOptions[op]);
                                        }}>
                                            <Container>
                                                <Row>
                                                    <Col className="text-start">
                                                        {sortOptions[op]}
                                                    </Col>
                                                    <Col className="text-end">
                                                        {sortBy === sortOptions[op] ? invertSort ? <TiArrowSortedDown /> : <TiArrowSortedUp /> : ' '}
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            entriesToDisplay.map((item, index) => {
                                return (
                                    <tr key={'entry-' + index} className={selectedFiles.includes(item.id) ? "selected-row" : ""} onClick={() => handleSelectFile(item)} onKeyUp={(event) => { 
                                        if (event.code === 'Enter'){
                                            openFolder(item);
                                        }
                                    }} onDoubleClick={() => {openFolder(item)}}>
                                        <td className='text-center align-middle' style={{ maxWidth: '15px' }} onClick={() => {}}>
                                            <input type="checkbox" id="selectAllFiles" name="select all files" value="selected all files" checked={selectedFiles.includes(item.id)} onChange={() => { }} />
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "101px", maxWidth: '600px', cursor: 'pointer' }}>
                                            <FileIcon file={item} />
                                            {` ${item.name}`}
                                        </td>

                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "101px", maxWidth: '130px' }}>
                                            {item.date}
                                        </td>

                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "101px", maxWidth: '200px' }}>
                                            {item.fileType === 'folder' ? '' : niceBytes(item.size)}
                                        </td>
                                        <td className='text-start text-truncate align-middle' style={{ minWidth: "101px", maxWidth: '350px' }}>
                                            <FiCopy onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                await copyUrl(item.url)
                                                    .then(() => toastUrlCopied(item.url))
                                                    .catch(() => toastUrlCopiedError());
                                            }} style={{ cursor: 'pointer' }} /> <a onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.open(item.url, "#");
                                            }} target="#" href={item.url}>{item.url}</a>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div> : <div className='text-center'>{entries.length === 0 ? 'This folder is empty' : 'No files were found under selected filters or search query'}</div>
    )
}