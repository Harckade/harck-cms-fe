import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import { getAllBinaries } from '../../actions/files';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { DeleteModal } from './deleteModal';
import { PreviewModal } from './previewModal';
import { UploadModal } from './uploadModal';
import { FolderModal } from './folderModal';
import * as diacritics from 'diacritics';
import { Toolbar } from './toolbar';
import { FilesTable } from './filesTable';
import { useNavigate } from 'react-router';
import { Loading } from '../common/loading';

export const Files = ({ dispatcher }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const files = useSelector(state => state.files);
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const filterOptions = [
        { value: 'folder', label: 'Folders'},
        { value: 'image', label: 'Images' },
        { value: 'video', label: 'Videos' },
        { value: 'audio', label: 'Audio' },
        { value: 'pdf', label: 'PDF'},
        { value: 'binary', label: 'Other' },
    ];
    const [filters, setFilters] = useState(filterOptions);
    const [entries, setEntries] = useState([]);

    const [showUpload, setShowUpload] = useState(false);
    const handleCloseUpload = () => setShowUpload(false);
    const handleShowUpload = () => setShowUpload(true);

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [showPreview, setShowPreview] = useState(false);
    const handleShowPreview = () => setShowPreview(true);
    const handleClosePreview = () => setShowPreview(false);

    const [showFolder, setShowFolder] = useState(false);
    const handleShowFolder = () => setShowFolder(true);
    const handleCloseFolder = () => setShowFolder(false);

    const [searchFilter, setSearchFilter] = useState('');

    const loadBinaries = () => {
        let path = window.location.hash.substring(8);
        dispatcher(() => dispatch(getAllBinaries(!R.isNil(path) && path.length > 0 ? path: '')));
    }

    const navigateToFolder = (folder, path) => {
        let localPath = window.location.hash.substring(8);

        if (!R.isNil(path) || (R.isNil(path) && localPath !== '')){
            setSelectedFiles([]);
            setEntries([]);
            setFilters(filterOptions);
            navigate(`${!R.isNil(path) && path.length > 0 ? path.join('/') + '/' : ''}${folder}`);
        }
    };

    useEffect(() => {
        if (files.reload) {
          loadBinaries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [files.reload]);

    useEffect(() => {
        loadBinaries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.hash])

    if (R.isNil(files)) {
        return <Loading/>;
    }

    let entriesToDisplay = entries.filter(item => {
        let itemText = diacritics.remove(item.name + item.timestamp + item.url + item.size + item.fileType).replace(/ /g, '').toLowerCase().trim();
        if (!R.isNil(searchFilter) && searchFilter !== '' && !itemText.includes(diacritics.remove(searchFilter.replace(/ /g, '').toLowerCase().trim()))) {
            return null;
        }

        if (filters.length === 0 || filters.filter(f => f.value === item.fileType).length === 0) {
            return null;
        }
        return item;
    });

    return (
        <div className="Blog">
            <h4 className="text-center">File Manager</h4>

            <Toolbar navigateToFolder={navigateToFolder} selectedFiles={selectedFiles} handleShowFolder={handleShowFolder} handleShowDelete={handleShowDelete} handleShowUpload={handleShowUpload} setFilters={setFilters} filters={filters} setSearchFilter={setSearchFilter} dispatcher={dispatcher} entries={entriesToDisplay} filterOptions={filterOptions}/>
            <FilesTable selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} entries={entries} setEntries={setEntries} entriesToDisplay={entriesToDisplay} dispatcher={dispatcher} setSelectedFile={setSelectedFile} handleShowPreview={handleShowPreview} navigateToFolder={navigateToFolder} />
            
            <DeleteModal show={showDelete} handleClose={handleCloseDelete} filesToDelete={entries.filter(e => selectedFiles.includes(e.id))} setSelectedFiles={setSelectedFiles} dispatcher={dispatcher} />
            <PreviewModal show={showPreview} handleClose={handleClosePreview} file={selectedFile} />
            <UploadModal show={showUpload} handleClose={handleCloseUpload} dispatcher={dispatcher} />
            <FolderModal show={showFolder} handleClose={handleCloseFolder} dispatcher={dispatcher} />
        </div>
    );
};
