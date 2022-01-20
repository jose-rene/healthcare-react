import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { isString } from "lodash";

import Button from "../inputs/Button";
import FormElement from "./FormElement";
import FapIcon from "./FapIcon";
import { useFormBuilderFieldContext } from "../FormBuilder/context/FormBuilderFieldContext";

import { useFormContext } from "Context/FormContext";

const FormGroup = ({
    elements,
    addRepeater,
    removeRepeater,
    span: wrapperSpan = 12,
    rowIndex = 0,
}) => {
    const { shouldShow, editing, form } = useFormContext();
    const { setVisibility } = useFormBuilderFieldContext();

    return useMemo(() => {
        return (
            <>
                {elements.map(
                    (
                        {
                            key: elementType,
                            id,
                            custom_name,
                            index,
                            label,
                            fields,
                            span_width: span = wrapperSpan,
                            props: { customRule, customValidation } = {},
                            ...props
                        },
                        elementIndex
                    ) => {
                        const heading =
                            elementType === "GryInputGroupRepeaterChild"
                                ? `${label} (${index + 1})`
                                : label;

                        const headerAttributes = () => {
                            const addBtn =
                                fields &&
                                elementType === "GryInputGroupRepeater" ? (
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
                                    <FapIcon
                                        onClick={() => {
                                            removeRepeater(id, index);
                                        }}
                                        className="float-right"
                                        icon="delete"
                                        size="1x"
                                        style={{
                                            cursor: "pointer",
                                            color: "#ff0000",
                                        }}
                                    >
                                        Delete
                                    </FapIcon>
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

                        const spanWidth = () => {
                            if (`${span}`.match(/,/)) {
                                const spanArr = span.replace(/\s/g).split(",");
                                const newSpan = spanArr[elementIndex] || "12";

                                if (newSpan.match(/g/)) {
                                    return {
                                        style: {
                                            flexGrow: newSpan.replace(/g/, ""),
                                        },
                                    };
                                }

                                return newSpan.match(/(px|%)/)
                                    ? { style: { width: newSpan, flex: 0 } }
                                    : { md: newSpan };
                            }

                            if (isString(span) || Number.isInteger(span)) {
                                return span;
                            }

                            return "12";
                        };

                        const visible = shouldShow(customRule, {
                            name: custom_name,
                            elementIndex: rowIndex,
                        });

                        if (!editing && customRule && !visible) {
                            setVisibility(custom_name, false);
                            return null;
                        }
                        setVisibility(custom_name, true);

                        return fields ? (
                            <Card
                                className="mb-0 border-0"
                                style={{ background: "unset" }}
                                key={`element-group-${elementIndex}`}
                            >
                                <Card.Body className="p-0">
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
                                    key={`form-element-${elementIndex}`}
                                />
                            </Col>
                        );
                    }
                )}
            </>
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elements, form]);
};

export default FormGroup;
