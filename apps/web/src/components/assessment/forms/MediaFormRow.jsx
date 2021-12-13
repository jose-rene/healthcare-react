import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { sortableElement, sortableHandle } from "react-sortable-hoc";

import FapIcon from "components/elements/FapIcon";

const DragHandle = sortableHandle(() => (
    <FapIcon icon="grip-vertical" className="mb-3" />
));

const MediaFormRow = sortableElement(({ item, removeMedia }) => (
    <Row>
        <Col md={12} className="d-flex align-items-center">
            <DragHandle />
            <ListGroup key={item.id} className="mb-3 w-100">
                {item.tags[0] && (
                    <ListGroup.Item className="bg-light">
                        <h6 className="mb-0">{item.tags[0]}</h6>
                    </ListGroup.Item>
                )}
                <ListGroupItem>
                    <span className="float-start">{item.name}</span>
                    <Button
                        variant="link"
                        className="float-end p-0"
                        onClick={() => {
                            removeMedia(item.id);
                        }}
                    >
                        <FapIcon icon="delete" />
                    </Button>
                </ListGroupItem>
            </ListGroup>
        </Col>
    </Row>
));

export default MediaFormRow;
