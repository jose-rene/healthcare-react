import React from "react";

import { Button } from "components";

import { useFormContext } from "Context/FormContext";

const FormButtons = ({ submitLabel = "Submit", cancelLabel = "Cancel" }) => {
    const { clear } = useFormContext();

    return (
        <div className="d-flex">
            <Button className="py-2" variant="secondary" onClick={clear}>
                {cancelLabel}
            </Button>
            <Button className="ms-auto py-2" variant="primary" type="Submit">
                {submitLabel}
            </Button>
        </div>
    );
};

FormButtons.displayName = "FormButtons";

export default React.forwardRef(FormButtons);
