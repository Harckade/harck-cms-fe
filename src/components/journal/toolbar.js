import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../design/custom.css';
import { useSelector } from 'react-redux';
import { Col, Container, Row, InputGroup, FormControl } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";

export const Toolbar = ({setSearchFilter, setFilters, filters, filterOptions, startDate, setStartDate, endDate, setEndDate})=>{
    const settings = useSelector(state => state.settings);
    const ovverrides = {
        "selectSomeItems": "Filter by action",
        "allItemsAreSelected": "All actions are selected"
    };

    return (
        <Container fluid className={`files-toolbar ${settings.darkmode ? 'dark-mode': ''}`}>
            <Row >
                <Col xs="6" className={'inline' + (settings.darkmode ? ' calendar-dark-mode': '')}>
                    <DatePicker  dateFormat="dd/MM/yyyy" selected={startDate} startDate={startDate} endDate={endDate} selectsRange={true} onChange={(dates) => {
                        let [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                    }} />
                </Col>

                <Col xs="3" md={{ span: 2, offset: 2 }}>
                    <MultiSelect
                        options={filterOptions}
                        value={filters}
                        onChange={(val) => setFilters(val)}
                        labelledBy="Filter by action"
                        hasSelectAll={true}
                        overrideStrings={ovverrides}
                        className={settings.darkmode ? 'input-dark-mode': ''}
                    />
                </Col>
                <Col xs="3" md="2">
                    <InputGroup className={settings.darkmode ? 'input-dark-mode': ''}>
                        <FormControl placeholder="Search" aria-label="Search" aria-describedby="search-by-text" onChange={(e) => { setSearchFilter(e.target.value) }} />
                    </InputGroup>
                </Col>
            </Row>
        </Container>
    );
}