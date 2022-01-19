import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../layouts/PageLayout";
import Form from "components/elements/Form";
import "../edit/style.scss";
import useFormBuilder from "../../../../hooks/useFormBuilder";
import RenderForm from "../../../../components/FormBuilder/RenderForm";
import FormBuilderWrapper from "../../../../components/FormBuilder/FormBuilderWrapper";

const FormView = ({
    match: {
        params: { form_slug },
    },
}) => {
    const formBuilderHook = useFormBuilder({ form_slug });
    const [
        { form, fieldAutofill, defaultAnswers, formLoading, validation },
        { fireLoadForm },
    ] = formBuilderHook;
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const [formTitle, setFormTitle] = useState(null);
    const [formSaves, setFormSaves] = useState([]);
    const [autoSaveCount, setAutoSaveCount] = useState(0);

    const revFormSaves = useMemo(() => {
        return [...formSaves].reverse();
    }, [formSaves]);

    const pushFormSave = (obj, action = "n/a", autoIncrement = true) => {
        if (autoIncrement) {
            setAutoSaveCount((prev) => prev + 1);
        }
        setFormSaves([...formSaves, { action, ...obj }]);
    };

    const handleLoadForm = async () => {
        const { name } = await fireLoadForm();
        setFormTitle(name);
        pushFormSave({ log: "form data loaded" }, "loaded", false);
        setFormDataLoaded(true);
    };

    useEffect(() => {
        handleLoadForm();
    }, []);

    const handleSubmit = (ff) => {
        pushFormSave(
            { ...ff, saveOptions: { quickSave: false } },
            "complete-form"
        );
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
                        formBuilder
                        onChange={handleFormChange}
                        onSubmit={handleSubmit}
                        validation={validation}
                        autocomplete="off"
                        defaultData={defaultAnswers}
                        autoFiller={fieldAutofill}
                    >
                        <FormBuilderWrapper
                            fields={form}
                            formBuilderHook={formBuilderHook}
                            showSubmit
                        >
                            <RenderForm />
                        </FormBuilderWrapper>
                    </Form>
                )}

                <div className="my-3 p3">
                    <h3>This is a demo of the built form answers.</h3>
                    <p className="text-muted">
                        The submit button will not actually save answers to the
                        database. But, you can view what would save below.
                    </p>

                    <div className="row">
                        <div className="col-md-6">
                            <p>autoSaveCount: {autoSaveCount}</p>
                            <pre>{JSON.stringify(revFormSaves, null, 2)}</pre>
                        </div>
                        <div className="col-md-6">
                            <h2>
                                Validation Rules, formDataLoaded:
                                {formDataLoaded ? "yes" : "no"}
                            </h2>
                            <pre>{JSON.stringify(validation, null, 2)}</pre>
                            <h2>Form</h2>
                            <pre>{JSON.stringify(form, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default FormView;
