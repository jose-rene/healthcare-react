import React from "react";
import { Card } from "react-bootstrap";
import Button from "../inputs/Button";
import FormElement from "./FormElement";
import Icon from "./Icon";
// import ContextInput from "../inputs/ContextInput";

const FormGroup = ({ elements, addRepeater, removeRepeater }) => {
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
                    props: { customRule, customValidation },
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
                                className="ml-2 btn-success btn-sm"
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
                                <FormGroup elements={fields} />
                            </Card.Body>
                        </Card>
                    ) : (
                        <FormElement
                            elementType={elementType}
                            id={id}
                            custom_name={custom_name}
                            label={label}
                            {...props}
                            customRule={customRule}
                            customValidation={customValidation}
                        />
                    );
                }
            )}
        </>
    );
};

export default FormGroup;
