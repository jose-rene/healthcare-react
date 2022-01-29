import React, { useState, useEffect } from "react";
import {
    Card,
    Col,
    Collapse,
    ListGroup,
    ListGroupItem,
    Row,
} from "react-bootstrap";

/* eslint-disable react/no-array-index-key */

const RequestItemForm = ({
    requestItems,
    payerProfile: { classifications: payerClassifications = [] },
    classificationId,
    openRequestItem,
}) => {
    const [data, setData] = useState({
        type_name: "request-items",
        request_type_details: [],
    });

    // console.log("req items ", disabled, requestItems);

    /* const [requestClassifications, setRequestClassifications] = useState([]);
    console.log("classifications", payerClassifications);
    useEffect(() => {
        setRequestClassifications(payerClassifications);
    }, [requestData]); */
    // combine request type selects and request detail select into a group
    // eslint-disable-next-line
    const [requestItemGroups, setRequestItemGroups] = useState([]);
    const [classification, setClassification] = useState(null);
    // console.log(requestItemGroups);
    // handle request details update

    // eslint-disable-next-line
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
    // get classification info by id from payer classifications
    useEffect(() => {
        if (!classificationId || !payerClassifications) {
            return;
        }
        const found = payerClassifications.find(
            (item) => item.id === classificationId
        );
        if (found) {
            setClassification(found);
        }
    }, [payerClassifications, classificationId]);
    // add a new card for request items
    const addNewItemsCard = () => {
        // console.log("classifications -> ", payerClassifications);
        setRequestItemGroups((prevGroups) => [
            ...prevGroups,
            {
                typeSelects: [
                    {
                        options: classification?.request_types
                            ? mapOptions(classification.request_types)
                            : [],
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
            // build the requestitem groups from the top level
            requestItems.forEach((item, groupIndex) => {
                // console.log(groupIndex, item.classification);
                let foundReqTypes = {
                    request_types: classification?.request_types
                        ? classification.request_types
                        : [],
                };
                // the group at this index
                currentGroups[groupIndex] = {
                    typeSelects: [],
                    requestTypeId: item.request_type_id ?? null,
                    requestDetails: null,
                    comments: "",
                };
                if (
                    item.request_type_parents &&
                    item.request_type_parents.length
                ) {
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

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3">
                <Card.Header className="border-0 bg-light ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Request Items</h5>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="px-3">
                    <Collapse in={!openRequestItem}>
                        <div>
                            <Row>
                                <Col>
                                    {requestItems.map((item) => (
                                        <ListGroup
                                            key={`ri_${item.id}`}
                                            className="mb-3 mx-0"
                                        >
                                            <ListGroup.Item className="bg-light">
                                                <h6 className="mb-0">
                                                    {item.full_name}
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
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default RequestItemForm;
