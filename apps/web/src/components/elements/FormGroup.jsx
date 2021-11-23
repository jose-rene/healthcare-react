import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Button from "../inputs/Button";
import FormElement from "./FormElement";
import Icon from "./Icon";
import { isString } from "lodash";
import { useFormContext } from "../../Context/FormContext";

const FormGroup = ({ elements, addRepeater, removeRepeater, span: wrapperSpan = 12, rowIndex = 0 }) => {
    const { shouldShow, editing } = useFormContext();

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
                }, elementIndex) => {

                    const heading =
                        elementType === "GryInputGroupRepeaterChild"
                            ? `${label} (${index + 1})`
                            : label;

                    const headerAttributes = () => {
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
                                    size="1x"
                                    style={{ cursor: "pointer", color: "#ff0000" }}
                                >
                                    Delete
                                </Icon>
                            ) : null;

                        if (!addBtn && !removeBtn) {
                            return null;
                        }

                        return (
                            <>
                                {addBtn} {removeBtn}
                            </>
                        );
                    };
                    // console.log("form group type -> ", elementType);

                    const spanWidth = () => {
                        if (`${span}`.match(/,/)) {
                            const spanArr = span.replace(/\s/g).split(",");
                            const newSpan = spanArr[elementIndex] || "12";

                            if (newSpan.match(/g/)) {
                                return { style: { flexGrow: newSpan.replace(/g/, "") } };
                            }

                            return newSpan.match(/(px|%)/) ?
                                { style: { width: newSpan, flex: 0 } } :
                                { md: newSpan };
                        }

                        if (isString(span) || Number.isInteger(span)) {
                            return span;
                        }

                        return "12";
                    };

                    if (!editing && customRule &&
                        !shouldShow(customRule, { name: custom_name, elementIndex: rowIndex })) {
                        return null;
                    }

                    return fields ? (
                        <Card className="mb-0 border-0" style={{ background: "unset" }}>
                            <Card.Body class="p-0">
                                <h3>
                                    {heading} {headerAttributes()}
                                </h3>
                                <Row>
                                    <FormGroup
                                        rowIndex={index}
                                        elements={fields}
                                        span={span || 12}
                                    />
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Col {...spanWidth()}>
                            <FormElement
                                rowIndex={rowIndex}
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
