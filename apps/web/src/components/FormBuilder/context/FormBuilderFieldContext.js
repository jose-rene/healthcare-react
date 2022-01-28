import React, { createContext, useContext, useState, useEffect } from "react";
import { set, get } from "lodash";
import { objToDot } from "../../../helpers/string";

export const FormBuilderFieldContext = createContext({});
export const useFormBuilderFieldContext = () =>
    useContext(FormBuilderFieldContext);

export const FormBuilderProvider = ({
    fields: __fields = [],
    formBuilderHook,
    children,
}) => {
    const [fields, setFields] = useState(__fields);
    const [fieldVisibility, setFieldVisibility] = useState({});
    const [filteredAnswers, setFilteredAnswers] = useState({});

    useEffect(() => {
        setFields(__fields);
    }, [__fields]);

    /**
     * @param {Object} [params]
     * @param {Object} [params.answers] - all the answers that need to be filtered
     * @return {Object}
     */
    const mergeAnswers = ({ answers = {} } = {}) => {
        const _answers = {};

        Object.keys(answers).forEach((a) => {
            if (get(fieldVisibility, `${a}.visible`, true)) {
                _answers[a] = answers[a];
            }
        });

        setFilteredAnswers(_answers);
        return _answers;
    };

    /**
     * @description manually maintain field visibility
     * @param {string} name - field name
     * @param {boolean} [visible] - field visibility
     * @return {boolean}
     */
    const setVisibility = (name, visible = true) => {
        if (!name) {
            return false;
        }

        setFieldVisibility((prev) => {
            const origFieldVisibility = { ...prev };

            set(origFieldVisibility, `${name}.visible`, visible);
            return objToDot(origFieldVisibility);
        });

        return true;
    };

    return (
        <FormBuilderFieldContext.Provider
            value={{
                filteredAnswers,

                fields,
                setFields,

                fieldVisibility,
                setFieldVisibility,
                setVisibility,

                mergeAnswers,

                formBuilderHook,
            }}
        >
            {children}
        </FormBuilderFieldContext.Provider>
    );
};
