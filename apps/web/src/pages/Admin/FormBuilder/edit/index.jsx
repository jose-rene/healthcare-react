import React, { useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout";
import Form from "components/elements/Form";
import { ReactFormBuilder } from "react-form-builder3";
import FormElementsEdit from "components/forms/form-builder/field-edit-page";
import "./style.scss";
import useFormBuilder from "../../../../hooks/useFormBuilder";

const FormBuilderEdit = (props) => {
    const {
        history,
        match: {
            params: { form_slug },
        },
    } = props;

    const [{ items, form, formLoaded }, { fireLoadForm }] = useFormBuilder({
        form_slug,
    });

    useEffect(() => {
        if (!form_slug) {
            console.log("missing form_slug");
        } else {
            fireLoadForm().catch((eee) => {
                history.push("/admin/forms?message=edit-bad-form-slug");
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!form_slug) {
        return null;
    }

    return (
        <PageLayout>
            <div className="bg-white gry-editor">
                <h3>Editor</h3>
                {!formLoaded && (
                    <Form editing>
                        <ReactFormBuilder
                            hideGrip={true}
                            edit
                            data={form}
                            toolbarItems={items}
                            renderEditForm={(props) => (
                                <FormElementsEdit {...props} />
                            )}
                        />
                    </Form>
                )}
            </div>
        </PageLayout>
    );
};

export default FormBuilderEdit;
