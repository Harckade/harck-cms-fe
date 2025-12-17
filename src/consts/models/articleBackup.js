const ArticleBackup = function(_article){
    let article = _article || {};
    this.id = article.id;
    this.author = article.author;
    this.modifiedBy = article.modifiedBy;
    this.name = article.name;
    this.language = article.language;
    this.modificationDate = new Date(article.modificationDate);
    this.description = article.description;
    this.imageUrl = article.imageUrl;
    this.imageDescription = article.imageDescription;
    this.tags = article.tags;
};
export default ArticleBackup;