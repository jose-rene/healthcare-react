import { useState, useEffect, useMemo } from "react";
import { Registry, ElementStore } from "react-form-builder3";
import useApiCall from "./useApiCall";
import { PUT, POST } from "../config/URLs";
import CustomFormElements from "../components/FormBuilder/Fields";

const useFormBuilder = ({
    form_slug,
    request_id,
} = {}) => {
    const formAnswerUrl = `request/${request_id}/request_form_section/${form_slug}`;

    const [{ loading: saving, data }, fireSaveForm] = useApiCall({
        url: `form/${form_slug}`,
        method: PUT,
    });

    const [{ loading: savingAnswers }, fireSaveAnswers] = useApiCall({
        url: formAnswerUrl,
        method: POST,
    });

    const [
        {
            loading: formLoading,
            data: { fields = [], answers: defaultAnswers = {} } = {},
        },
        apiFireLoadForm,
    ] = useApiCall({
    });

    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState([]);
    const [formAnswers, setFormAnswers] = useState({});

    useEffect(() => {
        if (!form_slug) {
            throw new Error({
                code: 403,
                message: "missing form_slug in useFormBuilder",
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

    const fireLoadForm = async (params) => {
        const url = request_id ?
            formAnswerUrl :
            `form/${form_slug}`;

        const response = await apiFireLoadForm({
            url,
            ...params,
        });

        const { answer_data = {} } = response;
        console.log('fireLoadForm', {response, answer_data});

        setFormAnswers(answer_data);

        return response;
    };

    const saveAnswers = (params, { completed_form = false, request_id = null } = {}) => {
        const newAnswers = {
            form_data: params,
            completed_form,
            request_id,
        };

        return fireSaveAnswers({ params: newAnswers });
    };

    return [
        {
            form,
            defaultAnswers: formAnswers,
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
