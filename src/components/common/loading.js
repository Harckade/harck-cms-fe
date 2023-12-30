import { Spinner } from 'react-bootstrap';

export const Loading = () => {
    return (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}