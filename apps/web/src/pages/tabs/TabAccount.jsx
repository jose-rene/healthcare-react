import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import InputText from "../../components/inputs/InputText";
import Select from "../../components/inputs/Select";
import Button from "../../components/inputs/Button";
import Icon from "../../components/elements/Icon";
/* eslint-disable jsx-a11y/anchor-is-valid */

const TabAccount = ({ user: { avatar_url, first_name, last_name } }) => {
    return (
        <Row>
            <Col lg={8}>
                <Row>
                    <Col lg={12}>
                        <div className="white-box">
                            <Row>
                                <Col lg={3}>
                                    <Row>
                                        <Col lg={12}>
                                            <label className="app-input-label">
                                                Edit Profile Picture
                                            </label>

                                            <a href="#">
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ hide: 200 }}
                                                    overlay={
                                                        <Tooltip>
                                                            Click to change your
                                                            profile picture!
                                                        </Tooltip>
                                                    }
                                                >
                                                    <img
                                                        className="account-img"
                                                        src={
                                                            avatar_url ||
                                                            "/images/icons/user.png"
                                                        }
                                                        alt=""
                                                    />
                                                </OverlayTrigger>
                                            </a>

                                            <div className="img-alert">
                                                <img
                                                    src="/images/icons/alert-circle.png"
                                                    alt=""
                                                />
                                                <p>
                                                    Recommended Picture
                                                    <br />
                                                    Dimension is 150px x 150px
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={9}>
                                    <Row>
                                        <Col lg={6}>
                                            <InputText label="Professional Designation" />
                                        </Col>

                                        <Col lg={6}>
                                            <InputText label="User Name" />
                                        </Col>

                                        <Col lg={6}>
                                            <InputText
                                                label="First Name"
                                                value={first_name}
                                            />
                                        </Col>

                                        <Col lg={6}>
                                            <InputText
                                                label="Last Name"
                                                value={last_name}
                                            />
                                        </Col>

                                        <Col lg={6}>
                                            <InputText label="Type" />
                                        </Col>

                                        <Col lg={6}>
                                            <Select
                                                label="Alert Threshold"
                                                options={[
                                                    {
                                                        id: 1,
                                                        title: "Low",
                                                        val: "Low",
                                                    },
                                                    {
                                                        id: 2,
                                                        title: "Medium",
                                                        val: "Medium",
                                                    },
                                                    {
                                                        id: 3,
                                                        title: "High",
                                                        val: "High",
                                                    },
                                                    {
                                                        id: 4,
                                                        title: "Urgent",
                                                        val: "Urgent",
                                                    },
                                                ]}
                                            />
                                            <div />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col lg={6} style={{ display: "none" }}>
                        <h2 className="box-outside-title">Contact Methods</h2>

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
                                                                <Icon>
                                                                    trash
                                                                </Icon>
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
                                                        2810 Grasslands Drive
                                                        Apto 421
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
                    <Col lg={12}>
                        <div className="white-box">
                            <Row>
                                <Col lg={12}>
                                    <div className="box-same-line">
                                        <h2 className="box-inside-title">
                                            Account Status
                                        </h2>

                                        <div className="box-same-line">
                                            <h2 className="box-inside-title">
                                                Active
                                            </h2>
                                            <div className="green-dot" />
                                        </div>
                                    </div>

                                    <p className="box-inside-text">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Ut fringilla finibus
                                        odio.
                                    </p>
                                </Col>

                                <Col lg={12}>
                                    <Button
                                        variant="primary"
                                        block
                                        label="Deactivate Your Account"
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col lg={12}>
                        <div className="white-box">
                            <Row>
                                <Col lg={12}>
                                    <div className="box-same-line">
                                        <h2 className="box-inside-title">
                                            Direct Deposit Information
                                        </h2>
                                    </div>

                                    <p className="box-inside-text">
                                        To make changes to your directdeposit
                                        information fill out the DME Direct
                                        Deposit form by clicking the button
                                        bellow.
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
    );
};

export default TabAccount;
