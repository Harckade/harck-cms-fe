const Subscriber = function(_subscriber){
    let subscriber = _subscriber || {};
    this.id = subscriber.id;
    this.confirmed = subscriber.confirmed;
    this.language = subscriber !== null && subscriber !== undefined && subscriber.language !== null && subscriber.language !== undefined ?
    `${subscriber.language[0].toLowerCase()}${subscriber.language.substring(1)}` : undefined;
    this.emailAddress = subscriber.emailAddress;
    this.subscriptionDate = new Date(subscriber.subscriptionDate);
};
export default Subscriber;