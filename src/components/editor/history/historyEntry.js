import {Button, Card} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const HistoryEntry = ({backup, handleShowHistoryPreview, handleShowRestore, selectedBackup}) => {
    const settings = useSelector(state => state.settings);
    return (
        <Card>
            <Card.Header className={settings.darkmode ? 'dark-mode' : ''}>{backup.modificationDate.toLocaleTimeString()}</Card.Header>
            <Card.Body className={settings.darkmode ? 'dark-mode' : ''}>
                <Card.Title>{backup.modificationDate.toLocaleDateString()}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{backup.modifiedBy}</Card.Subtitle>
                <Card.Text>
                    <Button variant={`${selectedBackup !== backup? 'outline-' : ''}secondary`} disabled={selectedBackup !== backup} onClick={handleShowRestore}>Restore</Button>
                    <Button variant={`${selectedBackup !== backup? 'outline-' : ''}success`} disabled={selectedBackup === backup} className={"align-right"} onClick={() => {handleShowHistoryPreview(backup)}}>Preview</Button>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}