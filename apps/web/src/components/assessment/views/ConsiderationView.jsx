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
import ConsiderationForm from "../forms/ConsiderationsForm";

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
                                }}
                            />
                        </div>
                    </Collapse>
                    <Collapse in={!openConsideration}>
                        <div>
                            <Row>
                                <Col>
                                    {requestItems.map((item) =>
                                        item.considerations.map(
                                            ({ classification_name, name }) => (
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
                                                            {`${classification_name} > ${name}`}
                                                        </h6>
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
                                            )
                                        )
                                    )}
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
