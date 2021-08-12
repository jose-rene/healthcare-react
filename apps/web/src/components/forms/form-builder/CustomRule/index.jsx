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
            label="Special Rules"
            value={customRule}
            name="customRule"
            rows={5}
            helpText={<>When this condition is <u><strong>false</strong></u> this field will not show up</>}
            {...props}
        />
    );
};

export default CustomRule;
