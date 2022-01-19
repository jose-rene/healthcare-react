import React, { useState, useEffect } from "react";
import PageLayout from "../../../layouts/PageLayout";
import useFormBuilder from "../../../hooks/useFormBuilder";
import Form from "../../../components/elements/Form";
import RenderForm from "../../../components/FormBuilder/RenderForm";
import FormLoadingSpinner from "../../../components/forms/FormLoadingSpinner";
import FormBuilderWrapper from "../../../components/FormBuilder/FormBuilderWrapper";

const RequestSectionsShowForm = (props) => {
    const { params } = props.match;
    const { request_id, form_slug } = params;

    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const formBuilderHook = useFormBuilder({
        form_slug,
        request_id,
    });

    const [
        { form, defaultAnswers, formLoading },
        { fireLoadForm, fireSaveAnswers },
    ] = formBuilderHook;

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

    return (
        <PageLayout>
            <div className="container mt-3">
                {formLoading && <FormLoadingSpinner />}
                {(!formLoading && form.length) > 0 && (
                    <Form
                        onChange={handleFormChange}
                        defaultData={defaultAnswers}
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
        </PageLayout>
    );
};

export default RequestSectionsShowForm;
