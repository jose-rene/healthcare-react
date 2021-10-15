import React, { useEffect } from "react";
import ContextInput from "../ContextInput";
import { useFormContext } from "../../../Context/FormContext";
import { set } from "lodash";

const PhoneInput = ({ name, placeholder = "(999) 999-9999", ...props }) => {
    const { addFormatData } = useFormContext();

    useEffect(() => {
        addFormatData(name, (form, getValue) => {
            const oldForm = { ...form };
            const value = getValue(name, "").replace(/\D/g, "");
            set(oldForm, name, value);

            return oldForm;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    props.mask = placeholder;

    return <ContextInput {...props} name={name} />;
};

export default PhoneInput;
