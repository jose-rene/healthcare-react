import React from 'react';
import Button from "../../inputs/Button";

const SubmitButton = ({
    title = "Submit",
    loading = false,
    disabled = false,
    children,
    ...otherProps
}) => {
    return (
        <Button
            variant="primary"
            type="submit"
            label={title}
            className="btn-sign-in"
            disabled={disabled || loading}
            loading={loading}
            {...otherProps}
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
