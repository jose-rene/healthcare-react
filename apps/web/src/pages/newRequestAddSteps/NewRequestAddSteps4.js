import React, { useState, useEffect } from "react";
import Select2 from "react-select";

import "./newRequestAddSteps.css";
import { Card } from "react-bootstrap";
import Icon from "../../components/elements/Icon";

const NewRequestAddSteps4 = ({ requestData, setParams }) => {
    const [data, setData] = useState({
        type_name: "request-items",
        request_type_details: [],
    });

    const payerProfile = requestData.payer;

    // console.log(payerProfile.request_types);
    // combine request type selects and request detail select into a group
    const [requestItemGroups, setRequestItemGroups] = useState([]);
    // handle request details update
    const updateRequestDetails = (groups) => {
        setRequestItemGroups(groups);
        const requestDetails = [];
        groups.forEach((item) => {
            if (item?.requestDetails?.value) {
                requestDetails.push(
                    item.requestDetails.value.map((val) => val.value)
                );
            }
        });
        if (data.request_type_details !== requestDetails) {
            // console.log("set data", requestDetails);
            setData((prevData) => {
                return {
                    ...prevData,
                    request_type_details: requestDetails,
                };
            });
        }
    };
    // console.log(data);
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
    // add a new card for request items
    const addNewItemsCard = () => {
        setRequestItemGroups((prevGroups) => [
            ...prevGroups,
            {
                typeSelects: [
                    {
                        options: mapOptions(payerProfile.request_types),
                        value: "",
                    },
                ],
                requestDetails: null,
            },
        ]);
    };
    // populate the initial request type selects
    useEffect(() => {
        // if there is previously saved data
        if (requestData?.request_items) {
            // the array from which state will be constructed based upon the passed data
            const currentGroups = [];
            // build the requestitem groups from the top level
            requestData.request_items.forEach((item, groupIndex) => {
                let foundReqTypes = payerProfile;
                if (
                    item.request_type_parents &&
                    item.request_type_parents.length
                ) {
                    // the group at this index
                    currentGroups[groupIndex] = {
                        typeSelects: [],
                        requestDetails: null,
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
            updateRequestDetails(currentGroups);
            // return;
        }
        // otherwise populate the initial group select by adding a new card
        addNewItemsCard();
    }, [payerProfile]);
    // set params when request items change
    useEffect(() => {
        setParams(data);
    }, [data]);

    const handleSelectChange = (selected, action, index, groupIndex) => {
        let i;
        // request types
        let reqTypes = payerProfile.request_types;
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
            // update state
            updateRequestDetails(currentGroups);
            return;
        }
        // populate the next select or request types
        // get the nested request_types to use
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
            updateRequestDetails(currentGroups);
        } else if (foundReqType?.details) {
            // show the request details
            // console.log("details => ", foundReqType.details);
            currentGroups[groupIndex].requestDetails = {
                options: mapOptions(foundReqType.details),
                value: mapOptions(
                    foundReqType.details.filter((detail) => detail.is_default)
                ),
            };
            // console.log("current groups update details", currentGroups);
            updateRequestDetails(currentGroups);
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
        updateRequestDetails(currentGroups);
        // can probably be done with es6?
        /* setRequestItemGroups((prevItems) => ([
            ...prevItems,
            [0: {...prevItems[0],
            value: selected,}]
        ])); */
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
                updateRequestDetails(currentGroups);
            }
            return;
        }
        currentGroups.splice(index, 1);
        updateRequestDetails(currentGroups);
    };
    return (
        <>
            <div className="container-info">
                <div className="col-md-12 px-0">
                    <div className="row">
                        <div className="col-md-12">
                            {requestItemGroups.map(
                                (selectGroup, groupIndex) => (
                                    <Card key={groupIndex} className="mb-3">
                                        <Card.Header>
                                            Request Items
                                            <Icon
                                                icon="delete"
                                                role="button"
                                                className="float-right mt-1 cursor-pointer"
                                                size="1x"
                                                onClick={() =>
                                                    handleGroupRemove(
                                                        groupIndex
                                                    )
                                                }
                                            />
                                        </Card.Header>
                                        <Card.Body>
                                            {selectGroup.typeSelects.map(
                                                (select, index) => (
                                                    <>
                                                        {index === 0 && (
                                                            <h6>
                                                                Select the
                                                                Request Type
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
                                                        Select Request Item(s)
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
                                                        isClearable
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
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps4;
