import React, { useState, useEffect } from "react";
import FormGroup from "components/elements/FormGroup";
import { useFormBuilderFieldContext } from "../context/FormBuilderFieldContext";
import FormLoadingSpinner from "../../forms/FormLoadingSpinner";

const RenderForm = () => {
    const [initialized, setInitialized] = useState(false);
    const { fields: formElements, formBuilderHook } =
        useFormBuilderFieldContext();

    const getChildren = (containers) => {
        const children = containers.map((container) => {
            return container.childItems;
        });
        return children.length ? children.flat() : [];
    };

    const [
        { formElementsState },
        {
            buildGroups,
            setFormElementsState,
            setChildFields,
            addRepeater,
            removeRepeater,
        },
    ] = formBuilderHook;

    useEffect(() => {
        // find form containers
        const containers = formElements.filter(
            (item) => item.element === "OneColumnRow" && item.isContainer
        );
        // add them to state, they're only used once now, this may not be necessary
        // setInputContainers(containers);
        // find child ids
        const childIds = getChildren(containers);
        // get the child fields
        const fields = formElements.filter((item) => {
            return (
                item.element &&
                item.element !== "OneColumnRow" &&
                childIds.includes(item.id)
            );
        });
        // add them to state
        setChildFields(fields);
        // process the containers and elements into groups
        const elements = buildGroups(formElements, childIds, fields);

        setFormElementsState(elements);
    }, [formElements]);

    useEffect(() => {
        if (!formElementsState?.length || initialized) {
            return;
        }
        // check element for multiple answers and add repeaters
        formElementsState.forEach((item) => {
            if (item.answerCount && item.answerCount > 1) {
                addRepeater(item.id, item.answerCount - 1);
            }
        });
        setInitialized(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formElementsState]);

    if (!formElementsState?.length) {
        return <FormLoadingSpinner />;
    }

    return (
        <FormGroup
            elements={formElementsState}
            addRepeater={addRepeater}
            removeRepeater={removeRepeater}
        />
    );
};

export default RenderForm;
