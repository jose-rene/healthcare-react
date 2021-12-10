import { get } from "lodash";
import React, { useEffect, useState } from "react";

import { useFormContext } from "Context/FormContext";

import useApiCall from "hooks/useApiCall";

import Icon from "../elements/Icon";

/**
 * @link http://localhost:3000password/change?token=d633e4428b78035328a3bba3542ac565b93d612f3a9640ec5a2e98f56227fa3b&email=admin%40admin.com
 * @design https://www.figma.com/file/gWgwLxXMMC7gtuPH1smprN/Password?node-id=0%3A1
 * @param {string} password
 * @param {string} password_confirmation
 * @param {string=} token
 * @param {string=} email
 * @param {function} primaryValid true or false is passed as a parameter
 * @param {function} secondaryChecking loading state this check calls the api
 * @param {function=} secondaryValid true or false is passed as a parameter
 * @param {boolean=} secondaryRules this is a boolean value if false then the server side secondary checks are not done or displayed
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordRequirements = ({
    primaryValid = () => {},
    secondaryChecking = () => {},
    secondaryValid = () => {},
    secondaryRules = false,
    token = undefined,
    email = undefined,
}) => {
    const { getValue } = useFormContext();

    const password = getValue("password");
    const password_confirmation = getValue("password_confirmation");

    const [triggered, setTriggered] = useState(false);
    const [{ loading: secondaryLoading }, fireSecondaryCheck] = useApiCall({
        url: "password/history/check",
    });

    const [primaryValidated, setPrimaryValidated] = useState({});
    const [primaryDone, setPrimaryDone] = useState(false);
    const [secondaryFails, setSecondaryFails] = useState({});

    const primaryRuleSet = [
        {
            label: "Must have at least 8 letters",
            check: (_password) => _password.length >= 8,
        },
        {
            label: "At least one upper case letter",
            check: (_password) => !!_password.match(/[A-Z]/),
        },
        {
            label: "At least one lower case letter",
            check: (_password) => !!_password.match(/[a-z]/),
        },
        {
            label: "At least one number",
            check: (_password) => !!_password.match(/[0-9]/),
        },
        {
            label: "Confirm password matches",
            check: (_password, password_confirmation) =>
                _password.length > 1 && password === password_confirmation,
        },
    ];

    const secondaryRuleSet = [
        {
            label: "Cannot use the last 6 passwords",
        },
        {
            label: "Must not include three or more contiguous characters of your account name or full name.",
        },
    ];

    useEffect(() => {
        if (password || password_confirmation) {
            setTriggered(true);
        }

        let passCount = 0;

        const checked = primaryRuleSet.map((r, index) => {
            const passed = r.check(password, password_confirmation);
            if (passed) {
                passCount++;
            }
            return passed;
        });

        setPrimaryValidated(checked);
        setPrimaryDone(passCount === primaryRuleSet.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, password_confirmation]);

    useEffect(() => {
        return () => {
            setTriggered(false);
        };
    }, []);

    useEffect(() => {
        secondaryValid(false);
        (async () => {
            primaryValid(primaryDone);
            setSecondaryFails({});
            if (primaryDone && secondaryRules) {
                try {
                    const response = await fireSecondaryCheck({
                        params: {
                            email,
                            password,
                            password_confirmation,
                            token,
                        },
                    });
                    secondaryValid(response);
                    secondaryValid(true);
                } catch (e) {
                    const passwordValidation = get(
                        e,
                        "response.data.errors.password",
                        false
                    );
                    const {
                        response: { status },
                    } = e;
                    switch (status) {
                        case 422:
                            const failed = {};
                            secondaryValid(false);
                            secondaryRuleSet.forEach(({ label }) => {
                                const foundRule = passwordValidation.findIndex(
                                    (p) => p === label
                                );
                                if (foundRule >= 0) {
                                    failed[foundRule] = false;
                                }
                            });
                            setSecondaryFails(failed);

                            break;

                        default:
                            return;
                    }
                }
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [primaryDone]);

    useEffect(() => {
        secondaryChecking(secondaryLoading);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondaryLoading]);

    const icon = (i) => {
        const ruleIndexCheck = primaryValidated[i];

        if (!triggered) {
            return <Icon icon="circle" iconType="r" className="text-primary" />;
        }

        return ruleIndexCheck ? (
            <Icon icon="check-circle" iconType="r" className="text-primary" />
        ) : (
            <Icon icon="exclamation-triangle" className="text-primary" />
        );
    };

    const secondaryIcon = (rule, i) => {
        const ruleIndexCheck = secondaryFails[i];

        if (!primaryDone || !triggered) {
            return <Icon icon="circle" iconType="r" className="text-primary" />;
        }

        return ruleIndexCheck === undefined ? (
            <Icon icon="check-circle" iconType="r" className="text-primary" />
        ) : (
            <Icon icon="exclamation-triangle" className="text-primary" />
        );
    };

    return (
        <>
            <h3>Password Requirements</h3>
            <ul className="password-requirements list-unstyled">
                {primaryRuleSet.map((rule, i) => (
                    <li key={`password-requirement-${i}`}>
                        <div className="row">
                            <div className="col-1 pe-3">{icon(i)}</div>
                            <div className="col">{rule.label}</div>
                        </div>
                    </li>
                ))}

                {secondaryRules &&
                    secondaryRuleSet.map((rule, i) => (
                        <li key={`password-requirement-${i}`}>
                            <div className="row">
                                <div className="col-1 pe-3">
                                    {secondaryIcon(rule, i)}
                                </div>
                                <div className="col">{rule.label}</div>
                            </div>
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default PasswordRequirements;
