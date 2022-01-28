import React, { useState, useEffect, useMemo } from "react";
import useFormBuilder from "../../hooks/useFormBuilder";
import Form from "../elements/Form";
import RenderForm from "../FormBuilder/RenderForm";
import FormLoadingSpinner from "../forms/FormLoadingSpinner";
import FormBuilderWrapper from "../FormBuilder/FormBuilderWrapper";
import { useAssessmentContext } from "../../Context/AssessmentContext";

const ShowFormSection = ({ requestId, formSlug, name, onSubmit }) => {
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const { update: assetUpdate, sectionsCompleted } = useAssessmentContext();
    const formBuilderHook = useFormBuilder({
        form_slug: formSlug,
        request_id: requestId,
    });
    const [
        { form, defaultAnswers, formLoading },
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
                    onChange={handleFormChange}
                    defaultData={defaultAnswers}
                    validation={validation}
                    autocomplete="off"
                    onSubmit={handleSubmit}
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
        </div>
    );
};

export default ShowFormSection;
