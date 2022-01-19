import React from "react";
import { Form as BSForm } from "react-bootstrap";
import FormProvider, { useFormContext } from "../../Context/FormContext";

const BootstrapWrap = ({ handleSubmit, children, bsFormProps = {} }) => {
    const { onSubmit } = useFormContext();

    return (
        <BSForm
            noValidate
            method="post"
            onSubmit={(e) => handleSubmit(e, onSubmit)}
            {...bsFormProps}
        >
            {children}
        </BSForm>
    );
};

const Form = ({
    autocomplete = undefined,
    children,
    onSubmit,
    defaultData = {},
    validation = {},
    editing = false,
    bsFormProps = {},
    formBuilder = false,
    ...props
}) => {
    const handleSubmit = (e, submit) => {
        e.preventDefault();

        submit();
    };

    return (
        <FormProvider
            onSubmit={onSubmit}
            defaultData={defaultData}
            validation={validation}
            editing={editing}
            autocomplete={autocomplete}
            formBuilder={formBuilder}
            {...props}
        >
            <BootstrapWrap
                handleSubmit={handleSubmit}
                autoComplete={autocomplete}
                bsFormProps={bsFormProps}
            >
                {children}
            </BootstrapWrap>
        </FormProvider>
    );
};

export default Form;
