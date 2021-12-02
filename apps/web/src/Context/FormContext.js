import React, { useContext, useState, useMemo, createContext, useEffect, useCallback } from "react";
import { set, get, debounce } from "lodash";
import { BaseSchema } from "yup";
import { handlebarsTemplate, jsEval } from "../helpers/string";

export const REQUIRED = "required";

export const FormContext = createContext({});

export const useFormContext = () => useContext(FormContext);

/**
 *
 * @param children
 * @param onSubmit
 * @param validation
 * @param defaultData
 * @param _editing
 * @param debug
 * @param onFormChange - watches the form object for changes and on change after debounce fire this callback with the form object. Caution this ignores validation
 * @param debounce - used for onFormChange. after debouce fire onFormChange
 * @returns {JSX.Element}
 * @constructor
 */
const FormProvider = ({
    children,
    onSubmit,
    validation = {},
    defaultData = {},
    editing: _editing = false,
    onFormChange,
    debounceMs = 1000,
}) => {
    const [editing, setEditing] = useState(_editing);
    const [form, setForm] = useState(defaultData);
    const [tick, setTick] = useState(null);
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [valid, setValid] = useState(false);
    const [validationRules, setValidationRules] = useState(validation);
    const [formatDatas, setFormatDatas] = useState({});

    const debouncedOnFormChange = useCallback(
        debounce(() => {
            if (tick !== null) {
                setTick(tick + 1);
            }
        }, debounceMs),
        [form]
    );

    useEffect(() => {
        return () => {
            handleFormChange();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (validation) {
            setValidationRules((prev) => ({ ...prev, ...validation }));
        }
    }, [validation]);

    useEffect(() => {
        setTick(null);
        setForm(defaultData);
        setTick(0);
    }, [defaultData]);

    const hasErrors = useMemo(() => {
        return Object.keys(errors).length > 0;
    }, [errors]);

    useEffect(() => {
        setValidated(false);
        setTick(0);

        return () => setValidated(false);
    }, []);

    // after onSubmit validate the fields onChange
    useEffect(() => {
        if (onFormChange) {
            debouncedOnFormChange();
        }

        if (validated) {
            validateForm();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    useEffect(() => {
        if (tick !== null && onFormChange) {
            handleFormChange();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    const handleFormChange = () => {
        let formValues = form;

        // runs component pre submit data formatting
        Object.keys(formatDatas).forEach((callbackName) => {
            const callback = formatDatas[callbackName];

            formValues = callback(formValues, getValue, callbackName);
        });

        if (typeof onFormChange === "function") {
            onFormChange(formValues);
        }
    };

    const validateForm = () => {
        let errorTest = {};

        Object.keys(validationRules).forEach((fieldName) => {
            const {
                rules = [],
                customRule = "",
                yupSchema,
                callback,
            } = validationRules[fieldName];
            const { [fieldName]: value = "" } = form;

            // run validations
            if (rules.includes(REQUIRED) && (!value || value.length === 0)) {
                errorTest = {
                    ...errorTest,
                    [fieldName]: { message: "This field is required" },
                };
            }

            if (callback) {
                const message = callback(form, fieldName, value);
                if (message !== true) {
                    errorTest = {
                        ...errorTest,
                        [fieldName]: { message },
                    };
                }
            }

            // yupSchema validation
            if (yupSchema && yupSchema instanceof BaseSchema) {
                // run the validation synchronously
                try {
                    yupSchema.validateSync(value);
                } catch (e) {
                    if (e?.errors?.length) {
                        errorTest = {
                            ...errorTest,
                            [fieldName]: { message: e.errors[0] },
                        };
                    }
                }
            }

            // custom rule
            if (customRule.length > 0) {
                const result = handlebarsTemplate(customRule, form);
                if (result.length > 0) {
                    errorTest = {
                        ...errorTest,
                        [fieldName]: { message: result },
                    };
                }
            }
        });

        setErrors(errorTest);

        // validation fails
        return Object.keys(errorTest).length <= 0;
    };

    const getError = ({ name }, defaultValue = false) => {
        const { [name]: { message = defaultValue } = {} } = errors;
        return message;
    };

    const handleFormSubmit = () => {
        setValidated(true);

        // this validation is basically for messages. react-bootstrap is in charge of blocking submit
        const validCheck = validateForm();
        setValid(validCheck);

        if (validCheck && onSubmit) {
            let formValues = form;

            // runs component pre submit data formatting
            Object.keys(formatDatas).forEach((callbackName) => {
                const callback = formatDatas[callbackName];

                formValues = callback(formValues, getValue, callbackName);
            });

            onSubmit(formValues);
        }
    };

    const addFormatData = (name, action) => {
        setFormatDatas((prev) => ({ ...prev, [name]: action }));
    };

    const getValue = (key, defaultValue = "") => {
        return get(form, key, defaultValue);
    };

    const update = (name, value) => {
        const oldForm = { ...form };
        set(oldForm, name, value);
        setForm(() => oldForm);
    };

    const objUpdate = (obj) => {
        const oldForm = { ...form };
        Object.keys(obj).forEach((o) => {
            set(oldForm, o, obj[o]);
        });
        setForm(() => oldForm);
    };

    const onChange = ({ target: { name, value, type = "text" } }) => {
        const oldForm = { ...form };
        if (type === "checkbox") {
            set(oldForm, name, document.getElementById(name).checked);
        } else {
            set(oldForm, name, value);
        }
        setForm(() => oldForm);
    };

    const clear = () => {
        setForm({});
        setValidated(false);
        setValid(false);
    };

    const shouldShow = useCallback(
        (rule, { name, elementIndex: rowIndex = 0 }) => {
            try {
                const template = rule
                    .replace(/\.?@index\.?/gi, "[" + rowIndex.toString() + "].");

                const show = jsEval(template, form);

                if (!show && !editing && name && !!form[name]) {
                    update(name, "");
                }

                return show;
            } catch (e) {}

            return false;
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form]
    );

    return (
        <FormContext.Provider
            value={{
                // values
                form,
                errors,
                valid,
                hasErrors,
                editing,

                // functions
                setForm,
                onSubmit: handleFormSubmit,
                addFormatData,
                update,
                onChange,
                objUpdate,
                getValue,
                getError,
                clear,
                shouldShow,
                setEditing,
                setValidated,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export default FormProvider;
