import React, { useEffect } from "react";
import ContextInput from "../ContextInput";
import { useFormContext } from "../../../Context/FormContext";

const PhoneInput = ({ name, placeholder = "(999) 999-9999", ...props }) => {
    const { addFormatData } = useFormContext();

    useEffect(() => {
        addFormatData(name, (form, getValue, fieldName) => {
            const value = getValue(name, "");

            return { ...form, [fieldName]: value.replace(/\D/g, "") };
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    props.mask = placeholder;

    return <ContextInput {...props} name={name} />;
};

export default PhoneInput;
