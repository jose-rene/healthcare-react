import React, { useState, useEffect, useMemo } from "react";
import Select2 from "react-select";
import Select from "../../components/inputs/Select";

import "./newRequestAddSteps.css";
import Button from "../../components/inputs/Button";
import { Card } from "react-bootstrap";
import Icon from "../../components/elements/Icon";

const NewRequestAddSteps4 = ({ data, payerProfile }) => {
    // console.log(payerProfile.request_types);
    // request type selects
    const [requestSelects, setRequestSelects] = useState([]);
    // request detail selects
    const [requestDetails, setRequestDetail] = useState(null);
    // combine these into a single group
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
        console.log("options ", options);
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
    // populate the initial group select
    useEffect(() => {
        addNewItemsCard();
    }, [payerProfile]);
    // placeholder data
    const [apiItem, setApiItem] = useState([
        {
            id: "Select option",
            title: "Select option",
            val: "",
            types: [],
        },
        {
            id: "test 1",
            val: "test 1",
            title: "Test option 1",
            types: ["wheels", "skittles"],
        },
        {
            id: "test 2",
            val: "test 2",
            title: "Test option 2",
            types: ["shoes", "skittles"],
        },
        {
            id: "test 3",
            val: "test 3",
            title: "Test option 3",
            types: ["cats", "wheels", "skittles"],
        },
    ]);

    const [itemTemplate] = useState({
        id: "",
        types: [],
    });

    const [item, setItem] = useState([itemTemplate]);

    const values = useMemo(() => {
        return item.filter((d) => !!d.id);
    }, [item]);

    /* useEffect(() => {
        console.log({ values });
    }, [values]); */

    const handleAppendItem = (originalDiag = item) => {
        if (originalDiag.length != 0) {
            if (!originalDiag[originalDiag.length - 1].id) {
                return;
            }
        }

        const oldDiag = [...originalDiag, itemTemplate];
        // oldDiag.push(itemTemplate);

        setItem(oldDiag);
    };

    const handleOnChange = async (
        { target: { name, value, ...otherProps } },
        index
    ) => {
        // If the user removed the type it, then delete this row from the form.
        if (name == "id" && !value) {
            return handleRemoveItemIndex(index);
        }
        const { types: selectedTypes = [] } = apiItem[
            apiItem.findIndex(({ id }) => id == value)
        ];

        const newDiag = item.map((d, idx) =>
            idx == index ? { ...d, [name]: value, types: selectedTypes } : d
        );
        await setItem(newDiag);
        handleAppendItem(newDiag);
        return true;
    };

    const handleRemoveItemIndex = async (index) => {
        const originalDiag = [...item];
        originalDiag.splice(index, 1);
        await setItem(originalDiag);
    };
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
            console.log(
                "reset index -> ",
                currentGroups[groupIndex].typeSelects
            );
        }
        // if there are details they would no longer be shown, since a request type changed, reset to null
        currentGroups[groupIndex].requestDetails = null;
        // setRequestDetail(null);
        // clear
        if (action?.action && action.action === "clear") {
            // set the value of this type to blank
            currentGroups[groupIndex].typeSelects[index].value = "";
            // update state
            setRequestItemGroups(currentGroups);
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
                    reqTypes = found?.request_types;
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
            setRequestItemGroups(currentGroups);
        } else if (foundReqType?.details) {
            // show the request details
            console.log("details => ", foundReqType.details);
            currentGroups[groupIndex].requestDetails = {
                options: mapOptions(foundReqType.details),
                value: mapOptions(
                    foundReqType.details.filter((detail) => detail.is_default)
                ),
            };
            setRequestItemGroups(currentGroups);
            // auto add the next card to enter another request type
            if (!currentGroups[groupIndex + 1]) {
                addNewItemsCard();
            }
        }
        console.log("found -> ", index, foundReqType);
    };
    const handleDetailChange = (selected, action, index) => {
        // setRequestDetail((prevDetail) => ({ ...prevDetail, value: selected }));
        const currentGroups = [...requestItemGroups];
        currentGroups[index].requestDetails.value = selected;
        setRequestItemGroups(currentGroups);
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
                setRequestItemGroups(currentGroups);
            }
            return;
        }
        currentGroups.splice(index, 1);
        setRequestItemGroups(currentGroups);
    };
    console.log(requestSelects);
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
