import React from "react";
import CustomFormElements from "../FormBuilder/Fields";
// import ContextInput from "../inputs/ContextInput";

const FormElement = ({ elementType, id, custom_name, label, customRule, customValidation }) => {
    const element = CustomFormElements[elementType];
    // console.log("props -> ", { props });
    switch (elementType) {
        // case "GryInput":
        //    return <ContextInput {...props} />
        default:
            try {
                return element({ elementType, id, custom_name, label, customRule, customValidation });
            } catch (e) {
                return <div>{`Invalid element: ${elementType}`}</div>;
            }
    }
};

export default FormElement;
