import React, {
    useContext,
    useState,
    useMemo,
    createContext,
    useEffect,
    useCallback,
} from "react";
import { set, get, debounce } from "lodash";
import { BaseSchema } from "yup";

import { jsEval } from "../helpers/string";

export const REQUIRED = "required";

export const FormContext = createContext({});

export const useFormContext = () => useContext(FormContext);

/**
 *
 * @param children
 * @param onSubmit
 * @param validation
 * @param defaultData
 * @param {string} [autoFiller] autofill field conditions and valluevalues
 * @param _editing
 * @param onChange - watches the form object for changes and on change after debounce fire this callback with the form object. Caution this ignores validation
 * @returns {JSX.Element}
 * @constructor
 */
const FormProvider = ({
    children,
    onSubmit,
    validation = {},
    defaultData = {},
    autoFiller = "",
    editing: _editing = false,
    formBuilder: _formBuilder = false,
    onChange: onFormChange,
    debounceMs = 1000,
}) => {
    const [editing, setEditing] = useState(_editing);
    const [form, setForm] = useState(defaultData);
    const [tick, setTick] = useState(null);
    const [autoFillTick, setAutoFillTick] = useState(null);
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [valid, setValid] = useState(false);
    const [validationRules, setValidationRules] = useState(validation);
    const [formatDatas, setFormatDatas] = useState({});
    const [preSubmitCallbacks, setPreSubmitCallbacks] = useState(null);

    // eslint-disable-next-line
    const debounceAutoFillTick = useCallback(
        /** @type {function(any):void} */
        debounce((autoFillTick) => {
            if (_formBuilder && autoFillTick !== null) {
                setAutoFillTick(autoFillTick + 1);
            }
        }, 500),
        []
    );

    const debouncedOnFormChange = useCallback(
        /** @type {function(any):void} */
        debounce((tick) => {
            if (tick !== null) {
                setTick(tick + 1);
            }
        }, debounceMs),
        []
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
        setForm(defaultData);
        setTick(0);
    }, [defaultData]);

    const hasErrors = useMemo(() => {
        return Object.keys(errors).length > 0;
    }, [errors]);

    useEffect(() => {
        setValidated(false);
        setTick(0);
        setAutoFillTick(0);

        return () => setValidated(false);
    }, []);

    // after onSubmit validate the fields onChange
    useEffect(() => {
        if (onFormChange) {
            debouncedOnFormChange(tick);
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

    useEffect(() => {
        if (autoFillTick !== null && _formBuilder) {
            handleAutofill(form);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFillTick]);

    const handleAutofill = useCallback(
        (_form) => {
            const autoFillerKeys = Object.keys(autoFiller || {});

            if (_formBuilder && autoFillerKeys.length > 0) {
                autoFillerKeys.forEach((autofillInputName) => {
                    let foundValue = "!~!";
                    const _rules =
                        autoFiller[autofillInputName]?.autofill || [];

                    if (_rules.length > 0) {
                        _rules.forEach((r) => {
                            const value = jsEval(r, _form);

                            if (foundValue === "!~!" && value) {
                                foundValue = value;
                            }
                        });
                    }

                    if (
                        foundValue !== "!~!" &&
                        foundValue !== false &&
                        foundValue !== undefined
                    ) {
                        update(
                            autofillInputName.replace(/\.autofill/, ""),
                            foundValue,
                            _form
                        );
                    }
                });
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form]
    );

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
        if (!validationRules) {
            return true;
        }

        let errorTest = {};

        Object.keys(validationRules).forEach((fieldName) => {
            const {
                rules = [],
                customRule = "",
                customValidation = "",
                yupSchema,
                callback,
            } = validationRules[fieldName];
            const value = get(form, fieldName, "");

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
            if (!errorTest[fieldName] && customRule.length > 0) {
                const result = jsEval(customRule, form, { strict: true });
                if (result && result.length > 0) {
                    errorTest = {
                        ...errorTest,
                        [fieldName]: { message: result },
                    };
                }
            }

            if (!errorTest[fieldName] && customValidation.length > 0) {
                const result = jsEval(customValidation, form, { strict: true });
                if (result && result.length > 0) {
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

            // runs global pre submit data formatting
            const cleanedFormData = !preSubmitCallbacks
                ? formValues
                : preSubmitCallbacks({ form: formValues });

            onSubmit(cleanedFormData);
        }
    };

    const addFormatData = (name, action) => {
        setFormatDatas((prev) => ({ ...prev, [name]: action }));
    };

    const getValue = (key, defaultValue = "") => {
        return get(form, key, defaultValue);
    };

    const update = (name, value, _form = form) => {
        const oldForm = { ..._form };
        set(oldForm, name, value);
        setForm(() => oldForm);
        debounceAutoFillTick(autoFillTick);
    };

    const objUpdate = (obj) => {
        const oldForm = { ...form };
        Object.keys(obj).forEach((o) => {
            set(oldForm, o, obj[o]);
        });
        setForm(() => oldForm);

        debounceAutoFillTick(autoFillTick);
    };

    const onChange = ({ target: { name, value, type = "text" } }) => {
        const oldForm = { ...form };
        if (type === "checkbox") {
            set(oldForm, name, document.getElementById(name).checked);
        } else {
            set(oldForm, name, value);
        }
        setForm(() => oldForm);

        debounceAutoFillTick(autoFillTick);
    };

    const clear = () => {
        setForm({});
        setValidated(false);
        setValid(false);
    };

    /**
     * @description adds callback on form submit. The params on
     *                  callback will be { form: formValues }
     * @param newCallback
     */
    const addPreSubmitCallback = (newCallback) => {
        setPreSubmitCallbacks(() => newCallback);
    };

    const shouldShow = useCallback(
        (rule, { name, elementIndex: rowIndex = 0 }) => {
            if (!rule) {
                return true;
            }

            try {
                const template = rule.replace(
                    /[[.]@index[\].]/gi,
                    "[" + rowIndex.toString() + "]"
                );

                return jsEval(template, form);
            } catch (err) {}
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
                validationRules,
                setValidationRules,

                // These callbacks are triggered pre-validation on form submit only.
                preSubmitCallbacks,
                addPreSubmitCallback,
                setPreSubmitCallbacks,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export default FormProvider;
