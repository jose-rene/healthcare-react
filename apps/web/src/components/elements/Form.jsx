import React, { useState } from 'react';
import { Form as BSForm } from 'react-bootstrap';
import FormProvider, { useFormContext } from "../../Context/FormContext";

const BootstrapWrap = ({ validated, handleSubmit, children, bsFormProps = {} }) => {
    const { onSubmit } = useFormContext();

    return (
        <BSForm
            validated={validated}
            noValidate
            method="post"
            onSubmit={e => handleSubmit(e, onSubmit)}
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
    ...props
}) => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e, submit) => {
        e.preventDefault();
        const inputForm = e.currentTarget;

        if (inputForm.checkValidity() === false) {
            setValidated(true);
            return;
        }

        submit();
    };

    return (
        <FormProvider
            onSubmit={onSubmit}
            defaultData={defaultData}
            validation={validation}
            editing={editing}
            autoComplete={autocomplete}
            {...props}
        >
            <BootstrapWrap validated={validated} handleSubmit={handleSubmit} autoComplete={autocomplete}
                           bsFormProps={bsFormProps}>
                {children}
            </BootstrapWrap>
        </FormProvider>
    );
};

export default Form;
