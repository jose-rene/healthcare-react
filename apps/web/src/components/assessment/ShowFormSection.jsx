import React, { useState, useEffect } from "react";
import useFormBuilder from "../../hooks/useFormBuilder";
import Form from "../elements/Form";
import RenderForm from "../FormBuilder/RenderForm";
import FormLoadingSpinner from "../forms/FormLoadingSpinner";
import FormBuilderWrapper from "../FormBuilder/FormBuilderWrapper";
import { useAssessmentContext } from "../../Context/AssessmentContext";

const ShowFormSection = ({ requestId, formSlug, onSubmit }) => {
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const { update: assetUpdate } = useAssessmentContext();

    const formBuilderHook = useFormBuilder({
        form_slug: formSlug,
        request_id: requestId,
    });
    const [
        { form, fieldAutofill, defaultAnswers, formLoading, validation },
        { fireLoadForm, fireSaveAnswers },
    ] = formBuilderHook;

    useEffect(() => {
        assetUpdate(formSlug, { ...defaultAnswers });
    }, [defaultAnswers]);

    useEffect(() => {
        (async () => {
            try {
                await fireLoadForm();

                setTimeout(() => {
                    setFormDataLoaded(true);
                }, 500);
            } catch (e) {}
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (formValues) => {
        const values = { ...formValues, completed_form: true };
        assetUpdate(formSlug, values);
        await fireSaveAnswers(values);
        onSubmit();
    };

    const handleFormChange = (formValues) => {
        if (!formDataLoaded) {
            return false;
        }

        assetUpdate(formSlug, formValues);
        fireSaveAnswers({ ...formValues, completed_form: false });
    };

    return (
        <div className="container">
            {formLoading && <FormLoadingSpinner />}
            {(!formLoading && form.length) > 0 && (
                <Form
                    formBuilder
                    onChange={handleFormChange}
                    defaultData={defaultAnswers}
                    validation={validation}
                    autocomplete="off"
                    onSubmit={handleSubmit}
                    autoFiller={fieldAutofill}
                >
                    <FormBuilderWrapper
                        fields={form}
                        formBuilderHook={formBuilderHook}
                        showSubmit
                    >
                        <FormBuilderWrapper
                            fields={form}
                            formBuilderHook={formBuilderHook}
                        >
                            <RenderForm />
                        </FormBuilderWrapper>
                    </FormBuilderWrapper>
                </Form>
            )}
        </div>
    );
};

export default ShowFormSection;
