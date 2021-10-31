import React from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";

import { useFormContext } from "Context/FormContext";

const FormButtons = ({
    submitLabel = "Submit",
    cancelLabel = false,
    onCancel = false,
    loading = false,
}) => {
    const { clear } = useFormContext();

    return (
        <Row>
            {cancelLabel && (
                <Col md={6}>
                    <Button
                        block
                        label={cancelLabel}
                        className="mb-3"
                        variant="secondary"
                        onClick={onCancel ? () => onCancel() : clear}
                    />
                </Col>
            )}
            <Col md={6}>
                <Button
                    block
                    label={submitLabel}
                    variant="primary"
                    disabled={loading}
                    type="submit"
                />
            </Col>
        </Row>
    );
};

FormButtons.displayName = "FormButtons";

export default React.forwardRef(FormButtons);
