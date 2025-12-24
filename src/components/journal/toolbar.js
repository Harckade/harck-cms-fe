import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../design/custom.css';
import { useSelector } from 'react-redux';
import { Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { FilterBar } from '../common/filterBar';

export const Toolbar = ({ setSearchFilter, setFilters, filters, filterOptions, startDate, setStartDate, endDate, setEndDate }) => {
    const settings = useSelector(state => state.settings);

    return (
        <Container fluid className={`files-toolbar ${settings.darkmode ? 'dark-mode' : ''}`}>
            <Row >
                <Col xs="6" className={'inline' + (settings.darkmode ? ' calendar-dark-mode' : '')}>
                    <DatePicker dateFormat="dd/MM/yyyy" selected={startDate} startDate={startDate} endDate={endDate} selectsRange={true} onChange={(dates) => {
                        let [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                    }} />
                </Col>

                <Col xs="3" md={{ span: 3, offset: 1 }}>
                    <FilterBar filterOptions={filterOptions} filters={filters} settings={settings} setFilters={setFilters} />
                </Col>
                <Col xs="3" md="2">
                    <InputGroup className={settings.darkmode ? 'input-dark-mode' : ''}>
                        <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                    </InputGroup>
                </Col>
            </Row>
        </Container>
    );
}