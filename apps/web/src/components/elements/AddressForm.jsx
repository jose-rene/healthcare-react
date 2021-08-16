import React, { useState, useMemo } from "react";
import { isEmpty } from "lodash";
import InputText from "../inputs/ContextInput";
import Select from "../contextInputs/Select";
import PageAlert from "./PageAlert";
import states from "../../config/States.json";
import { BASE_URL, API_KEY } from "../../config/Map";
import { Button } from "../index";
import ZipcodeInput from "../inputs/ZipcodeInput";
import { useFormContext } from "../../Context/FormContext";
import AddressType from "./AddressType";
import Checkbox from "../inputs/Checkbox";

const AddressForm = ({ addressTypesOptions }) => {
    const { getValue, update } = useFormContext();
    const address = getValue("address", {});
    const [alertMessage, setAlertMessage] = useState("");
    const [countyOptions, setCountyOptions] = useState([]);
    const [lookingUpZipcode, setLookingUpZipcode] = useState(false);

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [states]);

    const handleLookupZip = async () => {
        setLookingUpZipcode(true);

        const { address_1, postal_code } = address;
        setAlertMessage("");

        if (address_1 === null || address_1 === "") {
            setAlertMessage("Please input address!");
            return;
        }

        if (postal_code === null || postal_code === "") {
            setAlertMessage("Please input postal code!");
            return;
        }

        try {
            const { results = [] } = await fetch(
                `${BASE_URL}?key=${API_KEY}&address=${address_1} ${postal_code}`
            ).then((response) => response.json());

            const { address_components } = results[0] || {};

            if (!address_components) {
                setAlertMessage("Address not found");
                return;
            }

            const addressTemp = {};

            address_components.forEach((v) => {
                const { short_name, types } = v || {};

                if (types) {
                    if (types.indexOf("administrative_area_level_1") !== -1) {
                        addressTemp.state = short_name;
                    }

                    if (types.indexOf("administrative_area_level_2") !== -1) {
                        setCountyOptions([
                            {
                                id: short_name,
                                title: short_name,
                                val: short_name,
                            },
                        ]);

                        addressTemp.county = short_name;
                    }

                    if (v.types.indexOf("locality") !== -1) {
                        addressTemp.city = short_name;
                    }
                }
            });

            update("address", addressTemp);
        } catch (error) {
            setAlertMessage("Address fetch error!");
        } finally {
            setLookingUpZipcode(false);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <AddressType
                        options={addressTypesOptions}
                        name="address.address_type_id"
                        label="Type*"
                    />
                </div>

                <div className="col-md-12">
                    <InputText name="address.address_1" label="Address 1*" />
                </div>

                <div className="col-md-12">
                    <InputText name="address.address_2" label="Address 2" />
                </div>

                <PageAlert
                    show={!!alertMessage}
                    className="text-muted"
                    timeout={5000}
                    dismissible
                >
                    {alertMessage}
                </PageAlert>

                <div className="col-md-8">
                    <ZipcodeInput name="address.postal_code" />
                </div>

                <div className="col-md-4">
                    <Button
                        variant="primary"
                        block
                        onClick={handleLookupZip}
                        size="lg"
                        loading={lookingUpZipcode}
                        label="Lookup Zip"
                    />
                </div>

                <div className="col-md-6">
                    <InputText name="address.city" label="City*" />
                </div>

                <div className="col-md-6">
                    <Select
                        name="address.state"
                        label="State*"
                        options={statesOptions}
                    />
                </div>

                <div className="col-md-6">
                    <Select
                        name="address.county"
                        label="County"
                        options={countyOptions}
                    />
                </div>

                <div className="col-md-12">
                    <div className="form-control custom-checkbox mt-0">
                        <Checkbox labelLeft label="Primary" name="is_primary" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressForm;
