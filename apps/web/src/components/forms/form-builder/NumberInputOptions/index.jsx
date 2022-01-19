import React from "react";
import { Row, Col } from "react-bootstrap";

const NumberInputOptions = ({ element, onBlur, onChange }) => {
    const {
        max,
        min,
        step = 1,
    } = element?.props || {};

    return (
        <Row>
            <Col md={4}>
                <div className="form-group">
                    <label className="control-label" htmlFor="max">Max:</label>
                    <input
                        id="max" type="text" className="form-control"
                        defaultValue={element?.max || max}
                        onBlur={onBlur}
                        onChange={onChange.bind(this, "max", "value")}
                    />
                </div>
            </Col>
            <Col md={4}>
                <div className="form-group">
                    <label className="control-label" htmlFor="min">Min:</label>
                    <input
                        id="min" type="text" className="form-control"
                        defaultValue={element?.min || min}
                        onBlur={onBlur}
                        onChange={onChange.bind(this, "min", "value")}
                    />
                </div>
            </Col>
            <Col md={4}>
                <div className="form-group">
                    <label className="control-label" htmlFor="step">Step:</label>
                    <input
                        id="step" type="text" className="form-control"
                        defaultValue={element?.step || step}
                        onBlur={onBlur}
                        onChange={onChange.bind(this, "step", "value")}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default NumberInputOptions;
