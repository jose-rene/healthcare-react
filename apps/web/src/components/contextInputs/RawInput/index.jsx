import React from "react";
import { FormControl } from "react-bootstrap";
import { useFormContext } from "../../../Context/FormContext";

const RawInput = ({ name, customRule, type = "text", error, ...props }) => {
    const { getValue, onChange, getError, autocomplete } = useFormContext();

    // const errorBlock = useMemo(() => {
    //     if (!error) {
    //         return null;
    //     }

    //     return (
    //         <Form.Control.Feedback type="invalid" className="error">
    //             {error}
    //         </Form.Control.Feedback>
    //     );

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [error]);

    if (autocomplete) {
        props.autocomplete = autocomplete === false ? "off" : autocomplete;
    }

    const value = getValue(name);
    const errorMessage = getError({ name });

    props.value = value;
    props.onChange = onChange;

    if (errorMessage) {
        props.error = errorMessage;
    }

    return <FormControl name={name} type={type} {...props} />;
};

export default RawInput;
