import React, { useState, useEffect, useMemo } from "react";
import PageLayout from "../../../layouts/PageLayout";
import useFormBuilder from "../../../hooks/useFormBuilder";
import Form from "../../../components/elements/Form";
import RenderForm from "../../../components/FormBuilder/RenderForm";
import SubmitButton from "../../../components/elements/SubmitButton";
import FormLoadingSpinner from "../../../components/forms/FormLoadingSpinner";
import * as Yup from "yup";

const RequestSectionsShowForm = (props) => {
    const { params } = props.match;
    const { request_id, form_slug } = params;

    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const [
        { form, defaultAnswers, formLoading, saving },
        { fireLoadForm, fireSaveAnswers },
    ] = useFormBuilder({
        form_slug,
        request_id,
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

        form.forEach(({ custom_name = false, props }) => {
            const { customValidation, required, label = "This field" } = props || {};

            if (required) {
                returnCustomValidation[custom_name]["yupSchema"] = Yup.string().required(`${label} is required`);
            }

            if (!customValidation) {
                return true;
            }

            returnCustomValidation[custom_name]["customRule"] = customValidation;
        });

        return returnCustomValidation;
    }, [form]);

    const handleSubmit = (formValues) => {
        console.log("handleSubmit", { formValues });
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
        <PageLayout>
            <div className="container mt-3">
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

                        <SubmitButton loading={saving} />
                    </Form>
                )}
            </div>
        </PageLayout>
    );
};

export default RequestSectionsShowForm;
