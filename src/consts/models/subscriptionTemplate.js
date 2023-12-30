import Title from './title';

const SubscriptionTemplate = function(_template){
    let template = _template || {};
    this.subject = new Title(template.subject);
    this.author = new Title(template.author);
    this.date = new Date(template.timestamp);
    this.htmlContent = new Title(template.htmlContent);
};
export default SubscriptionTemplate;