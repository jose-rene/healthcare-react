import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import Select from "../inputs/Select";
import InputText from "../inputs/InputText";
import Button from "../inputs/Button";

import types from "../../config/Types.json";

const ContactMethods = ({
    contactMethods,
    setContactMethods,
    setContactMethodsValue,
}) => {
    const { register, errors } = useForm();

    const typesOptions = useMemo(() => {
        if (isEmpty(types)) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(types)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [types]);

    const renderContactMethods = () => {
        return contactMethods.map(({ type, phone_email }) => (
            <React.Fragment key={type}>
                <div className="col-md-4">
                    <Select
                        name={type}
                        label="Type*"
                        options={typesOptions}
                        errors={errors}
                        ref={register({
                            required: "Type is required",
                        })}
                        onChange={setContactMethodsValue}
                    />
                </div>

                <div className="col-md-4">
                    <InputText
                        name={phone_email}
                        label="Phone/Email*"
                        errors={errors}
                        ref={register({
                            required: "Phone/Email is required",
                        })}
                        onChange={setContactMethodsValue}
                    />
                </div>

                {contactMethods.length > 1 && (
                    <div className="col-md-4">
                        <Button
                            className="btn btn-zip btn-danger px-1"
                            label="remove"
                            icon="cancel"
                            iconSize="1x"
                            onClick={() => removeContactMethod(type)}
                        />
                    </div>
                )}
            </React.Fragment>
        ));
    };

    const addNewContactMethod = () => {
        const len = contactMethods.length;
        setContactMethods([
            ...contactMethods,
            { type: `type_${len}`, phone_email: `phone_email_${len}` },
        ]);
    };

    const removeContactMethod = (type) => {
        const filtered = contactMethods.filter((item) => {
            return type !== item.type;
        });

        setContactMethods(filtered);
    };

    return (
        <>
            {renderContactMethods()}

            <div className="col-md-12 mb-3">
                <Button
                    className="btn btn-block btn-add-method"
                    onClick={() => addNewContactMethod()}
                >
                    + Add new contact method
                </Button>
            </div>
        </>
    );
};

export default ContactMethods;
