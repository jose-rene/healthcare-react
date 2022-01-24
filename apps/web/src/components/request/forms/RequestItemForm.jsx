/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Card,
    Col,
    Collapse,
    ListGroup,
    ListGroupItem,
    Row,
} from "react-bootstrap";
import Select2 from "react-select";
import LoadingOverlay from "react-loading-overlay";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import Textarea from "components/inputs/Textarea";

/* eslint-disable react/no-array-index-key */

const RequestItemForm = ({
    requestItems,
    payerProfile: { classifications: payerClassifications = [] },
    classificationId,
    openRequestItem,
    toggleOpenRequestItem,
    saveRequest,
    requestLoading,
    updateError,
    disabled,
}) => {
    // combine request type selects and request detail select into a group
    const [requestItemGroups, setRequestItemGroups] = useState([]);

    // map id / name objects to react select value / label objects
    const mapOptions = (values) => {
        if (!values) {
            return [];
        }
        // const options = [{ label: "Select", value: "" }];
        const options = values.map((item) => {
            return { label: item.name, value: item.id };
        });
        // console.log("options ", options);
        return options;
    };
    // get classification info by id from payer classifications
    const getClassification = useCallback(
        () => payerClassifications.find((item) => item.id === classificationId),
        [payerClassifications, classificationId]
    );

    // console.log(getClassification());
    // add a new card for request items
    const addNewItemsCard = () => {
        // console.log("classifications -> ", payerClassifications);
        setRequestItemGroups((prevGroups) => [
            ...prevGroups,
            {
                typeSelects: [
                    {
                        options: mapOptions(getClassification().request_types),
                        value: "",
                    },
                ],
                requestTypeId: null,
                requestDetails: null,
                comments: "",
            },
        ]);
    };
    // populate the initial request type selects
    useEffect(() => {
        // if there is previously saved data
        if (requestItems) {
            // console.log(requestItems);
            // the array from which state will be constructed based upon the passed data
            const currentGroups = [];
            const classification = getClassification();
            // build the requestitem groups from the top level
            requestItems.forEach((item, groupIndex) => {
                // console.log(groupIndex, item.classification);
                let foundReqTypes = {
                    request_types: classification.request_types,
                };
                if (
                    item.request_type_parents &&
                    item.request_type_parents.length
                ) {
                    // the group at this index
                    currentGroups[groupIndex] = {
                        typeSelects: [],
                        requestTypeId: item.request_type_id ?? null,
                        requestDetails: null,
                        comments: "",
                    };
                    // build the menus for each request type from the parent chain;
                    item.request_type_parents.forEach((typeId, i) => {
                        // console.log("parent ", i, typeId);
                        if (!foundReqTypes?.request_types) {
                            // this would only happen with bad data in
                            return false;
                        }
                        currentGroups[groupIndex].typeSelects.push({
                            options: mapOptions(foundReqTypes.request_types),
                            value: typeId,
                        });
                        // find in the request types for the options for the next iteration
                        foundReqTypes = foundReqTypes.request_types.find(
                            (type) => type.id === typeId
                        );
                        // console.log(foundReqTypes);
                        // return false;
                    });
                }
                // the last select in the chain is the request type id for the request item
                // the check here only wards against bad data, there should always be request_types here
                if (foundReqTypes?.request_types) {
                    currentGroups[groupIndex].typeSelects.push({
                        options: mapOptions(foundReqTypes.request_types),
                        value: item.request_type_id,
                    });
                    // the last in the chain will have the detail
                    foundReqTypes = foundReqTypes.request_types.find(
                        (type) => type.id === item.request_type_id
                    );
                }
                if (foundReqTypes?.details) {
                    currentGroups[groupIndex].requestDetails = {
                        options: mapOptions(foundReqTypes.details),
                        value: mapOptions(
                            foundReqTypes.details.filter((detail) =>
                                item.details.some(
                                    (itemDetail) => itemDetail.id === detail.id
                                )
                            )
                        ),
                    };
                }
            });
            // set state
            setRequestItemGroups(currentGroups);
            // updateRequestDetails(currentGroups);
            // return;
        } else {
            // reset
            setRequestItemGroups([]);
        }
        // otherwise populate the initial group select by adding a new card
        addNewItemsCard();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestItems]);
    // set params when request items change
    /* useEffect(() => {
        setParams(data);
    }, [data]); */

    const handleSelectChange = (selected, action, index, groupIndex) => {
        let i;
        // make a copy of state
        const currentGroups = [...requestItemGroups];
        // the value of this select
        const value = selected?.value ?? "";
        // check if we selects need to be removed from state
        if (currentGroups[groupIndex].typeSelects.length > index + 1) {
            // when this select changes, remove the selects above this index
            currentGroups[groupIndex].typeSelects.length = index + 1;
            // console.log("reset index -> ", currentGroups[groupIndex].typeSelects);
        }
        // if there are details they would no longer be shown, since a request type changed, reset to null
        currentGroups[groupIndex].requestDetails = null;
        // setRequestDetail(null);
        // clear
        if (action?.action && action.action === "clear") {
            // set the value of this type to blank
            currentGroups[groupIndex].typeSelects[index].value = "";
            currentGroups[groupIndex].requestTypeId = null;
            // update state
            setRequestItemGroups(currentGroups);
            // updateRequestDetails(currentGroups);
            return;
        }
        // populate the next select or request types
        // get the nested request_types to use
        let reqTypes = getClassification().request_types;
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
            setRequestItemGroups(currentGroups);
            // updateRequestDetails(currentGroups);
        } else if (foundReqType?.details) {
            // show the request details
            // console.log("details => ", foundReqType.details);
            currentGroups[groupIndex].requestDetails = {
                options: mapOptions(foundReqType.details),
                value: mapOptions(
                    foundReqType.details.filter((detail) => detail.is_default)
                ),
            };
            currentGroups[groupIndex].requestTypeId = foundReqType.id;
            // console.log("current groups update details", currentGroups);
            setRequestItemGroups(currentGroups);
            // updateRequestDetails(currentGroups);
            // auto add the next card to enter another request type
            if (!currentGroups[groupIndex + 1]) {
                addNewItemsCard();
            }
        }
        // console.log("found -> ", index, foundReqType);
    };
    const handleDetailChange = (selected, action, index) => {
        // setRequestDetail((prevDetail) => ({ ...prevDetail, value: selected }));
        const currentGroups = [...requestItemGroups];
        currentGroups[index].requestDetails.value = selected;
        setRequestItemGroups(currentGroups);
        // updateRequestDetails(currentGroups);
        // can probably be done with es6?
        /* setRequestItemGroups((prevItems) => ([
            ...prevItems,
            [0: {...prevItems[0],
            value: selected,}]
        ])); */
    };
    const handleComments = (e, index) => {
        const currentGroups = [...requestItemGroups];
        currentGroups[index].comments = e.target.value;
        setRequestItemGroups(currentGroups);
        // updateRequestDetails(currentGroups);
    };
    const handleGroupRemove = (index) => {
        if (requestItemGroups.length < 2) {
            return;
        }
        const currentGroups = [...requestItemGroups];
        // do not remove if the previous one has details and there is not a next one
        const prev = index - 1;
        const next = index + 1;
        if (
            prev >= 0 &&
            requestItemGroups[prev]?.requestDetails &&
            !requestItemGroups[next]
        ) {
            // reset if length of selects is greater than one
            if (requestItemGroups[index].typeSelects.length > 1) {
                currentGroups[index].typeSelects.length = 1;
                currentGroups[index].typeSelects[0].value = null;
                currentGroups[index].details = null;
                setRequestItemGroups(currentGroups);
                // updateRequestDetails(currentGroups);
            }
            return;
        }
        currentGroups.splice(index, 1);
        setRequestItemGroups(currentGroups);
        // updateRequestDetails(currentGroups);
    };

    const isSubmittable = useCallback(
        () => requestItemGroups.filter((item) => item.requestTypeId).length > 0,
        [requestItemGroups]
    );

    const handleSave = () => {
        // console.log(data);
        if (!isSubmittable()) {
            return;
        }
        const request_types = [];
        // add the comment and request details for each request type
        requestItemGroups
            .filter((item) => item.requestTypeId)
            .forEach(
                ({
                    requestTypeId,
                    requestDetails: { value: details = [] },
                    comments = "",
                }) => {
                    request_types.push({
                        id: requestTypeId,
                        details: details
                            ? details.map(({ value = [] }) => value)
                            : [],
                        comments,
                    });
                }
            );
        const formData = {
            type_name: "request-types",
            request_types,
        };
        // console.log(formData);
        saveRequest(formData);
    };

    return (
        <>
            <Card
                className={`border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3${
                    disabled ? " disabled" : ""
                }`}
            >
                <Card.Header className="border-0 bg-light ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-3${
                                        requestItems.length ? "" : " invisible"
                                    }`}
                                />
                                Request Items
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openRequestItem && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenRequestItem}
                                >
                                    {requestItems.length ? "change" : "add"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5">
                    <Collapse in={openRequestItem}>
                        <div>
                            <LoadingOverlay
                                active={requestLoading}
                                spinner
                                text="Updating..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                {updateError && (
                                    <PageAlert
                                        variant="warning"
                                        dismissible
                                        timeout={6000}
                                    >
                                        {updateError}
                                    </PageAlert>
                                )}
                                <Row>
                                    <Col xl={8} lg={10}>
                                        {requestItemGroups.map(
                                            (selectGroup, groupIndex) => (
                                                <Card
                                                    key={`card_${groupIndex}`}
                                                    className="mb-3"
                                                >
                                                    <Card.Header>
                                                        <FapIcon
                                                            icon="check-circle"
                                                            type="fas"
                                                            className={`text-success me-2${
                                                                selectGroup.requestTypeId
                                                                    ? ""
                                                                    : " d-none"
                                                            }`}
                                                        />
                                                        Request Item
                                                        <span className="ms-1">
                                                            {groupIndex + 1}
                                                        </span>
                                                        {selectGroup.requestTypeId &&
                                                            groupIndex > 0 && (
                                                                <FapIcon
                                                                    icon="delete"
                                                                    role="button"
                                                                    className="float-end text-danger mt-1 cursor-pointer"
                                                                    size="1x"
                                                                    onClick={() =>
                                                                        handleGroupRemove(
                                                                            groupIndex
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                    </Card.Header>
                                                    <Card.Body>
                                                        {selectGroup.typeSelects.map(
                                                            (select, index) => (
                                                                <>
                                                                    {index ===
                                                                        0 && (
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
                                                                                      (
                                                                                          opt
                                                                                      ) =>
                                                                                          opt.value ===
                                                                                          select.value
                                                                                  )
                                                                                : null
                                                                        }
                                                                        isClearable
                                                                        isSearchable
                                                                        name={`request_type_${index}`}
                                                                        options={
                                                                            select.options
                                                                        }
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
                                                            )
                                                        )}
                                                        {selectGroup.requestDetails && (
                                                            <>
                                                                <h6 className="mb-2 mt-4">
                                                                    Details
                                                                </h6>
                                                                <Select2
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="select"
                                                                    defaultValue=""
                                                                    value={
                                                                        selectGroup
                                                                            .requestDetails
                                                                            .value
                                                                    }
                                                                    isMulti
                                                                    isClearable={
                                                                        false
                                                                    }
                                                                    isSearchable
                                                                    name="request_details"
                                                                    options={
                                                                        selectGroup
                                                                            .requestDetails
                                                                            .options
                                                                    }
                                                                    onChange={(
                                                                        selected,
                                                                        action
                                                                    ) =>
                                                                        handleDetailChange(
                                                                            selected,
                                                                            action,
                                                                            groupIndex
                                                                        )
                                                                    }
                                                                />

                                                                <div className="mb-2 mt-4">
                                                                    <Textarea
                                                                        label="Comments"
                                                                        name="comments"
                                                                        type="textarea"
                                                                        rows={5}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleComments(
                                                                                e,
                                                                                groupIndex
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            )
                                        )}
                                        {isSubmittable() && (
                                            <Row>
                                                <Col className="mb-3">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            toggleOpenRequestItem
                                                        }
                                                        className="me-3"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSave}
                                                    >
                                                        Save
                                                    </Button>
                                                </Col>
                                            </Row>
                                        )}
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openRequestItem}>
                        <div>
                            {requestItems.length > 0 ? (
                                <Row>
                                    <Col>
                                        {requestItems.map((item) => (
                                            <ListGroup
                                                key={item.request_type_id}
                                                className="mb-3"
                                            >
                                                <ListGroup.Item className="bg-light">
                                                    <h6 className="mb-0">
                                                        {`${item.classification_name} > ${item.full_name}`}
                                                    </h6>
                                                </ListGroup.Item>
                                                {item.details.map((detail) => (
                                                    <ListGroupItem
                                                        key={`detail_${detail.id}`}
                                                    >
                                                        {detail.name}
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        ))}
                                    </Col>
                                </Row>
                            ) : (
                                <Row className="mb-3">
                                    <Col className="fw-bold" sm={3}>
                                        Request Items
                                    </Col>
                                    <Col sm={3}>
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenRequestItem}
                                        >
                                            Select Request Items
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default RequestItemForm;
