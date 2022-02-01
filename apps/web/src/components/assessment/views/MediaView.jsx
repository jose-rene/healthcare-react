import React, { useEffect, useState } from "react";
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
import { SortableContainer } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

import Form from "components/elements/Form";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import ConfirmationModal from "components/elements/ConfirmationModal";

import useApiCall from "hooks/useApiCall";

import MediaForm from "../forms/MediaForm";
import MediaFormRow from "../forms/MediaFormRow";

const MediaView = ({
    openMedia,
    toggleOpenMedia,
    assessmentData: { media, media_tags },
    refreshAssessment,
    refreshLoading,
    valid,
}) => {
    const { id: requestId } = useParams();

    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        if (media && media.length) {
            media.forEach((item, i) => {
                // eslint-disable-next-line no-param-reassign
                item.position = i;
            });
            setMediaList(media);
        } else {
            setMediaList([]);
        }
    }, [media]);

    const [
        showDeleteMediaConfirmationModal,
        setShowDeleteMediaConfirmationModal,
    ] = useState(false);
    const [deleteId, setDeleteId] = useState(false);

    const [{ error: fileError, loading: isUploading }, fileSubmit] = useApiCall(
        {
            method: "post",
            url: `request/${requestId}/document`,
        }
    );

    const [{ error: fileUpdateError, loading: isUpdating }, fileUpdate] =
        useApiCall({
            method: "put",
            url: `assessment/${requestId}/media`,
        });

    const [{ error: fileRemoveError, loading: isRemoving }, fireMediaRemove] =
        useApiCall({
            method: "delete",
        });

    const removeMedia = async () => {
        try {
            await fireMediaRemove({
                url: `request/${requestId}/document/${deleteId}`,
                keepLoading: true,
            });

            setShowDeleteMediaConfirmationModal(false);
            refreshAssessment("media");
        } catch (e) {
            console.log("Media delete error:", e);
        }
    };

    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        // resort array
        const newList = arrayMoveImmutable(mediaList, oldIndex, newIndex);
        // adjust positions
        newList.forEach((item, i) => {
            // eslint-disable-next-line no-param-reassign
            item.position = i;
        });
        // set params for backend
        const params = newList.map(({ id, position }) => ({ id, position }));
        // update state
        setMediaList(newList);
        // update api in background
        fileUpdate({ params });
    };

    const SortableList = SortableContainer(({ items }) => {
        return (
            <Row>
                {items.map((item, index) => (
                    <MediaFormRow
                        key={`form-row-${index}`}
                        index={index}
                        item={item}
                        removeMedia={handleDeleteMediaModal}
                    />
                ))}
            </Row>
        );
    });

    const handleDeleteMediaModal = (id = false) => {
        setShowDeleteMediaConfirmationModal(!showDeleteMediaConfirmationModal);

        id && setDeleteId(id);
    };

    return (
        <>
            <ConfirmationModal
                showModal={showDeleteMediaConfirmationModal}
                content="Are you sure that you will delete this media?"
                handleAction={removeMedia}
                handleCancel={handleDeleteMediaModal}
            />

            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success ms-n3 me-1${
                                        valid ? "" : " invisible"
                                    }`}
                                />
                                Media
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openMedia && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenMedia}
                                >
                                    {!mediaList.length
                                        ? "upload media"
                                        : "edit media"}
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
                            {fileUpdateError ? (
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {fileUpdateError}
                                </PageAlert>
                            ) : null}
                            {fileRemoveError ? (
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {fileRemoveError}
                                </PageAlert>
                            ) : null}
                            <LoadingOverlay
                                active={
                                    isUploading ||
                                    refreshLoading ||
                                    isRemoving ||
                                    isUpdating
                                }
                                spinner
                                text="Processing Media..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Row>
                                    <Col md={12}>
                                        {mediaList.length > 0 && (
                                            <>
                                                <h6 className="mb-3">
                                                    Attached Media
                                                </h6>
                                                <SortableList
                                                    items={mediaList}
                                                    axis="xy"
                                                    distance="1"
                                                    onSortEnd={onSortEnd}
                                                />
                                            </>
                                        )}
                                    </Col>
                                </Row>
                                <Form>
                                    <h6 className="mb-3">Add Media</h6>
                                    <MediaForm
                                        mediaTags={media_tags}
                                        medias={mediaList}
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
                                {mediaList.length ? (
                                    <>
                                        {mediaList.map((item) => (
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
