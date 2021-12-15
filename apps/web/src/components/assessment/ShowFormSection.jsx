import React, { useState, useEffect, useMemo } from "react";
import useFormBuilder from "../../hooks/useFormBuilder";
import Form from "../elements/Form";
import RenderForm from "../FormBuilder/RenderForm";
import FormLoadingSpinner from "../forms/FormLoadingSpinner";

const ShowFormSection = ({ requestId, formSlug, name }) => {
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const [
        { form, defaultAnswers, formLoading },
        { fireLoadForm, fireSaveAnswers },
    ] = useFormBuilder({
        form_slug: formSlug,
        request_id: requestId,
    });

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

    const handleSubmit = (formValues) => {
        // console.log("handleSubmit", { formValues });
        fireSaveAnswers({ ...formValues, completed_form: true });
    };

    const handleFormChange = (formValues) => {
        if (!formDataLoaded) {
            return false;
        }

        fireSaveAnswers({ ...formValues, completed_form: false });
    };

    // TODO :: load form with answers
    // TODO :: render form using form show component

    return (
        <div className="container">
            {formLoading && <FormLoadingSpinner />}
            {(!formLoading && form.length) > 0 && (
                <Form
                    onFormChange={handleFormChange}
                    defaultData={defaultAnswers}
                    validation={validation}
                    autocomplete="off"
                    onSubmit={handleSubmit}
                >
                    <RenderForm formElements={form} />
                </Form>
            )}
        </div>
    );
};

export default ShowFormSection;
