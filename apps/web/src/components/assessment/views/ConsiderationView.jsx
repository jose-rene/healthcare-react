import React from "react";
import {
    Button,
    Card,
    Col,
    Collapse,
    ListGroup,
    ListGroupItem,
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
    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Considerations</h5>
                        </div>
                        <div className="ms-auto">
                            {!openConsideration && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenConsideration}
                                >
                                    add considerations
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openConsideration}>
                        <div>
                            <h5>Add Considerations or Change request items</h5>
                            <Button
                                variant="secondary"
                                onClick={toggleOpenConsideration}
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
                                            className="mb-3 mx-0"
                                        >
                                            <ListGroup.Item className="bg-light">
                                                <h6 className="mb-0">
                                                    {`${item.classification_name} > ${item.name}`}
                                                </h6>
                                            </ListGroup.Item>
                                            {item.details.map((detail) => (
                                                <ListGroupItem key={detail.id}>
                                                    {detail.name}
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    ))}
                                </Col>
                            </Row>
                            <Button
                                variant="link"
                                className="fst-italic p-0"
                                onClick={toggleOpenConsideration}
                            >
                                Add Considerations
                                <FapIcon
                                    icon="angle-double-right"
                                    size="sm"
                                    className="ms-1"
                                />
                            </Button>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default ConsiderationView;
