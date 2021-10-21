import React from "react";
import PageLayout from "../../layouts/PageLayout";
import { Container } from "react-bootstrap";
import RenderForms from "./RenderForms";
import FormProgressProvider from "../../Context/FormProgress";

const FormWizard = ({ history }) => {

    const sections = {
        first: {
            label: "first section",
            isCompleted: false,
        },
        second: {
            label: "second section",
            isCompleted: false,
        },
    };

    return (
        <PageLayout loading={false}>
            <Container>
                <FormProgressProvider sections={sections}>
                    Form Wizard Page

                    <RenderForms />
                </FormProgressProvider>
            </Container>
        </PageLayout>
    );
};

export default FormWizard;
