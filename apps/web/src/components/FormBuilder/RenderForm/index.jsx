import React, { useState, useEffect } from "react";
import { findLastIndex } from "lodash";
import FormGroup from "components/elements/FormGroup";
import { useFormContext } from "../../../Context/FormContext";

const RenderForm = ({ formElements }) => {
    const [formElementsState, setFormElementsState] = useState([]);
    const [childFields, setChildFields] = useState([]);
    const [initialized, setInitialized] = useState(false);
    // const [inputContainers, setInputContainers] = useState([]);

    const getChildren = (containers) => {
        const children = containers.map((container) => {
            return container.childItems;
        });
        return children.length ? children.flat() : [];
    };

    const { getValue, update: setValue, setForm } = useFormContext();

    // build into groups
    const processGroups = (elements, childIds, subFields) => {
        // elements that are not child elements
        const fields = elements.filter((item) => {
            return item.element && !childIds.includes(item.id);
        });
        // map the groups with the respective fields
        return fields.map((item) => {
            // process input groups and repeater groups
            if (item.element && item.element === "OneColumnRow") {
                const children = item.childItems.map((childId) => {
                    const childElement = subFields.find((child) => {
                        return child.id === childId;
                    });
                    if (!childElement) {
                        return "<p>Empty</p>";
                    }
                    if (item.key === "GryInputGroupRepeater") {
                        return {
                            ...childElement,
                            custom_name: `${item.custom_name}[0][${childElement.custom_name}]`,
                        };
                    }
                    return {
                        ...childElement,
                        custom_name: `${item.custom_name}[${childElement.custom_name}]`,
                    };
                });
                if (item.key !== "GryInputGroupRepeater") {
                    return { ...item, fields: children };
                }
                return { ...item, index: 0, fields: children };
            }
            return item;
        });
    };

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
        const elements = processGroups(formElements, childIds, fields);
        setFormElementsState(elements);
    }, [formElements]);

    // updates repeater field in form context
    const updateFormRepeater = (fieldName, index) => {
        // the value is an object, get a shallow copy less we mutate state
        const [...value] = getValue(fieldName);
        // set the form context state with the removed index
        if (value && value[index]) {
            // remove the index in values of the removed index
            value.splice(index, 1);
            // set the values in the form context
            setForm((prevForm) => {
                return { ...prevForm, [fieldName]: value };
            });
        }
    };

    const addRepeater = (id, qty = 1) => {
        const elements = [...formElementsState];
        // get the index of the last repeated
        const lastIndex = findLastIndex(elements, (item) => {
            return item.id === id;
        });
        // get the parent repeater
        const repeater = elements.find((item) => {
            return item.id === id;
        });
        const insertRepeaters = [];
        // the new index will be the count of existing repeaters of this id
        const index = elements.filter((item) => item.id === id).length;
        // rename each of the child fields to be added, will only me more than one on initial render
        for (let x = 0; x < qty; x++) {
            const childIndex = index + x;
            const fields = repeater.childItems.map((childId) => {
                const childElement = childFields.find((child) => {
                    return child.id === childId;
                });
                return {
                    ...childElement,
                    custom_name: `${repeater.custom_name}[${childIndex}][${childElement.custom_name}]`,
                    base_name: childElement.custom_name,
                    parent_name: repeater.custom_name,
                };
            });
            // construct the repeater element to be added
            insertRepeaters.push({
                ...repeater,
                key: `${repeater.key}Child`,
                index: childIndex,
                fields,
            });
        }
        // insert the added element
        const updatedElements = [
            // part of the array before the specified index
            ...elements.slice(0, lastIndex + 1),
            // inserted repeater field
            ...insertRepeaters,
            // part of the array after the specified index
            ...elements.slice(lastIndex + 1),
        ];
        // set state
        setFormElementsState(updatedElements);
    };

    const removeRepeater = (id, index) => {
        const elements = [...formElementsState];
        const removeIndex = elements.findIndex((item) => {
            return item.id === id && item.index === index;
        });
        if (removeIndex === -1) {
            return;
        }
        // see if there are more repeating elements in this group after the removed element,
        // if so, the field names in those elements need to be re-processed
        const nextIndex = elements.findIndex((item) => {
            return item.id === id && item.index === index + 1;
        });
        // simply remove the specified element
        if (nextIndex === -1) {
            // get the removed element
            const removedElement = elements.find((item) => {
                return item.id === id && item.index === index;
            });
            // clear out the field values from the removed element
            removedElement.fields.map((field) => {
                setValue({ [field.custom_name]: "" });
                return field;
            });
            // remove the element
            elements.splice(removeIndex, 1);
            // set state
            setFormElementsState(elements);
            // get the field name to update form context state
            const fieldName = removedElement.custom_name;
            updateFormRepeater(fieldName, index);
            return;
        }
        // Instead of re-indexing, set the value of items to the value of the next item and remove the last item

        // get the last index of the repeater child elements, this element will be removed when the others are processed
        const lastRepeaterIndex = findLastIndex(
            elements,
            (item) => item.id === id
        );

        // remap fields and rename the child repeaters with their new index
        const updatedElements = elements.map((item, itemIndex) => {
            if (item.id !== id || itemIndex < removeIndex) {
                return item;
            }
            // console.log("revalue fields ", itemIndex, removeIndex);
            // revalue all from the one that was chosen to be removed
            const revaluedFields = item.fields.map((field) => {
                // get the value of the next field and assign to this one
                if (lastRepeaterIndex !== itemIndex) {
                    const nextName = `${field.parent_name}[${item.index + 1}][${
                        field.base_name
                    }]`;
                    const value = getValue(nextName, "");
                    setValue({ [field.custom_name]: value });
                    // console.log(nextName, field.custom_name, value);
                } else {
                    // clear the original value
                    setValue({ [field.custom_name]: "" });
                }
                return field;
            });
            return {
                ...item,
                fields: revaluedFields,
                // index: elementIndex,
            };
        });
        // the one to remove will always be the last
        updatedElements.splice(lastRepeaterIndex, 1);
        // set state
        setFormElementsState(updatedElements);

        // get the field name to update form context state
        const fieldName = updatedElements[0].custom_name;
        updateFormRepeater(fieldName, index);
    };

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

    return formElementsState?.length ? (
        <FormGroup
            elements={formElementsState}
            addRepeater={addRepeater}
            removeRepeater={removeRepeater}
        />
    ) : (
        <div>Loading...</div>
    );
};

export default RenderForm;
