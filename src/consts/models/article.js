import Title from './title';

const Article = function(_article){
    let article = _article || {};
    this.id = article.id;
    this.author = new Title(article.author);
    this.name = new Title(article.name);
    this.nameNoDiacritics = new Title(article.nameNoDiacritics);
    this.description = new Title(article.description);
    this.url = article.url;
    this.date = new Date(article.timestamp);
    this.imageUrl = new Title(article.imageUrl);
    this.imageDescription = new Title(article.imageDescription);
    this.publishDate = new Date(article.publishDate);
    this.published = article.published;
    this.tags = new Title(article.tags);
    this.markedAsDeleted = article.markedAsDeleted;
    this.markedAsDeletedDate = new Date(article.markedAsDeletedDate);
};
export default Article;