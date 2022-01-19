import React from "react";
import Textarea from "../../../inputs/Textarea";

const CustomRule = ({
    element,
    name = 'customRule',
    updateElement,
    eventKey,
    ...props
}) => {
    const { props: { [name]: customRule = '' } = '' } = element || {};

    return (
        <Textarea
            label="Special Rules(hide show logic)"
            value={customRule}
            name="customRule"
            rows={5}
            helpText={<>When this condition is <u><strong>false</strong></u> this field will not show up. Variables
                must start with ~ for example ~first_name</>}
            {...props}
        />
    );
};

export default CustomRule;
