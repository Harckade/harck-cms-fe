import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import { downloadFile, downloadZip } from '../../actions/files';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Button, Col, Container, Row, InputGroup, FormControl, Breadcrumb } from 'react-bootstrap';
import {FiFolderPlus, FiUpload, FiTrash2, FiDownload} from 'react-icons/fi';
import {VscFileSymlinkDirectory} from 'react-icons/vsc';
import { MultiSelect } from "react-multi-select-component";
import { Overlay } from '../common/overlay';

export const Toolbar=({navigateToFolder, selectedFiles, handleShowFolder, handleShowDelete, handleShowUpload, setFilters, filters, setSearchFilter, dispatcher, entries, filterOptions})=>{
    const dispatch = useDispatch();
    const files = useSelector(state => state.files);
    const settings = useSelector(state => state.settings);
    const ovverrides = {
        "selectSomeItems": "Filter by...",
        "allItemsAreSelected": "All types are selected"
      };

    return(
        <Container fluid className={`files-toolbar ${settings.darkmode ? 'dark-mode': ''}`}>
            <Row >
                <Col xs="6">
                    {settings.user.isViewer ? '': <><Overlay text='Upload' component={<Button id="upload-file" size="sm" variant='outline-success' disabled={files.loadings.includes('UPLOAD_FILES')} onClick={() => handleShowUpload()}><FiUpload /></Button>} />{' '}</>}
                    {settings.user.isViewer ? '': <><Overlay text='New folder' component={<Button size="sm" id="add-new-folder" variant='outline-primary' onClick={() => handleShowFolder()}><FiFolderPlus /></Button>} />{' '}</>}
                    {settings.user.isViewer ? '': <> <Overlay text='Delete' component={<Button id="delete-file" size="sm" variant={selectedFiles.length === 0 ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') : 'outline-danger'} disabled={selectedFiles.length === 0} onClick={() => handleShowDelete()}><FiTrash2 /></Button>} />{' '}</>}
                    <Overlay text={`Download${(selectedFiles.length > 1 || (selectedFiles.length === 1 && !R.isNil(entries.find(e => selectedFiles[0] === e.id)) &&  entries.find(e => selectedFiles[0] === e.id).fileType === 'folder') ? ' as zip' : '')}`} component={
                        <Button size="sm" variant={selectedFiles.length === 0 ? (settings.darkmode ? 'outline-secondary' : 'outline-dark') :  (settings.darkmode ? 'outline-light' : 'outline-dark')} disabled={selectedFiles.length === 0} onClick={() => {
                            if (selectedFiles.length > 1) {
                                dispatcher(() => dispatch(downloadZip(selectedFiles)));
                            }
                            else {
                                let entryToDownload = entries.find(e => selectedFiles.includes(e.id));
                                if (!R.isNil(entryToDownload)) {
                                    dispatcher(() => dispatch(downloadFile(entryToDownload)));
                                }
                            }
                        }}><FiDownload /></Button>}
                    />
                </Col>
                <Col xs="3" md={{ span: 2, offset: 2 }}>
                    <MultiSelect
                        options={filterOptions}
                        value={filters}
                        onChange={(val) => setFilters(val)}
                        labelledBy="Filter by"
                        hasSelectAll={true}
                        overrideStrings={ovverrides}
                        className={settings.darkmode ? 'input-dark-mode': ''}
                    />
                </Col>
                <Col xs="3" md="2">
                    <InputGroup className={settings.darkmode ? 'input-dark-mode': ''}>
                        <FormControl id="search-bar" placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Breadcrumb className="toolbar-path">
                        <span><VscFileSymlinkDirectory /> </span>
                        <Breadcrumb.Item active={R.isNil(files.path) || files.path.length === 0}  onClick={() => {navigateToFolder('', null)}}>home</Breadcrumb.Item>
                        {!R.isNil(files.path) && files.path.length > 0 ? files.path.map((p, index) => {
                            let currentPath = files.path.slice(0, index);
                            return <Breadcrumb.Item aria-disabled={index === files.path.length - 1} key={'path-'+index} active={index === files.path.length - 1} onClick={() => {
                                if (index !== files.path.length - 1){
                                    navigateToFolder(p, currentPath)
                                }
                            }}>{p}</Breadcrumb.Item>
                        }) : ''}
                    </Breadcrumb>
                </Col>
                <Col xs="4" md={{ span: 2, offset:2 }} className="text-end">
                    {!R.isNil(selectedFiles) && selectedFiles.length > 0 ? `${selectedFiles.length} items selected` : ''}
                </Col>
            </Row>
        </Container>
    );
}