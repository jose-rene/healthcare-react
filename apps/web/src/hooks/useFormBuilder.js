import { useState, useEffect, useMemo } from "react";
import { Registry, ElementStore } from "react-form-builder3";
import useApiCall from "./useApiCall";
import { PUT, POST } from "../config/URLs";
import CustomFormElements from "../components/FormBuilder/Fields";

const useFormBuilder = ({ formId } = {}) => {
    const [{ loading: saving, data }, fireSaveForm] = useApiCall({
        url: `form/${formId}`,
        method: PUT,
    });

    const [{ loading: savingAnswers }, fireSaveAnswers] = useApiCall({
        url: `form/${formId}/form_answers`,
        method: POST,
    });

    const [
        {
            loading: formLoading,
            data: { fields = [], answers: defaultAnswers = {} } = {},
        },
        fireLoadForm,
    ] = useApiCall({
        url: `form/${formId}`,
    });

    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState([]);

    useEffect(() => {
        if (!formId) {
            throw new Error({
                code: 403,
                message: "missing formId in useFormBuilder",
            });
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
        }
        setLoaded(true);
    }, [fields]);

    const formLoaded = useMemo(() => {
        return formLoading && loaded;
    }, [formLoading, loaded]);

    const saveAnswers = (params, { completed_form = false, request_id = null } = {}) => {
        const newAnswers = {
            form_data: params,
            completed_form,
            request_id,
        };

        fireSaveAnswers({ params: newAnswers });
    };

    return [
        {
            form,
            defaultAnswers,
            items,
            formLoading,
            formLoaded,
            loaded,
            saving: saving || savingAnswers,
            savedData: data,
        },
        { setForm, fireLoadForm, fireSaveAnswers: saveAnswers },
    ];
};

export default useFormBuilder;
