import { useState, useEffect, useMemo, useCallback } from "react";
import { Registry, ElementStore } from "react-form-builder3";
import useApiCall from "./useApiCall";

import CustomFormElements from "../components/FormBuilder/Fields";

import { PUT } from "../config/URLs";
import { set, findLastIndex } from "lodash";
import * as Yup from "yup";
import { useFormContext } from "../Context/FormContext";

const useFormBuilder = ({ form_slug = undefined, request_id } = {}) => {
    const [formElementsState, setFormElementsState] = useState([]);
    const [childFields, setChildFields] = useState([]);
    const { getValue, update: setValue } = useFormContext();
    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState([]);
    const [formAnswers, setFormAnswers] = useState({});
    const [formRevisions, setFormRevisions] = useState([]);
    const [validation, setValidation] = useState({});
    const [fieldAutofill, setFieldAutofill] = useState(null);

    const formAnswerUrl = `request/${request_id}/request_form_section/${form_slug}`;

    const [{ loading: saving, data }, fireSaveForm] = useApiCall({
        url: `form/${form_slug}`,
        method: PUT,
    });

    const [{ loading: savingAnswers }, fireSaveAnswers] = useApiCall({
        url: formAnswerUrl,
        method: PUT,
    });

    const [
        { loading: formLoading, data: { fields = [] } = {} },
        apiFireLoadForm,
    ] = useApiCall({});

    useEffect(() => {
        if (!form_slug && form_slug !== false) {
            throw new Error("missing form_slug in useFormBuilder");
        }

        const registered = Registry.list();

        const newItems = Object.entries(CustomFormElements).map(
            ([componentName, component]) => {
                if (!registered.includes(componentName)) {
                    Registry.register(componentName, component);
                }

                const baseAttrs = {
                    key: componentName,
                    element: "CustomElement",
                    type: "custom",
                    field_name: component.register.name,
                };

                return { ...baseAttrs, ...component.register };
            }
        );

        setItems(newItems);

        ElementStore.subscribe((allTheThings) => {
            const { data } = allTheThings;

            if (data.length > 0) {
                setForm(data);
                fireSaveForm({ params: { form: data } });
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fields.length > 0) {
            setForm(fields);
            buildFormSchema(fields);
        }
        setLoaded(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    const formLoaded = useMemo(() => {
        return formLoading && loaded;
    }, [formLoading, loaded]);

    const fireLoadForm = async (params) => {
        const url = request_id ? formAnswerUrl : `form/${form_slug}`;

        const response = await apiFireLoadForm({
            url,
            ...params,
        });

        const {
            answer_data: answers = {},
            fields: fieldData = [],
            revisions = [],
        } = response;

        // set the depth of repeater fields if there is answer data
        (fieldData ?? []).forEach(({ key, custom_name: name }, i) => {
            if (key === "GryInputGroupRepeater") {
                // find the answers
                if (answers && answers[name] && answers[name].length) {
                    fieldData[i].answerCount = answers[name].length;
                }
            }
        });

        setFormAnswers(answers);
        setFormRevisions(revisions);

        return response;
    };

    const saveAnswers = (
        params,
        { completed_form = false, request_id = null } = {}
    ) => {
        const newAnswers = {
            form_data: params,
            completed_form,
            request_id,
        };

        return fireSaveAnswers({ params: newAnswers });
    };

    const checkForValidation = (props, fieldValidation) => {
        const {
            required,
            custom_name: name,
            props: _props = {},
            key: fieldType,
            label: _label = false,
        } = props;
        const { customValidation } = _props;
        const label = _label || false;
        const rule = {};

        if (required) {
            rule.required = true;

            if (fieldType === "GryCheckboxGroup") {
                rule.yupSchema = `!Object.keys(~${name} || {}).filter(e => !!~${name}[e]).length && "${label} is required"`;
                return true;
            } else {
                rule.yupSchema = Yup.string().required(`${label} is required`);
            }
        }

        if (customValidation) {
            rule.customValidation = customValidation;
        }

        if (Object.keys(rule).length > 0) {
            fieldValidation[name] = rule;
        }
    };

    const buildFormSchema = (_form) => {
        const _formSchema = {};
        const flatAutoFillRules = {};
        const fieldValidation = {};

        _form.forEach((f) => {
            const { id, parentId } = f;

            if (!parentId) {
                _formSchema[id] = f;
                return true;
            }

            if (!_formSchema[parentId]["elements"]) {
                _formSchema[parentId]["elements"] = [];
            }

            _formSchema[parentId]["elements"].push(f);
        });

        Object.keys(_formSchema).forEach((key) => {
            const _element = _formSchema[key];
            const { custom_name, elements = [], props } = _element;
            const { autofill = false } = props;

            if (autofill) {
                set(
                    flatAutoFillRules,
                    `${custom_name}.autofill`,
                    autofill.split("\n")
                );
            }

            checkForValidation(_element, fieldValidation);

            elements.forEach((childKey) => {
                const { custom_name: child_custom_name, props: child_props } =
                    childKey;
                const { autofill: child_autofill = false } = child_props;

                checkForValidation(
                    {
                        ...childKey,
                        custom_name: `${custom_name}[${child_custom_name}]`,
                    },
                    fieldValidation
                );

                if (child_autofill) {
                    flatAutoFillRules[
                        `${custom_name}.${child_custom_name}.autofill`
                    ] = child_autofill.split("\n");
                }
            });
        });

        setValidation(fieldValidation);
        setFieldAutofill(flatAutoFillRules);
    };

    /**
     * build into groups
     * @param {Array} elements
     * @param {Array} childIds
     * @param {Array} subFields
     */
    const buildGroups = useCallback(
        (elements, childIds, subFields) => {
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
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form]
    );

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
            // revalue all from the one that was chosen to be removed
            const revaluedFields = item.fields.map((field) => {
                // get the value of the next field and assign to this one
                if (lastRepeaterIndex !== itemIndex) {
                    const nextName = `${field.parent_name}[${item.index + 1}][${
                        field.base_name
                    }]`;
                    const value = getValue(nextName, "");
                    setValue({ [field.custom_name]: value });
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

    return [
        {
            form,
            fieldAutofill,
            defaultAnswers: formAnswers,
            items,
            formLoading,
            formLoaded,
            loaded,
            saving: saving || savingAnswers,
            savedData: data,
            formRevisions,
            formElementsState,
            childFields,
            validation,
        },
        {
            setForm,
            fireLoadForm,
            fireSaveAnswers: saveAnswers,
            buildGroups,
            updateFormRepeater,
            addRepeater,
            removeRepeater,
            setFormElementsState,
            setChildFields,
            setValidation,
        },
    ];
};

export default useFormBuilder;
