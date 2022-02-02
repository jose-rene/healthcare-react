import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";

import { useUser } from "Context/UserContext";

import FapIcon from "components/elements/FapIcon";
import Modal from "components/elements/Modal";
import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";

import { fromUtcTime, fromUtcDate } from "helpers/datetime";
import { getIcon } from "helpers/iconophy";

import useApiCall from "hooks/useApiCall";

import AddActivityForm from "./AddActivityForm";
import Item from "./TreeItem";

export default (props) => {
    const { id, request_id } = useParams(); // If request_id, request form, if id, assessment form

    const [{ error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "/activity",
    });

    const [items, setItems] = useState();
    const [selectedItems, setSelectedItems] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [defaultData] = useState({
        message: "",
    });

    const { getUser } = useUser();
    const { timeZoneName } = getUser();

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    const handleOpen = (item) => {
        setShowModal(true);

        if (item?.parent_id) {
            items.forEach((value) => {
                if (value.id === item?.parent_id) {
                    setSelectedItems([...[value], ...value.activities]);
                }
            });
        } else {
            if (item.activities) {
                setSelectedItems([...[item], ...item?.activities]);
            } else {
                setSelectedItems([item]);
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const onSubmit = async (formValues) => {
        const submissionValue = {
            ...formValues,
            ...{
                request_id: request_id ? request_id : id,
                parent_id: selectedItems[0]?.parent_id
                    ? selectedItems[0]?.parent_id
                    : selectedItems[0]?.id,
            },
        };

        try {
            await fireSubmit({ params: submissionValue });
            props.refreshAssessment("activity");
            handleClose();
        } catch (e) {
            console.log(`Activity create error:`, e);
        }
    };

    /*
        The default slot is also the labelSlot. If the user passes in
        a rendering function then we use that, otherwise we render
        the title.
     */
    const labelSlot =
        props.children instanceof Function
            ? (item) => (
                  <span onClick={() => toggleOpen(item)}>
                      {props.children(item)}
                  </span>
              )
            : (item) => (
                  <div className="content">
                      <time className="cbp_tmtime">
                          <span className="large">
                              {fromUtcTime(item.datetime, timeZoneName)}
                          </span>{" "}
                          <span>
                              {fromUtcDate(item.datetime, "MM/DD/YYYY")}
                          </span>
                      </time>
                      <div className="cbp_tmicon">
                          <FapIcon
                              icon={
                                  item.type ? getIcon(item.type) : "briefcase"
                              }
                              size="1x"
                          />
                      </div>
                      <div className="cbp_tmlabel">
                          {" "}
                          <span>{item.message}</span>{" "}
                          {item.type !== "request-update" && (
                              <Button
                                  variant="link"
                                  className="fst-italic p-0"
                                  onClick={() => handleOpen(item)}
                              >
                                  Reply
                                  <FapIcon
                                      icon="reply"
                                      size="sm"
                                      className="ms-1"
                                  />
                              </Button>
                          )}
                      </div>
                  </div>
              );

    /*
        Optional prepend slot
     */
    const prependSlot =
        props.prependSlot instanceof Function
            ? (item) => props.prependSlot(item)
            : () => props.prependSlot;

    return (
        <>
            <Modal show={showModal} size="lg" onHide={() => handleClose()}>
                <div className="p-4">
                    {selectedItems &&
                        selectedItems.length > 0 &&
                        selectedItems.map((selectedItem) => (
                            <div key={selectedItem.id}>
                                <time className="cbp_tmtime">
                                    <span className="large">
                                        {fromUtcTime(
                                            selectedItem?.datetime,
                                            timeZoneName
                                        )}
                                    </span>{" "}
                                    <span>
                                        {fromUtcDate(
                                            selectedItem?.datetime,
                                            "MM/DD/YYYY"
                                        )}
                                    </span>
                                </time>
                                <div className="cbp_tmicon">
                                    <FapIcon
                                        icon={
                                            selectedItem?.type
                                                ? getIcon(selectedItem?.type)
                                                : "briefcase"
                                        }
                                        size="1x"
                                    />
                                </div>
                                <div className="cbp_tmlabel">
                                    <span>{selectedItem?.message}</span>
                                </div>
                            </div>
                        ))}

                    <Form defaultData={defaultData} onSubmit={onSubmit}>
                        {formError && (
                            <PageAlert
                                variant="warning"
                                dismissible
                                timeout={6000}
                            >
                                {formError}
                            </PageAlert>
                        )}

                        <AddActivityForm reply />

                        <Row>
                            <Col>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleClose()}
                                    className="me-3"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
            {items && (
                <Item
                    key="1"
                    {...{
                        ...props,
                        prependSlot,
                        labelSlot,
                        toggleOpen,
                        items,
                    }}
                />
            )}
        </>
    );

    /*
        Toggle the $open state of an item 
        in the (nested) items array.
     */
    function toggleOpen(item) {
        setItems(toggle(items, item));

        function toggle(items) {
            let result = items.map((i) => {
                return i.id === item.id
                    ? {
                          ...i,
                          $open: !i.$open,
                      }
                    : {
                          ...i,
                          ...(i.items && { items: toggle(i.items) }),
                      };
            });
            return result;
        }
    }
};
