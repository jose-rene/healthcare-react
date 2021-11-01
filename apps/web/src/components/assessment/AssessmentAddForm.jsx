import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { sortableContainer } from "react-sortable-hoc";

import { Button } from "components";
import ContextSelect from "components/contextInputs/Select";

import { useFormContext } from "Context/FormContext";

import FormRow from "./FormRow";

const AssessmentAddForm = ({ formOptions }) => {
    const { update, getValue } = useFormContext();
    const forms = getValue("forms", []);

    const [formValue, setFormValue] = useState(null);

    useEffect(() => {
        formOptions && setFormValue(formOptions[0]?.val);
    }, [formOptions]);

    const handleForm = (e) => {
        setFormValue(e.target.value);

        update(e.target.name, e.target.value);
    };

    const addNewForm = () => {
        const index = forms.length;

        update(`forms.${index}`, {
            name: index,
            value: formValue,
        });
    };

    const removeForm = (formIndex) => {
        const filtered = forms.filter((item, itemIndex) => {
            return formIndex !== itemIndex;
        });

        update("forms", filtered);
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const temp = forms[oldIndex];

        forms[oldIndex] = forms[newIndex];
        forms[newIndex] = temp;

        update("forms", forms);
    };

    const SortableContainer = sortableContainer(({ children }) => {
        return <ul>{children}</ul>;
    });

    return (
        <>
            <Col md={6}>
                <ContextSelect
                    name="form"
                    label="Select Form"
                    options={formOptions}
                    onChange={handleForm}
                />
            </Col>
            <Col md={3}>
                <Button
                    label="Add"
                    variant="primary"
                    block
                    onClick={addNewForm}
                />
            </Col>

            <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                {forms.map((item, index) => (
                    <Col md={9}>
                        <FormRow
                            key={`form-row-${index}`}
                            onRemove={() => removeForm(index)}
                            index={index}
                            {...item}
                        />
                    </Col>
                ))}
            </SortableContainer>
        </>
    );
};

export default AssessmentAddForm;
