import React from "react";
import { Button } from "components/index";

const SubmitButton = ({
    title = "Submit",
    loading = false,
    disabled = false,
    name = undefined,
    children,
    ...otherProps
}) => {
    return (
        <Button
            name={name}
            iconSize={"1x"}
            type="submit"
            label={title}
            disabled={disabled || loading}
            loading={loading}
            {...{ variant: "primary", ...otherProps }}
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
