import React from "react";
import { Col, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { sortableElement } from "react-sortable-hoc";

import FapIcon from "components/elements/FapIcon";

const MediaFormRow = sortableElement(({ item, removeMedia }) => (
    <Col md={3} className="d-flex align-items-center">
        <ListGroup key={item.id} className="mb-3 w-100">
            <ListGroup.Item className="bg-light">
                <h6 className="mb-0 text-center">
                    {item?.tags?.length
                        ? item?.tags[0] !== ""
                            ? item?.tags[0]
                            : item?.name
                        : item?.name}
                </h6>
                <Button
                    variant="link"
                    className="position-absolute top-0 end-0"
                    onClick={() => {
                        removeMedia(item.id);
                    }}
                >
                    <FapIcon icon="delete" />
                </Button>
            </ListGroup.Item>
            <ListGroupItem className="d-flex justify-content-center">
                <img src={item.thumbnail} className="img-thumbnail" alt="" />
            </ListGroupItem>
        </ListGroup>
    </Col>
));

export default MediaFormRow;
