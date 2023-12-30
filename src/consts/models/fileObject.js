import {getFileUrlFromId} from '../../actions/files';

const FileObject = function(_fileObject){
    let fileObject = _fileObject || {};
    this.id = fileObject.id;
    this.name = fileObject.name;
    this.size = fileObject.size;
    this.date = new Date(fileObject.timestamp);
    this.fileType = fileObject.fileType;
    this.url = getFileUrlFromId(fileObject.id);
};
export default FileObject;