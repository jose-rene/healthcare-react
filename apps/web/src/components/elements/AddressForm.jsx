import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import InputText from "../inputs/InputText";
import Button from "../inputs/Button";
import Select from "../inputs/Select";
import PageAlert from "./PageAlert";

import states from "../../config/States.json";
import { BASE_URL, API_KEY } from "../../config/Map";

const AddressForm = ({
    addressFormValue,
    addressTypesOptions,
    setAddressFormValue,
}) => {
    const [alertMessage, setAlertMessage] = useState("");
    const [countyOptions, setCountyOptions] = useState([]);
    const [addressFormData, setAddressFormData] = useState(null);

    const { register, setValue, errors } = useForm();

    const statesOptions = useMemo(() => {
        if (isEmpty(states)) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(states)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;
    }, [states]);

    useEffect(() => {
        setAddressFormData({ ...addressFormData, ...addressFormValue });
        if (!addressFormValue?.county) {
            return;
        }

        setCountyOptions([
            {
                id: addressFormValue?.county,
                title: addressFormValue?.county,
                val: addressFormValue?.county,
            },
        ]);
    }, [addressFormValue]);

    const handleLookupZip = () => {
        const { address_1, postal_code } = addressFormData;
        setAlertMessage("");
        if (address_1 === null || address_1 === "") {
            setAlertMessage("Please input address!");
            return;
        }

        if (postal_code === null || postal_code === "") {
            setAlertMessage("Please input postal code!");
            return;
        }

        fetch(`${BASE_URL}?key=${API_KEY}&address=${address_1} ${postal_code}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data?.results || !data.results[0].address_components) {
                    setAlertMessage("Address not found");
                    return;
                }

                let addressTemp = {};

                data.results[0].address_components.forEach((v) => {
                    if (v.types) {
                        if (
                            v.types.indexOf("administrative_area_level_1") !==
                            -1
                        ) {
                            setValue("state", v.short_name);
                            addressTemp = {
                                ...addressTemp,
                                state: v.short_name,
                            };
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
                            addressTemp = {
                                ...addressTemp,
                                county: v.short_name,
                            };
                        }
                        if (v.types.indexOf("locality") !== -1) {
                            setValue("city", v.short_name);
                            addressTemp = {
                                ...addressTemp,
                                city: v.short_name,
                            };
                        }
                    }
                });

                setAddressFormValue &&
                    setAddressFormValue({
                        ...addressFormValue,
                        ...addressTemp,
                    });
            })
            .catch((error) => {
                setAlertMessage("Address fetch error!");
            });
    };

    const handleAddressFormData = ({ target: { name, value } }) => {
        setAddressFormData({ ...addressFormData, [name]: value });
        setAddressFormValue &&
            setAddressFormValue({ ...addressFormValue, [name]: value });
    };

    return (
        <>
            {addressTypesOptions && (
                <div className="col-md-6">
                    <Select
                        name="address_type_id"
                        label="Type*"
                        options={addressTypesOptions}
                        errors={errors}
                        value={addressFormValue?.address_type_id}
                        ref={register({
                            required: "Address Type is required",
                        })}
                        onChange={handleAddressFormData}
                    />
                </div>
            )}

            <div className="col-md-12">
                <InputText
                    name="address_1"
                    label="Address 1*"
                    errors={errors}
                    value={addressFormValue?.address_1}
                    ref={register({
                        required: "Address 1 is required",
                    })}
                    onChange={handleAddressFormData}
                />
            </div>

            <div className="col-md-12">
                <InputText
                    name="address_2"
                    label="Address 2"
                    errors={errors}
                    value={addressFormValue?.address_2}
                    ref={register()}
                    onChange={handleAddressFormData}
                />
            </div>

            {alertMessage && (
                <PageAlert className="text-muted" timeout={5000} dismissible>
                    {alertMessage}
                </PageAlert>
            )}

            <div className="col-md-12">
                <div className="form-row">
                    <div className="col-md-6">
                        <InputText
                            name="postal_code"
                            label="Zip*"
                            errors={errors}
                            value={addressFormValue?.postal_code}
                            ref={register({
                                required: "Zip is required",
                            })}
                            onChange={handleAddressFormData}
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
                    label="City*"
                    errors={errors}
                    value={addressFormValue?.city}
                    ref={register({
                        required: "City is required",
                    })}
                    onChange={handleAddressFormData}
                />
            </div>

            <div className="col-md-6">
                <Select
                    name="state"
                    label="State*"
                    options={statesOptions}
                    errors={errors}
                    value={addressFormValue?.state}
                    ref={register({
                        required: "State is required",
                    })}
                    onChange={handleAddressFormData}
                />
            </div>

            <div className="col-md-6">
                <Select
                    name="county"
                    label="County"
                    options={countyOptions}
                    errors={errors}
                    value={addressFormValue?.county}
                    ref={register()}
                    onChange={handleAddressFormData}
                />
            </div>
        </>
    );
};

export default AddressForm;
