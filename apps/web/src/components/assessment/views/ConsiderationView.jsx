import React, { useState, useEffect } from "react";
import { Button, Card, Col, Collapse, ListGroup, Row } from "react-bootstrap";
import useApiCall from "hooks/useApiCall";
import FapIcon from "components/elements/FapIcon";
import ConsiderationForm from "../forms/ConsiderationsForm";

const ConsiderationView = ({
    openConsideration,
    toggleOpenConsideration,
    requestItems,
    requestId,
    refreshAssessment,
    refreshLoading,
}) => {
    // which request item is in context for consideration form
    const [activeRequestItem, setRequestItem] = useState();
    const [classification, setClassification] = useState(null);
    // open consideration form for a request item
    const doConsideration = (id) => {
        const item = requestItems.find((i) => i.id === id);
        if (item) {
            setRequestItem(item);
            toggleOpenConsideration(true);
        }
    };
    // get classification data from the api
    // eslint-disable-next-line
    const [{ loading: classificationLoading }, fetchClassification] =
        useApiCall();

    useEffect(() => {
        if (!requestItems?.length) {
            return;
        }
        // fetch the classification from id
        const fetchData = async (id) => {
            const data = await fetchClassification({
                url: `classification/${id}`,
            });
            return data;
        };
        fetchData(requestItems[0].classification)
            .then((data) => {
                setClassification(data);
                /* considerations.forEach((item) => {
                    addNewCard(data, item);
                });
                // add a new card for another consideration to be added
                addNewCard(data); */
            })
            .catch((e) => console.log(e));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestItems]);

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Considerations</h5>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openConsideration}>
                        <div>
                            <ConsiderationForm
                                {...{
                                    toggleOpenConsideration,
                                    activeRequestItem,
                                    classification,
                                    requestId,
                                    refreshAssessment,
                                    refreshLoading,
                                }}
                            />
                        </div>
                    </Collapse>
                    <Collapse in={!openConsideration}>
                        <div>
                            <Row>
                                <Col>
                                    {requestItems.map((item) => (
                                        <>
                                            <ListGroup
                                                key={item.id}
                                                className="mb-3"
                                                as="ol"
                                                numbered="numbered"
                                            >
                                                <ListGroup.Item
                                                    key={`ri_${item.id}`}
                                                    as="li"
                                                    variant="success"
                                                >
                                                    <h6 className="mb-0">
                                                        Request Item
                                                        {item.full_name}
                                                    </h6>
                                                </ListGroup.Item>
                                                {item.considerations.map(
                                                    ({ name, id }) => (
                                                        <ListGroup.Item
                                                            key={`cs_${id}`}
                                                            className="bg-light"
                                                            as="li"
                                                        >
                                                            <h6 className="mb-0">
                                                                {name}
                                                            </h6>
                                                        </ListGroup.Item>
                                                    )
                                                )}
                                                <ListGroup.Item>
                                                    <Button
                                                        variant="link"
                                                        className="fst-italic p-0"
                                                        onClick={() =>
                                                            doConsideration(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            edit considerations
                                                        </span>
                                                        <FapIcon
                                                            icon="angle-double-right"
                                                            size="sm"
                                                            className="ms-1"
                                                        />
                                                    </Button>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </>
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

export default ConsiderationView;
