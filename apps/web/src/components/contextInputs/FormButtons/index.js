import React from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";

import { useFormContext } from "Context/FormContext";

const FormButtons = ({
    submitLabel = "Submit",
    cancelLabel = "Cancel",
    onCancel = false,
}) => {
    const { clear } = useFormContext();

    return (
        <Row>
            <Col md={6}>
                <Button
                    block
                    className="mb-3"
                    variant="secondary"
                    onClick={onCancel ? () => onCancel() : clear}
                >
                    {cancelLabel}
                </Button>
            </Col>
            <Col md={6}>
                <Button block variant="primary" type="Submit">
                    {submitLabel}
                </Button>
            </Col>
        </Row>
    );
};

FormButtons.displayName = "FormButtons";

export default React.forwardRef(FormButtons);
