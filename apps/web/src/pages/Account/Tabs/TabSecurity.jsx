import React, { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import InputText from "components/inputs/ContextInput";
import { useUser } from "../../../Context/UserContext";
import Form from "../../../components/elements/Form";
import SubmitButton from "../../../components/elements/SubmitButton";
import { REQUIRED } from "../../../Context/FormContext";
import useApiCall from "../../../hooks/useApiCall";
import { PUT } from "../../../config/URLs";
import ApiValidationErrors from "../../../components/request/ApiValidationErrors";

const TabSecurity = ({ history }) => {
    const { getUser } = useUser();
    const { email } = getUser();
    const [{ loading }, fireUpdatePassword] = useApiCall({
        method: PUT,
        url: "user/password-confirmed",
    });
    const [formValues, setFormValues] = useState({ email });
    const [errors, setErrors] = useState({});

    const validation = {
        current_password: { rules: [REQUIRED] },
        password: {
            rules: [REQUIRED],

            callback: (form) => {
                const { password = "", password_confirmation = "1" } = form;

                return password === password_confirmation
                    ? true
                    : "Password and password confirmation must match";
            },
        },
        password_confirmation: {
            rules: [REQUIRED],
        },
    };

    const handleSubmit = async (params) => {
        setFormValues(params);
        setErrors({});
        try {
            await fireUpdatePassword({ params });
            history.push("/");
        } catch (e) {
            const { errors = {} } = e.response?.data || {};

            setErrors(errors);
        }
    };

    return (
        <Container>
            <Form
                onSubmit={handleSubmit}
                defaultData={formValues}
                validation={validation}
            >
                <ApiValidationErrors errors={errors} />
                <Row>
                    <Col md={12}>
                        <div className="box-same-line">
                            <h2 className="box-inside-title">
                                Change Password
                            </h2>
                        </div>
                    </Col>

                    <Col md={{ offset: 3, span: 6 }}>
                        <InputText name="email" label="Email" type="email" />
                    </Col>

                    <Col md={{ offset: 3, span: 6 }}>
                        <InputText
                            name="current_password"
                            type="password"
                            label="Current Password"
                        />
                    </Col>

                    <Col md={{ offset: 3, span: 6 }}>
                        <InputText
                            name="password"
                            type="password"
                            label="New Password"
                        />
                    </Col>

                    <Col md={{ offset: 3, span: 6 }}>
                        <InputText
                            name="password_confirmation"
                            type="password"
                            label="Confirm New Password"
                        />
                    </Col>

                    <Col md={12}>
                        <SubmitButton
                            title="Change Password"
                            loading={loading}
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default TabSecurity;
