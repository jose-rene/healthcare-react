import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Collapse } from "react-bootstrap";

import ActivityForm from "../forms/ActivityForm";

import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";

import "./styles.scss";

const ActivityView = ({ openActivity, toggleOpenActivity, activities}) => {

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Activities</h5>
                        </div>
                        <div className="ms-auto">
                            {!openActivity && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenActivity}
                                >
                                    add activity
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openActivity}>
                        <ActivityForm
                            items={activities}
                            expanderOpen={
                                <FapIcon icon="folder-minus" size="1x" />
                            }
                            expanderClosed={
                                <FapIcon icon="folder-plus" size="1x" />
                            }
                        />
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default ActivityView;
