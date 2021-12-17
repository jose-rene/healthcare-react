import React, { useEffect } from "react";

import { useFormContext } from "Context/FormContext";

import ContextInput from "components/inputs/ContextInput";

const PasswordForm = ({ passwordChecking, password }) => {
    const { getValue } = useFormContext();

    useEffect(() => {
        // console.log(getValue("password_confirmation"), password_confirmation);
        password.current = getValue("password");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getValue("password")]);

    return (
        <div className="col-md-6">
            <ContextInput
                disabled={passwordChecking}
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your new password"
                style={{ height: "56px" }}
            />
            <ContextInput
                disabled={passwordChecking}
                label="Password Confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Enter your new password again"
                style={{ height: "56px" }}
            />
        </div>
    );
};

export default PasswordForm;
