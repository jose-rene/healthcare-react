import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Button from "../inputs/Button";
import FormElement from "./FormElement";
import Icon from "./Icon";

const FormGroup = ({ elements, addRepeater, removeRepeater, span: wrapperSpan = 12 }) => {
    return (
        <>
            {elements.map(
                ({
                    key: elementType,
                    id,
                    custom_name,
                    index,
                    label,
                    fields,
                    span_width: span = wrapperSpan,
                    props: { customRule, customValidation } = {},
                    ...props
                }) => {
                    const heading =
                        elementType === "GryInputGroupRepeaterChild"
                            ? `${label} (${index + 1})`
                            : label;
                    const addBtn =
                        fields && elementType === "GryInputGroupRepeater" ? (
                            <Button
                                onClick={() => {
                                    addRepeater(id);
                                }}
                                className="ms-2 btn-success btn-sm"
                                icon="plus"
                                iconSize="1x"
                            >
                                Add
                            </Button>
                        ) : null;
                    const removeBtn =
                        elementType === "GryInputGroupRepeaterChild" ? (
                            <Icon
                                onClick={() => {
                                    removeRepeater(id, index);
                                }}
                                className="float-right"
                                icon="delete"
                                style={{ cursor: "pointer", color: "#ff0000" }}
                            >
                                Delete
                            </Icon>
                        ) : null;
                    // console.log("form group type -> ", elementType);
                    return fields ? (
                        <Card className="mb-3">
                            <Card.Header>
                                {heading} {addBtn} {removeBtn}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <FormGroup
                                        elements={fields}
                                        span={span || 12}
                                    />
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Col md={span || 12}>
                            <FormElement
                                elementType={elementType}
                                id={id}
                                custom_name={custom_name}
                                label={label}
                                {...props}
                                customRule={customRule}
                                customValidation={customValidation}
                            />
                        </Col>
                    );
                }
            )}
        </>
    );
};

export default FormGroup;
