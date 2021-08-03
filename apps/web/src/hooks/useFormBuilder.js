import { useState, useEffect, useMemo } from "react";
import { Registry, ElementStore } from "react-form-builder3";
import useApiCall from "./useApiCall";
import { PUT } from "../config/URLs";
import CustomFormElements from "../components/FormBuilder/Fields";

const useFormBuilder = ({
    formId,
} = {}) => {
    const [{ loading: saving, data }, fireSaveForm] = useApiCall({
        url: `form/${formId}`,
        method: PUT,
    });

    const [{ loading: formLoading, data: { form: { fields = [] } = {} } = {} }, fireLoadForm] = useApiCall({
        url: `form/${formId}`,
    });

    const [loaded, setLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState([]);

    useEffect(() => {
        if (!formId) {
            throw 'missing formId in useFormBuilder';
        }

        const registered = Registry.list();

        const newItems = Object.entries(CustomFormElements).map(([componentName, component]) => {
            if (!registered.includes(componentName)) {
                Registry.register(componentName, component);
            }

            const baseAttrs = {
                key: componentName,
                element: 'CustomElement',
                type: 'custom',
                field_name: component.register.name,
            };

            return { ...baseAttrs, ...component.register };
        });

        setItems(newItems);

        ElementStore.subscribe((allTheThings) => {
            const { data } = allTheThings;

            if (data.length > 0) {
                setForm(data);
                fireSaveForm({ params: { form: data } });
            }
        });
    }, []);

    useEffect(() => {
        setForm(fields);
        setLoaded(true);
    }, [fields]);

    const formLoaded = useMemo(() => {
        return formLoading && loaded;
    }, [formLoading, loaded]);

    return [
        { form, items, formLoading, formLoaded, loaded, saving, savedData: data },
        { setForm, fireLoadForm },
    ];
};

export default useFormBuilder;
