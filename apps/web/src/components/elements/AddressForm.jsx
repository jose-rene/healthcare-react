import React, { useState, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import { Button } from "components/index";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import ContextCheckbox from "components/contextInputs/Checkbox";
import PageAlert from "components/elements/PageAlert";

import { useFormContext } from "Context/FormContext";

import states from "config/States.json";
import { BASE_URL, API_KEY } from "config/Map";

const AddressForm = ({ addressTypesOptions }) => {
    const { getValue, update } = useFormContext();

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

        const address_1 = getValue("address_1");
        const postal_code = getValue("postal_code");

        setAlertMessage("");

        if (!address_1) {
            setAlertMessage("Please input address!");
            setLookingUpZipcode(false);
            return;
        }

        if (!postal_code) {
            setAlertMessage("Please input postal code!");
            setLookingUpZipcode(false);
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

            let addressTemp = {};

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

                    if (types.indexOf("locality") !== -1) {
                        addressTemp.city = short_name;
                    }
                }
            });

            update(addressTemp);
        } catch (error) {
            setAlertMessage("Address fetch error!");
        } finally {
            setLookingUpZipcode(false);
        }
    };

    return (
        <Row>
            <PageAlert
                show={!!alertMessage}
                className="text-muted"
                timeout={5000}
                dismissible
            >
                {alertMessage}
            </PageAlert>

            {addressTypesOptions && (
                <Col md={6}>
                    <ContextSelect
                        options={addressTypesOptions}
                        name="address_type_id"
                        label="Type*"
                    />
                </Col>
            )}

            <Col md={12}>
                <ContextInput
                    name="address_1"
                    label="Address 1*"
                    onChange={update}
                />
            </Col>

            <Col md={12}>
                <ContextInput name="address_2" label="Address 2" />
            </Col>

            <Col md={8}>
                <ContextInput name="postal_code" label="Zip*" />
            </Col>

            <Col md={4}>
                <Button
                    className="mb-3"
                    variant="primary"
                    block
                    onClick={handleLookupZip}
                    size="lg"
                    loading={lookingUpZipcode}
                    label="Lookup Zip"
                />
            </Col>

            <Col md={6}>
                <ContextInput name="city" label="City*" />
            </Col>

            <Col md={6}>
                <ContextSelect
                    name="state"
                    label="State*"
                    options={statesOptions}
                />
            </Col>

            <Col md={6}>
                <ContextSelect
                    name="county"
                    label="County"
                    options={countyOptions}
                />
            </Col>

            <Col md={12}>
                <div className="form-control py-2">
                    <ContextCheckbox label="Primary" name="is_primary" />
                </div>
            </Col>
        </Row>
    );
};

export default AddressForm;
