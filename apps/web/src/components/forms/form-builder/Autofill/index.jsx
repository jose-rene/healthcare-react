import React from "react";
import Textarea from "../../../inputs/Textarea";

const Autofill = ({
    element,
    name = "autofill",
    updateElement,
    eventKey,
    onChange,
    ...props
}) => {
    const { props: { [name]: autofill = "" } = "" } = element || {};

    const helpText = `Each row is evaluated and the first row that returns a string, that string will be this fields value`;

    return (
        <Textarea
            label="Autofill"
            value={autofill}
            name={name}
            rows={10}
            style={{ height: 50 }}
            helpText={helpText}
            onChange={onChange}
            {...props}
        />
    );
};

export default Autofill;
