import React, { useEffect } from "react";
import { ReactFormBuilder } from "react-form-builder3";
import { Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import FormElementsEdit from "components/forms/form-builder/field-edit-page";
import ButtonWithDropdown from "components/elements/ButtonWithDropdown";

import useApiCall from "hooks/useApiCall";
import useFormBuilder from "hooks/useFormBuilder";

import { PUT } from "config/URLs";

import "./style.scss";

const FormBuilderEdit = (props) => {
    const {
        history,
        match: {
            params: { form_slug },
        },
    } = props;

    const [{ items, form, formLoaded, formRevisions }, { fireLoadForm }] =
        useFormBuilder({
            form_slug,
        });

    const [{ loading: tagging }, fireTagForm] = useApiCall({
        url: `form/${form_slug}/snapshot`,
        method: PUT,
    });

    const [{ loading: rollingBack }, fireRollbackForm] = useApiCall({
        url: `form/${form_slug}/rollback`,
        method: PUT,
    });

    const handleTavVersionClicked = async (attrs) => {
        const { button, buttonProps } = attrs;

        if (button === "option") {
            await fireRollbackForm({
                params: {
                    revision_id: buttonProps.id,
                },
            });
            await fireLoadForm();
            return true;
        }

        await fireTagForm();
        await fireLoadForm();
    };

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
                <Row className="mb-3">
                    <Col md={1}>
                        <h3>Editor</h3>
                    </Col>
                    <Col>
                        <ButtonWithDropdown
                            className="float-left"
                            label="Tag version"
                            disabled={tagging || rollingBack}
                            options={formRevisions.map((fR) => ({
                                text: fR.created_at,
                                ...fR,
                            }))}
                            onClick={handleTavVersionClicked}
                        />
                    </Col>
                </Row>

                {!formLoaded && (
                    <Form editing>
                        <ReactFormBuilder
                            hideGrip={true}
                            edit
                            data={form}
                            toolbarItems={items}
                            renderEditForm={(props) => {
                                return <FormElementsEdit {...props} />;
                            }}
                        />
                    </Form>
                )}
            </div>
        </PageLayout>
    );
};

export default FormBuilderEdit;
