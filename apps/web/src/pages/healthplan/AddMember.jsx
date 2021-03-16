import React, { useState, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import _ from "lodash";
import Button from "../../components/inputs/Button";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageAlert from "../../components/elements/PageAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";
import Select from "../../components/inputs/Select";
import InputText from "../../components/inputs/InputText";
import FormButtons from "../../components/elements/FormButtons";
import useApiCall from "../../hooks/useApiCall";
import { BASE_URL, API_KEY } from "../../config/Map";
import states from "../../config/States.json";
import types from "../../config/Types.json";
/* eslint-disable jsx-a11y/label-has-associated-control */

const AddMember = () => {
    const [{ data: plans }, plansRequest] = useApiCall({
        url: "plan/plans",
    });

    const [{ data: lobs }, lobsRequest] = useApiCall({
        url: "plan/lobs",
    });

    const [{ data, loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "member",
    });

    useEffect(() => {
        plansRequest();
        lobsRequest();
    }, []);

    const planOptions = useMemo(() => {
        if (_.isEmpty(plans)) {
            return [];
        }

        return plans.map(({ id, plan }) => {
            return { id, title: plan, val: plan };
        });
    }, [plans]);

    const lobOptions = useMemo(() => {
        if (_.isEmpty(lobs)) {
            return [];
        }

        return lobs.map(({ id, plan }) => {
            return { id, title: plan, val: plan };
        });
    }, [lobs]);

    const statesOptions = useMemo(() => {
        if (_.isEmpty(states)) {
            return [];
        }

        let result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(states)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;
    }, [states]);

    const typesOptions = useMemo(() => {
        if (_.isEmpty(types)) {
            return [];
        }

        let result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(types)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;
    }, [types]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        errors,
        reset,
    } = useForm();

    const [alertMessage, setAlertMessage] = useState("");
    const [countyOptions, setCountyOptions] = useState([]);
    const [member, setMember] = useState(null);

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }

        try {
            const result = await fireSubmit({ params: formData });
            setMember(result);
            reset();
        } catch (e) {
            console.log("Member create error:", e);
        }
    };

    const onCancel = () => {
        reset();
    };

    const address_1 = watch("address_1", "");
    const zip = watch("zip", "");

    const handleLookupZip = () => {
        setAlertMessage("");
        if (address_1 === null || address_1 === "") {
            setAlertMessage("Please input address!");
            return;
        }

        if (zip === null || zip === "") {
            setAlertMessage("Please input postal code!");
            return;
        }

        fetch(`${BASE_URL}?key=${API_KEY}&address=${address_1} ${zip}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data?.results || !data.results[0].address_components) {
                    setAlertMessage("Address not found");
                    return;
                }

                data.results[0].address_components.forEach((v) => {
                    if (v.types) {
                        if (
                            v.types.indexOf("administrative_area_level_1") !==
                            -1
                        ) {
                            setValue("state", v.short_name);
                        }
                        if (
                            v.types.indexOf("administrative_area_level_2") !==
                            -1
                        ) {
                            setCountyOptions([
                                {
                                    id: v.short_name,
                                    title: v.short_name,
                                    val: v.short_name,
                                },
                            ]);
                            setValue("county", v.short_name);
                        }
                        if (v.types.indexOf("locality") !== -1) {
                            setValue("city", v.short_name);
                        }
                    }
                });
            })
            .catch((error) => {
                setAlertMessage("Address fetch error!");
            });
    };

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
                    {formError ? (
                        <PageAlert
                            className="mt-3"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {formError}
                        </PageAlert>
                    ) : null}
                    {member ? (
                        <PageAlert
                            className="mt-3"
                            variant="success"
                            timeout={5000}
                            dismissible
                        >
                            Member Successfully Added.
                        </PageAlert>
                    ) : null}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="col-md-6">
                                <Select
                                    name="plan"
                                    label="Plan"
                                    options={planOptions}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6"></div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Member ID
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="member_id"
                                    label="Member ID"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="line_of_business"
                                    label="Line of Business*"
                                    options={lobOptions}
                                    errors={errors}
                                    ref={register({
                                        required:
                                            "Line of Business is required",
                                    })}
                                />
                            </div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Basic Info
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="title"
                                    label="Title"
                                    options={[
                                        {
                                            id: "select_option",
                                            title: "Select option",
                                            val: "select-option",
                                        },
                                    ]}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="date_of_birth"
                                    label="Date of Birth"
                                    type="date"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="first_name"
                                    label="First Name"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="last_name"
                                    label="Last Name"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="gender"
                                    label="Gender"
                                    options={[
                                        {
                                            id: "male",
                                            title: "Male",
                                            val: "male",
                                        },
                                        {
                                            id: "female",
                                            title: "Female",
                                            val: "female",
                                        },
                                    ]}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="language"
                                    label="Language"
                                    options={[
                                        {
                                            id: "english",
                                            title: "English",
                                            val: "english",
                                        },
                                        {
                                            id: "spanish",
                                            title: "Spanish",
                                            val: "spanish",
                                        },
                                    ]}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-12">
                                <InputText
                                    name="address_1"
                                    label="Address 1"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-12">
                                <InputText
                                    name="address_2"
                                    label="Address 2"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            {alertMessage && (
                                <PageAlert className="text-muted">
                                    {alertMessage}
                                </PageAlert>
                            )}

                            <div className="col-md-12">
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <InputText
                                            name="zip"
                                            label="Zip"
                                            errors={errors}
                                            ref={register()}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <Button
                                            className="btn btn-block btn-zip"
                                            onClick={() => handleLookupZip()}
                                        >
                                            Lookup Zip
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <InputText
                                    name="city"
                                    label="City"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="state"
                                    label="State"
                                    options={statesOptions}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="county"
                                    label="County"
                                    options={countyOptions}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Contact Methods
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="type"
                                    label="Type"
                                    options={typesOptions}
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="phone_email"
                                    label="Phone/Email"
                                    errors={errors}
                                    ref={register()}
                                />
                            </div>

                            <div className="col-md-12 mb-5">
                                <Button className="btn btn-block btn-add-method">
                                    + Add new contact method
                                </Button>
                            </div>

                            <div className="col-md-12">
                                <FormButtons
                                    submitLabel="Create New Request"
                                    onCancel={onCancel}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </PageLayout>
    );
};

export default AddMember;
