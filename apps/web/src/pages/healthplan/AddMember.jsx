import React from "react";
import { Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/inputs/Button";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";
import Select from "../../components/inputs/Select";
import InputText from "../../components/inputs/InputText";
import useApiCall from "../../hooks/useApiCall";
import PageAlert from "../../components/elements/PageAlert";
/* eslint-disable jsx-a11y/label-has-associated-control */

const AddMember = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <h1 className="box-title" style={{ marginBottom: "0px" }}>
                    New Member Info
                </h1>
                <p className="box-legenda">
                    Please enter the following information before proceeding
                    with the new request. Fields marked with * are required
                </p>

                <div className="white-box">
                    <Form>
                        <div className="form-row">
                            <div className="col-lg-6">
                                <label
                                    className="app-input-label"
                                    style={{ fontSize: "16px" }}
                                >
                                    Plan
                                </label>
                                <select
                                    className="app-input"
                                    style={{ borderColor: "#DADEE0" }}
                                >
                                    <option>
                                        Molina Central Medicare Unit
                                    </option>
                                </select>
                            </div>

                            <div className="col-lg-6" />

                            <h1
                                className="box-outside-title title-second"
                                style={{ marginBottom: "32px" }}
                            >
                                Member ID
                            </h1>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Member ID
                            </label>
                            <input
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Line of Business*
                            </label>
                            <select
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                <option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-12">
                            <h1
                                className="box-outside-title title-second"
                                style={{ marginBottom: "32px" }}
                            >
                                Basic Info
                            </h1>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Title
                            </label>
                            <select
                                className="app-input select-new-member"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                ><option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Date of Birth
                            </label>
                            <input
                                className="app-input"
                                type="date"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                First Name
                            </label>
                            <input
                                className="app-input select-new-member"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Last Name
                            </label>
                            <input
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Gender
                            </label>
                            <select
                                className="app-input select-new-member"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                ><option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Language
                            </label>
                            <select
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                <option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-12">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Address 1
                            </label>
                            <input
                                className="app-input select-new-member"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-12">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Address 2
                            </label>
                            <input
                                className="app-input select-new-member"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-12">
                            <div className="form-row">
                                <div className="col-lg-6">
                                    <label
                                        className="app-input-label"
                                        style={{ fontSize: "16px" }}
                                    >
                                        Zip
                                    </label>
                                    <input
                                        className="app-input select-new-member"
                                        style={{ borderColor: "#DADEE0" }}
                                    />
                                </div>

                                <div
                                    className="col-lg-4"
                                    style={{ paddingTop: "10px" }}
                                >
                                    <button className="btn-blue">
                                        Lookup Zip
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 city">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                City
                            </label>
                            <input
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                State
                            </label>
                            <select
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                <option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-12">
                            <h1
                                className="box-outside-title title-second"
                                style={{ marginBottom: "32px" }}
                            >
                                Contact Methods
                            </h1>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Type
                            </label>
                            <select
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            >
                                ><option>Select option</option>
                            </select>
                        </div>

                        <div className="col-lg-6">
                            <label
                                className="app-input-label"
                                style={{ fontSize: "16px" }}
                            >
                                Phone/Email
                            </label>
                            <input
                                className="app-input"
                                style={{ borderColor: "#DADEE0" }}
                            />
                        </div>

                        <div className="col-lg-12">
                            <button className="btn-blue btn-add-method">
                                + Add new contact method
                            </button>
                        </div>

                        <div className="col-lg-12 last-buttons">
                            <div className="form-row">
                                <div className="col-lg-5 div-last-buttons">
                                    <button className="btn-blue btn-cancel-newMember">
                                        Cancel
                                    </button>
                                </div>

                                <div className="col-lg-5 div-last-buttons">
                                    <button className="btn-blue btn-create-request">
                                        Create New Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </PageLayout>
    );
};

export default AddMember;
