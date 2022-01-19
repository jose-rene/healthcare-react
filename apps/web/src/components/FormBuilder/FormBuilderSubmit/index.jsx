import React from "react";
import { useFormContext } from "../../../Context/FormContext";
import { useFormBuilderFieldContext } from "../context/FormBuilderFieldContext";
import SubmitButton from "../../elements/SubmitButton";

/**
 * Acts like the form submit button for the form builder built forms.
 * @param _onClick
 * @return {JSX.Element}
 * @constructor
 */
const FormBuilderSubmit = ({ onClick: _onClick = undefined }) => {
    const { addPreSubmitCallback } = useFormContext();
    const { mergeAnswers } = useFormBuilderFieldContext();

    const handleOnClick = () => {
        addPreSubmitCallback(({ form: answers = {} }) => {
            return mergeAnswers({ answers });
        });

        if (_onClick) {
            _onClick();
        }
    };

    return <SubmitButton onClick={handleOnClick} />;
};

export default FormBuilderSubmit;
