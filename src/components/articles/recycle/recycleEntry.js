import {Button, Card} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const RecycleEntry = ({deletedArticle, handleShowRecyclePreview, handleShowPermanentDelete, handleShowRecover, selectedDeletedArticle, lang}) => {
    const settings = useSelector(state => state.settings);
    return (
        <Card>
            <Card.Header className={settings.darkmode ? 'dark-mode' : ''}>{deletedArticle.markedAsDeletedDate.toLocaleDateString()} | {deletedArticle.markedAsDeletedDate.toLocaleTimeString()}</Card.Header>
            <Card.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Card.Title>{deletedArticle.name[lang]}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{deletedArticle.id}</Card.Subtitle>
                <Card.Text>
                    <Button variant={`${selectedDeletedArticle !== deletedArticle? 'outline-' : ''}secondary`} disabled={selectedDeletedArticle !== deletedArticle} onClick={handleShowRecover}>Recover</Button><span> </span>
                    <Button variant={`${selectedDeletedArticle !== deletedArticle? 'outline-' : ''}danger`} disabled={selectedDeletedArticle !== deletedArticle} onClick={handleShowPermanentDelete}>Permanently delete</Button>
                    <Button variant={`${selectedDeletedArticle !== deletedArticle? 'outline-' : ''}success`} disabled={selectedDeletedArticle === deletedArticle} className={"align-right"} onClick={() => {handleShowRecyclePreview(deletedArticle)}}>Preview</Button>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}