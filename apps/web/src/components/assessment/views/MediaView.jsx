import React from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    Card,
    Collapse,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
} from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import Form from "components/elements/Form";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";

import MediaForm from "../forms/MediaForm";

const MediaView = ({
    openMedia,
    toggleOpenMedia,
    assessmentData: data,
    refreshAssessment,
    refreshLoading,
}) => {
    const { id: requestId } = useParams();

    const [{ error: fileError, loading: isUploading }, fileSubmit] = useApiCall(
        {
            method: "post",
            url: `request/${requestId}/document`,
        }
    );

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Media</h5>
                        </div>
                        <div className="ms-auto">
                            {!openMedia && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenMedia}
                                >
                                    upload media
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openMedia}>
                        <div>
                            {fileError ? (
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {fileError}
                                </PageAlert>
                            ) : null}
                            <LoadingOverlay
                                active={isUploading || refreshLoading}
                                spinner
                                text="Processing Media..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Form>
                                    <MediaForm
                                        mediaTags={data?.media_tags}
                                        fileSubmit={fileSubmit}
                                        refreshAssessment={refreshAssessment}
                                        toggleOpenMedia={toggleOpenMedia}
                                    />
                                </Form>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openMedia}>
                        <div>
                            <Row className="mb-3">
                                {data?.media?.length ? (
                                    <>
                                        {data.media.map((item) => (
                                            <Col md={3}>
                                                <ListGroup
                                                    key={item.id}
                                                    className="mb-3 mx-0"
                                                >
                                                    <ListGroup.Item className="bg-light">
                                                        <h6 className="mb-0 text-center">
                                                            {item?.tags?.length
                                                                ? item
                                                                      ?.tags[0] !==
                                                                  ""
                                                                    ? item
                                                                          ?.tags[0]
                                                                    : item?.name
                                                                : item?.name}
                                                        </h6>
                                                    </ListGroup.Item>

                                                    <ListGroupItem className="d-flex justify-content-center">
                                                        <img
                                                            src={item.thumbnail}
                                                            className="img-thumbnail"
                                                            alt=""
                                                        />
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Col>
                                            <Button
                                                variant="link"
                                                className="fst-italic p-0"
                                                onClick={toggleOpenMedia}
                                            >
                                                upload media
                                                <FapIcon
                                                    icon="angle-double-right"
                                                    size="sm"
                                                    className="ms-1"
                                                />
                                                link to open form
                                            </Button>
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default MediaView;
