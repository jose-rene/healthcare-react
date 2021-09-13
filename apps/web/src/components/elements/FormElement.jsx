import React from "react";
import CustomFormElements from "../FormBuilder/Fields";
// import ContextInput from "../inputs/ContextInput";

const FormElement = ({ elementType, id, custom_name, label, customRule, customValidation, ...data }) => {
    const element = CustomFormElements[elementType];
    // console.log("props -> ", { props });
    switch (elementType) {
        // case "GryInput":
        //    return <ContextInput {...props} />
        default:
            try {
                return element({ elementType, id, custom_name, label, customRule, customValidation, data });
            } catch (e) {
                console.log(`fail.${elementType}`, { e });
                return <div>{`Invalid element: ${elementType}`}</div>;
            }
    }
};

export default FormElement;
