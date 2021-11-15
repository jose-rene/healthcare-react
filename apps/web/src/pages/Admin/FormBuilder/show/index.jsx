import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../layouts/PageLayout";
import Form from "components/elements/Form";
import "../edit/style.scss";
import useFormBuilder from "../../../../hooks/useFormBuilder";
import SubmitButton from "../../../../components/elements/SubmitButton";
import RenderForm from "../../../../components/FormBuilder/RenderForm";

const FormView = ({
    match: {
        params: { form_slug },
    },
}) => {
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const [formTitle, setFormTitle] = useState(null);
    const [{ form, defaultAnswers, formLoading, saving }, { fireLoadForm }] = useFormBuilder({
        form_slug,
    });
    const [formSaves, setFormSaves] = useState([]);
    const [autoSaveCount, setAutoSaveCount] = useState(0);

    const revFormSaves = useMemo(() => {
        return [...formSaves].reverse();
    }, [formSaves]);

    const pushFormSave = (obj, action = "n/a", autoIncrement = true) => {
        if (autoIncrement) {
            setAutoSaveCount(prev => prev + 1);
        }
        setFormSaves([...formSaves, { action, ...obj }]);
    };

    useEffect(() => {
        if (!form_slug) {
            throw new Error({
                code: 403,
                message: "missing/invalid form name",
            });
        }

        (async () => {
            const { name } = await fireLoadForm();
            setFormTitle(name);

            pushFormSave({ log: "form data loaded" }, "loaded", false);

            setTimeout(() => {
                setFormDataLoaded(true);
            }, 500);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // maps field validation to validation object
    const validation = useMemo(() => {
        const returnCustomValidation = {};

        form.forEach(({ custom_name, props }) => {
            const { customValidation } = props || {};

            if (!customValidation) {
                return true;
            }

            returnCustomValidation[custom_name] = {
                customRule: customValidation,
            };
        });

        return returnCustomValidation;
    }, [form]);

    const handleSubmit = (ff) => {
        pushFormSave({ ...ff, saveOptions: { quickSave: false } }, "complete-form");
    };

    const handleFormChange = async (ff) => {
        if (!formDataLoaded) {
            return false; // answers are not done loaded don't auto save yet.
        }

        pushFormSave({ ...ff, saveOptions: { quickSave: true } }, "quick-save");
    };

    if (formLoading || !form_slug) {
        return null;
    }

    return (
        <PageLayout>
            <div className="container mt-3">
                <h3>Form Demo {formTitle && <>- {formTitle}</>}</h3>
                <hr />
                {form.length > 0 && (
                    <Form
                        onFormChange={handleFormChange}
                        onSubmit={handleSubmit}
                        validation={validation}
                        autocomplete="off"
                        defaultData={defaultAnswers}
                    >
                        <RenderForm formElements={form} />

                        <SubmitButton loading={saving} />
                    </Form>
                )}

                <div className="my-3 p3">
                    <h3>
                        This is a demo of the built form answers.
                    </h3>
                    <p className="text-muted">
                        The submit button will not actually save
                        answers to the database. But, you can view what would save below.
                    </p>

                    <p>
                        autoSaveCount: {autoSaveCount}
                    </p>

                    <pre>
                        {JSON.stringify(revFormSaves, null, 2)}
                    </pre>
                </div>
            </div>
        </PageLayout>
    );
};

export default FormView;
