import React from "react";
import { FormBuilderProvider } from "../context/FormBuilderFieldContext";
import FormBuilderSubmit from "../FormBuilderSubmit";

const FormBuilderWrapper = ({
    fields = [],
    formBuilderHook,
    children,
    showSubmit = false,
}) => {
    return (
        <FormBuilderProvider fields={fields} formBuilderHook={formBuilderHook}>
            {children}

            {showSubmit && <FormBuilderSubmit />}
        </FormBuilderProvider>
    );
};

export default FormBuilderWrapper;
