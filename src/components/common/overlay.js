import { Tooltip, OverlayTrigger } from "react-bootstrap";
import * as R from 'ramda';

export const Overlay = ({ text, component, placement }) => {
    const renderTooltip = () => (
        <Tooltip id="button-tooltip">
            {text}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement={R.isNil(placement) ? "bottom": placement} delay={{ show: 250, hide: 400 }} overlay={renderTooltip()}>
            {component}
        </OverlayTrigger>
    );
}