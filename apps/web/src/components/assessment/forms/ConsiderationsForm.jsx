import useApiCall from "hooks/useApiCall";
import React, { useState, useEffect } from "react";
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

const ConsiderationForm = ({
    toggleOpenConsideration,
    activeRequestItem: requestItem,
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
        { id = null, name = null, is_default = false } = {
            id: null,
            name: null,
            is_default: false,
        }
    ) => {
        // console.log("classifications -> ", payerProfile.classifications);
        setConsiderationGroups((prevGroups) => [
            ...prevGroups,
            {
                id,
                name,
                is_default,
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
                    console.log(item);
                    addNewCard(data, item);
                });
                // add a new card for another consideration to be added
                addNewCard(data);
            })
            .catch((e) => console.log(e));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classificationId]);

    console.log(classification);

    return (
        <>
            {considerationGroups.map(
                ({ classification_name, name, is_default }, index) => (
                    <>
                        {is_default ? (
                            <Card className="mb-2" key={index}>
                                <Card.Header>
                                    <h6 className="mb-0">{`${classification_name} > ${name}`}</h6>
                                </Card.Header>
                                <Card.Body>
                                    <FormLabel className="me-2">
                                        Is this consideration recommended?
                                    </FormLabel>
                                    <Form.Check
                                        inline
                                        label="Yes"
                                        name="recommended"
                                        type="radio"
                                        id="recommended-yes"
                                        value="yes"
                                        key="yes"
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        name="recommended"
                                        type="radio"
                                        id="recommended-no"
                                        value="no"
                                        key="no"
                                    />
                                    <Form.Group className="mb-3">
                                        <Form.Label>Summary</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="summary"
                                            id={`summary_${index}`}
                                            rows={3}
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        ) : (
                            <div>New consideration form here</div>
                        )}
                    </>
                )
            )}
            <Button
                variant="secondary"
                onClick={() => toggleOpenConsideration()}
                className="me-3 mt-3"
            >
                Cancel
            </Button>
        </>
    );
};

export default ConsiderationForm;
