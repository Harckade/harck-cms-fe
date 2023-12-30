const JournalEntry = function(_entry){
    let entry = _entry || {};
 
    this.timeStamp = entry.timeStamp;
    this.userEmail = entry.userEmail;
    this.userId = entry.userId;
    this.controllerMethod = entry.controllerMethod;
    this.description = entry.description;
};
export default JournalEntry;