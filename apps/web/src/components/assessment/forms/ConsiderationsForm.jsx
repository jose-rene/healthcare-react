import React, { useState, useEffect } from "react";
import FapIcon from "components/elements/FapIcon";
import Select2 from "react-select";
import Textarea from "components/inputs/Textarea";
import useApiCall from "hooks/useApiCall";
import {
    Button,
    Card,
    Col,
    Collapse,
    Form,
    FormLabel,
    ListGroup,
    Row,
} from "react-bootstrap";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";

const ConsiderationForm = ({
    toggleOpenConsideration,
    activeRequestItem: requestItem,
    requestId,
}) => {
    const {
        considerations = [],
        classification: classificationId,
        id: requestItemId,
    } = requestItem;
    // the default classification details from the classification id in request item
    const [classification, setClassification] = useState(null);
    // combine request type selects for considerations in a group
    const [considerationGroups, setConsiderationGroups] = useState([]);

    // utility function to map values to select options
    const mapOptions = (values) => {
        if (!values) {
            return [];
        }
        // const options = [{ label: "Select", value: "" }];
        const options = values.map((item) => {
            return { label: item.name, value: item.id };
        });

        return options;
    };
    // add a new card for considerations
    const addNewCard = (
        { request_types, name: classification_name },
        {
            id = null,
            name = null,
            is_default = false,
            is_recommended = null,
        } = {
            id: null,
            name: null,
            is_default: false,
            is_recommended: null,
        }
    ) => {
        // console.log("classifications -> ", payerProfile.classifications);
        setConsiderationGroups((prevGroups) => [
            ...prevGroups,
            {
                id,
                name,
                is_default,
                is_recommended,
                request_type_id: null, // set when all the request types are selected
                classification_id: classificationId,
                classification_name,
                request_item: requestItemId,
                typeSelects: [
                    {
                        options: mapOptions(request_types),
                        value: "",
                    },
                ],
                summary: "",
            },
        ]);
    };

    // get classification data from the api
    const [{ loading: classificationLoading }, fetchClassification] =
        useApiCall();
    // save considerations to api
    const [{ loading: saveLoading, error: saveError }, saveConsiderations] =
        useApiCall({
            url: `assessment/${requestId}/consideration`,
            method: "POST",
        });

    useEffect(() => {
        if (!classificationId) {
            return;
        }
        // fetch the classification from id
        const fetchData = async (id) => {
            const data = await fetchClassification({
                url: `classification/${id}`,
            });
            return data;
        };
        fetchData(classificationId)
            .then((data) => {
                setClassification(data);
                considerations.forEach((item) => {
                    addNewCard(data, item);
                });
                // add a new card for another consideration to be added
                addNewCard(data);
            })
            .catch((e) => console.log(e));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classificationId]);

    const handleSelectChange = (
        selected,
        { action = null },
        index,
        groupIndex
    ) => {
        // console.log(selected, action, index, groupIndex);
        let i;
        // make a copy of state
        const currentGroups = [...considerationGroups];
        // the value of this select
        const value = selected?.value ?? "";
        // check if we selects need to be removed from state
        if (currentGroups[groupIndex].typeSelects.length > index + 1) {
            // when this select changes, remove the selects above this index
            currentGroups[groupIndex].typeSelects.length = index + 1;
            // console.log("reset index -> ", currentGroups[groupIndex].typeSelects);
        }
        // if there are details they would no longer be shown, since a request type changed, reset to null
        // currentGroups[groupIndex].requestDetails = null;
        // // setRequestDetail(null);
        // clear
        if (action && action === "clear") {
            // set the value of this type to blank
            currentGroups[groupIndex].typeSelects[index].value = "";
            currentGroups[groupIndex].request_type_id = null;
            // update state
            setConsiderationGroups(currentGroups);
            return;
        }
        // populate the next select or request types
        // get the nested request_types to use
        let reqTypes = classification.request_types;
        /* eslint-disable */
        if (index > 0) {
            for (i = 0; i < index; i++) {
                const found = reqTypes.find(
                    (type) =>
                        type.id ===
                        currentGroups[groupIndex].typeSelects[i].value
                );
                if (found?.request_types) {
                    reqTypes = found.request_types;
                }
            }
        }
        /* eslint-enable */

        // find the request type for this value in the reqTypes array
        const foundReqType = reqTypes.find((type) => type.id === value);
        // setRequestVals((prevVals) => [...prevVals, value]);
        // set the value of the select
        currentGroups[groupIndex].typeSelects[index].value = value;
        // if there are child request types, add the next select
        if (foundReqType?.request_types && foundReqType.request_types.length) {
            // append the next select
            currentGroups[groupIndex].typeSelects = [
                ...currentGroups[groupIndex].typeSelects,
                {
                    options: mapOptions(foundReqType.request_types),
                    value: "",
                },
            ];
            // set state
            setConsiderationGroups(currentGroups);
        } else if (foundReqType?.details) {
            // show the request details
            // console.log("details => ", foundReqType.details);
            // not needed for considerations
            /* currentGroups[groupIndex].requestDetails = {
                options: mapOptions(foundReqType.details),
                value: mapOptions(
                    foundReqType.details.filter((detail) => detail.is_default)
                ),
            }; */
            // this is the request type that the consideration is associated with
            currentGroups[groupIndex].request_type_id = value;
            // console.log("current groups update details", currentGroups);
            setConsiderationGroups(currentGroups);
            // auto add the next card to enter another request type
            if (!currentGroups[groupIndex + 1]) {
                addNewCard(classification);
            }
        }
        // console.log("found -> ", index, foundReqType);
    };

    const handleRecommended = (e) => {
        const currentGroups = [...considerationGroups];
        currentGroups[0].is_recommended = e.target.value === "yes";
        setConsiderationGroups(currentGroups);
    };

    const handleSummary = (e, index) => {
        const currentGroups = [...considerationGroups];
        currentGroups[index].summary = e.target.value;
        setConsiderationGroups(currentGroups);
    };

    const handleSave = () => {
        // console.log(data);
        const params = { considerations: [] };
        considerationGroups
            .filter(
                ({ request_type_id, is_default }) =>
                    request_type_id || is_default
            )
            .forEach(
                ({
                    id,
                    is_default,
                    is_recommended = null,
                    classification_id,
                    request_type_id,
                    request_item,
                    summary,
                }) => {
                    const item = {
                        id,
                        is_default,
                        classification_id,
                        request_type_id,
                        request_item,
                        summary,
                    };
                    if (item.is_default) {
                        item.is_recommended = is_recommended;
                    }
                    params.considerations.push(item);
                    // get the last request type
                    /* if (!is_default) {
                        const requestType = typeSelects.slice(-1);
                        console.log(requestType);
                    } */
                }
            );
        saveConsiderations({ params }).then(() => {
            console.log(params);
        });
    };

    return (
        <>
            <LoadingOverlay
                active={saveLoading}
                spinner
                text="Updating..."
                styles={{
                    overlay: (base) => ({
                        ...base,
                        borderRadius: "12px",
                    }),
                }}
            >
                {considerationGroups.map(
                    (
                        {
                            classification_name,
                            summary,
                            name,
                            is_default,
                            is_recommended,
                            request_type_id,
                            typeSelects,
                        },
                        groupIndex
                    ) => (
                        <>
                            {is_default ? (
                                <>
                                    <Card className="mb-2" key={groupIndex}>
                                        <Card.Header>
                                            <h6 className="mb-0">{`${classification_name} > ${name}`}</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <FormLabel className="me-2">
                                                Is this consideration
                                                recommended?
                                            </FormLabel>
                                            <Form.Check
                                                inline
                                                label="Yes"
                                                name="recommended"
                                                checked={is_recommended}
                                                type="radio"
                                                id="recommended-yes"
                                                value="yes"
                                                key="yes"
                                                onClick={handleRecommended}
                                            />
                                            <Form.Check
                                                inline
                                                label="No"
                                                name="recommended"
                                                checked={
                                                    is_recommended === false
                                                }
                                                type="radio"
                                                id="recommended-no"
                                                value="no"
                                                key="no"
                                                onClick={handleRecommended}
                                            />
                                            <Textarea
                                                className="form-control mt-2"
                                                label="Summary"
                                                id={`summary_${groupIndex}`}
                                                name="summary"
                                                type="textarea"
                                                value={summary}
                                                rows={5}
                                                onChange={(e) =>
                                                    handleSummary(e, groupIndex)
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                    <h5 className="my-3">
                                        Additional Considerations
                                    </h5>
                                </>
                            ) : (
                                <Card key={groupIndex} className="mb-3">
                                    <Card.Header>
                                        <FapIcon
                                            icon="check-circle"
                                            type="fas"
                                            className={`text-success me-2${
                                                request_type_id ? "" : " d-none"
                                            }`}
                                        />{" "}
                                        {classification_name}
                                    </Card.Header>
                                    <Card.Body>
                                        {typeSelects.map((select, index) => (
                                            <>
                                                {index === 0 && (
                                                    <h6 className="mt-3">
                                                        Type
                                                    </h6>
                                                )}
                                                <Select2
                                                    className="basic-single mt-2"
                                                    classNamePrefix="select"
                                                    defaultValue=""
                                                    value={
                                                        select.value
                                                            ? select.options.find(
                                                                  (opt) =>
                                                                      opt.value ===
                                                                      select.value
                                                              )
                                                            : null
                                                    }
                                                    isClearable
                                                    isSearchable
                                                    name={`request_type_${index}`}
                                                    options={select.options}
                                                    onChange={(
                                                        selected,
                                                        action
                                                    ) =>
                                                        handleSelectChange(
                                                            selected,
                                                            action,
                                                            index,
                                                            groupIndex
                                                        )
                                                    }
                                                />
                                            </>
                                        ))}
                                        {request_type_id && (
                                            <Textarea
                                                className="form-control mt-2"
                                                label="Summary"
                                                id={`summary_${groupIndex}`}
                                                name="summary"
                                                type="textarea"
                                                value={summary}
                                                rows={5}
                                                onChange={(e) =>
                                                    handleSummary(e, groupIndex)
                                                }
                                            />
                                        )}
                                    </Card.Body>
                                </Card>
                            )}
                        </>
                    )
                )}
                {saveError ? (
                    <PageAlert
                        className="mt-3"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {saveError}
                    </PageAlert>
                ) : null}
                <Button
                    variant="secondary"
                    onClick={() => toggleOpenConsideration()}
                    className="me-3"
                >
                    Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </LoadingOverlay>
        </>
    );
};

export default ConsiderationForm;
