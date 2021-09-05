import React, { useEffect, useMemo } from "react";
import PageLayout from "../../../../layouts/PageLayout";
import Form from "components/elements/Form";
import "../edit/style.scss";
import RenderForm from "./RenderForm";
import useFormBuilder from "../../../../hooks/useFormBuilder";
import SubmitButton from "../../../../components/elements/SubmitButton";

const FormView = ({
    match: {
        params: { form_slug },
    },
}) => {
    const [{ form, formLoading, saving }, { fireLoadForm }] = useFormBuilder({
        formId: form_slug,
    });

    useEffect(() => {
        if (!form_slug) {
            throw new Error({
                code: 403,
                message: "missing/ invalid form name",
            });
        }

        fireLoadForm();
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
        console.log("handleSubmit11.ff", JSON.stringify(ff), ff);
        // TODO :: send the form data to the api to persist the form data basically do
        // the same as the form change function except this could mark the form done
    };

    const handleFormChange = (ff) => {
        console.log("handleFormChange.ff", JSON.stringify(ff), ff);
        // TODO :: send the form data to the api to persist the form data
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
