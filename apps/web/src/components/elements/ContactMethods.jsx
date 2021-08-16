import React, { useMemo } from "react";
import { isEmpty } from "lodash";
import Select from "../inputs/Select";
import InputText from "../inputs/ContextInput";
import Button from "../inputs/Button";
import types from "../../config/Types.json";
import Form from "./Form";

const ContactMethods = ({
    contactMethods,
    setContactMethods,
    setContactMethodsValue,
}) => {

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
        return contactMethods.map(({ type, phone_email }, index) => (
            <div className="row" key={type}>
                <div className="col-md-4">
                    <Select
                        name={`${index}[${type}]`}
                        label="Type*"
                        options={typesOptions}
                        required
                        //errors={errors}
                        //ref={register({
                        //    required: "Type is required",
                        //})}
                        //onChange={setContactMethodsValue}
                    />
                </div>

                <div className="col-md-4">
                    <InputText
                        name={`${index}[${phone_email}]`}
                        label="Phone/Email*"
                        //errors={errors}
                        //ref={register({
                        //    required: "Phone/Email is required",
                        //})}
                        //onChange={setContactMethodsValue}
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
            </div>
        ));
    };

    const addNewContactMethod = () => {
        const oldContactMethods = contactMethods;

        oldContactMethods.push({});

        setContactMethods(oldContactMethods);
    };

    const removeContactMethod = (type) => {
        const filtered = contactMethods.filter((item) => {
            return type !== item.type;
        });

        setContactMethods(filtered);
    };

    const handleContactSave = (formData) => {
        // TODO :: handleContactSave
        console.log("handleContactSave", { formData });
        //setContactMethods(formData);
    };

    return (
        <Form onFormChange={handleContactSave}>
            {renderContactMethods()}

            <div className="col-md-12 mb-3">
                <Button
                    variant="primary-outline"
                    block
                    onClick={() => addNewContactMethod()}
                >
                    + Add new contact method
                </Button>
            </div>
        </Form>
    );
};

export default ContactMethods;
