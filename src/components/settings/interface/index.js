import { Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../../actions/settings";

export const Interface = () => {
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Alert variant={"primary"} className={'text-center'}>
                       {settings.darkmode === false ? 'Enable dark mode to change background and other colors into dark tones': 'Disable dark mode to change background and other colors into light tones'}
                    </Alert>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <div className="input-group">
                        <span className="input-group-text">Dark mode</span>
                        <Button variant="outline-success" className="form-control" onClick={() => {
                            localStorage.setItem('darkmode', !settings.darkmode);
                            dispatch(setThemeMode(!settings.darkmode));
                        }}>{settings.darkmode === false ? 'Enable' : 'Disable'}</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}