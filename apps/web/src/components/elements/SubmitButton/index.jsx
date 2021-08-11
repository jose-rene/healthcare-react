import React from "react";
import { Button } from "components/index";

const SubmitButton = ({
    title = "Submit",
    loading = false,
    disabled = false,
    children,
    ...otherProps
}) => {

    return (
        <Button
            type="submit"
            label={title}
            disabled={disabled || loading}
            loading={loading}
            {...{variant: 'primary', ...otherProps}}
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
