const SignalRMessage = function(_message){
    let message = _message || {};
    this.action = message.action;
    this.page = message.page; 
    this.payload = JSON.parse(message.payload);
    this.randomId = message.randomId;
};
export default SignalRMessage;