import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useUser } from "Context/UserContext";

import { Button } from "components";
import ContextInput from "components/inputs/ContextInput";
import InputText from "components/inputs/InputText";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import ConfirmationModal from "components/elements/ConfirmationModal";
import ContextSelect from "components/contextInputs/Select";
import Form from "components/elements/Form";
import SubmitButton from "components/elements/SubmitButton";
import PhoneInput from "components/inputs/PhoneInput";
import MultiCheckbox from "components/inputs/Checkbox/MultiCheckbox";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

import { validateImage } from "helpers/validate";

import { PUT, DELETE } from "config/URLs";

/* eslint-disable jsx-a11y/anchor-is-valid */

const TabAccount = ({ history }) => {
    const { getUser, updateAvatarUrl } = useUser();
    const currentUser = getUser();
    const { avatar_url } = currentUser;

    const hiddenFileInput = useRef(null);

    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [imagePath, setImage] = useState(avatar_url);
    const [showModal, setShowModal] = useState(false);
    const { generalError, success } = useToast();

    useEffect(() => {
        setFormData(currentUser);
    }, [currentUser]);

    // need to check this api
    const [{ loading }, userImageSubmit] = useApiCall({
        method: "post",
        url: "user/profile-image",
        headers: { "Content-Type": "multipart/form-data" },
    });

    const [{ loading: saving }, fireSaveUserAccount] = useApiCall({
        method: PUT,
        url: `user/profile`,
    });

    const [{ loading: deactivating }, fireDeactivateUser] = useApiCall({
        method: DELETE,
        url: `profile`,
    });

    // need to implement form submit api
    const onSubmit = async (params) => {
        try {
            await fireSaveUserAccount({
                params,
            });

            success("User Saved");
            history.push("/");
        } catch (e) {
            generalError();
            console.log("save user error", { e });
        }
    };

    const onPhotoUpload = () => {
        hiddenFileInput.current.click();
        setFileUploadError(null);
    };

    const onFileChange = (event) => {
        const fileUploaded = event.target.files[0];
        const error = validateImage(fileUploaded);

        if (error) {
            setFileUploadError(error);
            return;
        }

        setSelectedFile(fileUploaded);
    };

    const handleFile = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", selectedFile.name);
        formData.append("mime_type", selectedFile.type);

        try {
            const result = await userImageSubmit({ params: formData });
            if (!loading && result) {
                setImage(result.url); // need to check the backend api
                updateAvatarUrl(result.url);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleActivation = async ({ onlyCancel = true } = {}) => {
        if (!onlyCancel) {
            try {
                await fireDeactivateUser();
                window.location.reload();
            } catch (e) {
                console.log("Deactivation failed");
                generalError();
                return false;
            }
        }
        setShowModal(!showModal);
    };

    useEffect(() => {
        if (selectedFile) {
            handleFile();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    return (
        <>
            {fileUploadError ? (
                <div className="col-md-12">
                    <PageAlert
                        className="mt-3"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {fileUploadError}
                    </PageAlert>
                </div>
            ) : null}

            <ConfirmationModal
                showModal={showModal}
                content="Are you sure that you will deactivate this account?"
                handleAction={() => handleActivation({ onlyCancel: false })}
                handleCancel={handleActivation}
                loading={deactivating}
            />

            <Row>
                <Col lg={8}>
                    <Row>
                        <Col lg={12}>
                            <div className="white-box">
                                <Form
                                    onSubmit={onSubmit}
                                    defaultData={formData}
                                >
                                    <Row>
                                        <Col lg={3}>
                                            <Row>
                                                <Col
                                                    lg={12}
                                                    className="text-center"
                                                >
                                                    <div className="app-input-label">
                                                        Edit Profile Picture
                                                    </div>

                                                    <a href="#">
                                                        <OverlayTrigger
                                                            placement="bottom"
                                                            delay={{
                                                                hide: 200,
                                                            }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Click to
                                                                    change your
                                                                    profile
                                                                    picture!
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <>
                                                                <img
                                                                    className="account-img"
                                                                    src={
                                                                        imagePath ||
                                                                        "images/icons/user.png"
                                                                    }
                                                                    alt=""
                                                                    onClick={
                                                                        onPhotoUpload
                                                                    }
                                                                />
                                                                <InputText
                                                                    type="file"
                                                                    name="file"
                                                                    ref={
                                                                        hiddenFileInput
                                                                    }
                                                                    onChange={
                                                                        onFileChange
                                                                    }
                                                                    style={{
                                                                        display:
                                                                            "none",
                                                                    }}
                                                                />
                                                            </>
                                                        </OverlayTrigger>
                                                    </a>

                                                    <div className="img-alert">
                                                        <p>
                                                            Click on image to
                                                            update
                                                            <br />
                                                            your profile picture
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col lg={9} className="mt-3">
                                            <Row>
                                                <Col lg={6}>
                                                    <ContextInput
                                                        label="Job Title"
                                                        name="title"
                                                    />
                                                </Col>

                                                <Col lg={6}>
                                                    <PhoneInput
                                                        label="Phone"
                                                        name="phone_primary"
                                                    />
                                                </Col>

                                                <Col lg={6}>
                                                    <ContextInput
                                                        label="First Name"
                                                        name="first_name"
                                                    />
                                                </Col>

                                                <Col lg={6}>
                                                    <ContextInput
                                                        label="Last Name"
                                                        name="last_name"
                                                    />
                                                </Col>

                                                <Col lg={6}>
                                                    <ContextSelect
                                                        label="Alert Threshold"
                                                        name="alert_threshold_number"
                                                        options={[
                                                            {
                                                                id: 1,
                                                                title: "Low",
                                                                val: 1,
                                                            },
                                                            {
                                                                id: 2,
                                                                title: "Medium",
                                                                val: 2,
                                                            },
                                                            {
                                                                id: 3,
                                                                title: "High",
                                                                val: 3,
                                                            },
                                                            {
                                                                id: 4,
                                                                title: "Urgent",
                                                                val: 4,
                                                            },
                                                        ]}
                                                    />
                                                </Col>

                                                <Col
                                                    lg={6}
                                                    className="mt-3 mt-lg-0"
                                                >
                                                    <div
                                                        className="form-control custom-checkbox d-flex pt-2 content-center align-center"
                                                        style={{ gap: 15 }}
                                                    >
                                                        <MultiCheckbox
                                                            name="notification_prefs"
                                                            values={[
                                                                {
                                                                    label: "Text",
                                                                    value: "sms",
                                                                },
                                                                {
                                                                    label: "Email",
                                                                    value: "mail",
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </Col>

                                                <Col className="mt-3">
                                                    <SubmitButton
                                                        loading={
                                                            saving || loading
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>

                        <Col lg={6} style={{ display: "none" }}>
                            <h2 className="box-outside-title">
                                Contact Methods
                            </h2>

                            <div className="white-box white-box-small">
                                <Row>
                                    <Col lg={12}>
                                        <div className="table-responsive">
                                            <table className="table app-table app-table-small">
                                                <thead>
                                                    <tr>
                                                        <th>Description</th>
                                                        <th>Number</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                        <td>Home</td>
                                                        <td>(321) 555-555</td>
                                                        <td width="80">
                                                            <center>
                                                                <Button
                                                                    useButton={
                                                                        false
                                                                    }
                                                                    variant="icon"
                                                                >
                                                                    <img
                                                                        alt="Edit"
                                                                        src="/images/icons/edit.png"
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    useButton={
                                                                        false
                                                                    }
                                                                    variant="icon"
                                                                >
                                                                    <FapIcon>
                                                                        trash
                                                                    </FapIcon>
                                                                </Button>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mobile Phone</td>
                                                        <td>(123) 322-321</td>
                                                        <td width="80">
                                                            <center>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Edit"
                                                                        src="/images/icons/edit.png"
                                                                    />
                                                                </a>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Remove"
                                                                        src="/images/icons/trash.png"
                                                                    />
                                                                </a>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <a href="#" className="new-link">
                                            + Add new contact method
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col lg={6} style={{ display: "none" }}>
                            <h2 className="box-outside-title">Addressess</h2>

                            <div className="white-box white-box-small">
                                <Row>
                                    <Col lg={12}>
                                        <div className="table-responsive">
                                            <table className="table app-table app-table-small">
                                                <thead>
                                                    <tr>
                                                        <th>Address</th>
                                                        <th>City</th>
                                                        <th>ZIP</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                        <td>211 Hope St</td>
                                                        <td>Mountain View</td>
                                                        <td>94041</td>
                                                        <td width="80">
                                                            <center>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Edit"
                                                                        src="/images/icons/edit.png"
                                                                    />
                                                                </a>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Remove"
                                                                        src="/images/icons/trash.png"
                                                                    />
                                                                </a>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            2810 Grasslands
                                                            Drive Apto 421
                                                        </td>
                                                        <td>Rio Grande City</td>
                                                        <td>94041</td>
                                                        <td width="80">
                                                            <center>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Edit"
                                                                        src="/images/icons/edit.png"
                                                                    />
                                                                </a>
                                                                <a
                                                                    href="#"
                                                                    className="action-btn"
                                                                >
                                                                    <img
                                                                        alt="Remove"
                                                                        src="/images/icons/trash.png"
                                                                    />
                                                                </a>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <a href="#" className="new-link">
                                            + Add new contact method
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col lg={4}>
                    <Row>
                        <Col lg={12} className="p-3">
                            <div className="white-box">
                                <div className="box-same-line">
                                    <h2 className="box-inside-title">
                                        Account Status
                                    </h2>

                                    <div className="box-same-line">
                                        <h2 className="box-inside-title">
                                            {currentUser.deleted_at && "In-"}
                                            Active
                                        </h2>
                                        <div
                                            className={`dot ${
                                                currentUser.deleted_at
                                                    ? "red-dot"
                                                    : "green-dot"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <p className="box-inside-text">
                                    Mark your account in-active, you{" "}
                                    <span className="text-danger">
                                        won't be able to login or do anything in
                                        the system
                                    </span>{" "}
                                    after doing this and you will automatically
                                    be logged out.
                                </p>

                                <Button
                                    variant="primary"
                                    block
                                    label="Deactivate Your Account"
                                    onClick={() => handleActivation()}
                                />
                            </div>
                        </Col>

                        <Col lg={12} className="d-none">
                            <div className="white-box mt-3">
                                <Row>
                                    <Col lg={12}>
                                        <div className="box-same-line">
                                            <h2 className="box-inside-title">
                                                Direct Deposit Information
                                            </h2>
                                        </div>

                                        <p className="box-inside-text">
                                            To make changes to your
                                            directdeposit information fill out
                                            the DME Direct Deposit form by
                                            clicking the button bellow.
                                        </p>
                                    </Col>

                                    <Col lg={12}>
                                        <Button
                                            variant="primary"
                                            block
                                            label="DME Direct Deposit Form"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default TabAccount;
