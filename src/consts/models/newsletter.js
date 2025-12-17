import Title from './title';

const Newsletter = function(_newsletter){
    let newsletter = _newsletter || {};
    this.id = newsletter.id;
    this.name = new Title(newsletter.name);
    this.author = new Title(newsletter.author);
    this.date = new Date(newsletter.timestamp);
    this.sendDate = new Date(newsletter.sendDate);
    this.htmlContent = new Title(newsletter.htmlContent);
};
export default Newsletter;