import React, { useState } from "react";
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

import FapIcon from "components/elements/FapIcon";

import "./styles.scss";

const ConsiderationView = ({
    openConsideration,
    toggleOpenConsideration,
    classifications,
    requestItems,
}) => {

    // which request item is in context for consideration form
    const [activeRequestItem, setRequestItem] = useState({});
    // open consideration form for a request item
    const doConsideration = (id) => {
        const item = requestItems.find((i) => i.id === id);
        if (item) {
            setRequestItem(item);
            toggleOpenConsideration(true);
        }
    };

    console.log(activeRequestItem);

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
                            <h6 className="mb-3">
                                {`${activeRequestItem.classification_name} > ${activeRequestItem.name}`}
                            </h6>
                            <div>
                                <FormLabel className="me-2">
                                    Is this request item recommended?
                                </FormLabel>
                                <Form.Check
                                    inline
                                    label="Yes"
                                    name="recommended"
                                    type="radio"
                                    id="recommended-yes"
                                    value="yes"
                                />
                                <Form.Check
                                    inline
                                    label="No"
                                    name="recommended"
                                    type="radio"
                                    id="recommended-no"
                                    value="no"
                                />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => toggleOpenConsideration()}
                                className="me-3 mt-3"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Collapse>
                    <Collapse in={!openConsideration}>
                        <div>
                            <Row>
                                <Col>
                                    {requestItems.map((item) => (
                                        <ListGroup
                                            key={item.classification}
                                            className="mb-3"
                                            as="ol"
                                            numbered="numbered"
                                        >
                                            <ListGroup.Item
                                                key={item.id}
                                                className="bg-light"
                                                as="li"
                                            >
                                                <h6 className="mb-2">
                                                    {`${item.classification_name} > ${item.name}`}
                                                </h6>
                                                <Button
                                                    variant="link"
                                                    className="fst-italic p-0"
                                                    onClick={() =>
                                                        doConsideration(item.id)
                                                    }
                                                >
                                                    <span>
                                                        {item.outcome
                                                            ? "Edit Considerations"
                                                            : "Considerations"}
                                                    </span>
                                                    <FapIcon
                                                        icon="angle-double-right"
                                                        size="sm"
                                                        className="ms-1"
                                                    />
                                                </Button>
                                            </ListGroup.Item>
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

export default ConsiderationView;
