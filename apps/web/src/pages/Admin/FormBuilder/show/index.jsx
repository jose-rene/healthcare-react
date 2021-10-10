import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../layouts/PageLayout";
import Form from "components/elements/Form";
import "../edit/style.scss";
import RenderForm from "./RenderForm";
import useFormBuilder from "../../../../hooks/useFormBuilder";
import SubmitButton from "../../../../components/elements/SubmitButton";
import { _GET } from "../../../../helpers/request";

const FormView = ({
    match: {
        params: { form_slug },
    },
}) => {
    const [formDataLoaded, setFormDataLoaded] = useState(false);
    const [{ form, defaultAnswers, formLoading, saving }, { fireLoadForm, fireSaveAnswers }] = useFormBuilder({
        formId: form_slug,
    });
    const [requestId, setRequestId] = useState(-1);

    useEffect(() => {
        if (!form_slug) {
            throw new Error({
                code: 403,
                message: "missing/ invalid form name",
            });
        }

        fireLoadForm().then(() => {
            setTimeout(() => {
                setFormDataLoaded(true);
            }, 500);
        });

        const getRequestId = _GET("request_id");
        setRequestId(getRequestId);

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
        fireSaveAnswers({ ...ff, completed_form: true, request_id: requestId });
    };

    const handleFormChange = async (ff) => {
        if (!formDataLoaded) {
            return false; // answers are not done loaded don't auto save yet.
        }
        fireSaveAnswers(ff, { quickSave: true, request_id: requestId });
    };

    if (formLoading || !form_slug) {
        return null;
    }

    return (
        <PageLayout>
            <div className="container mt-3">
                <h3>Show</h3>
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
            </div>
        </PageLayout>
    );
};

export default FormView;
