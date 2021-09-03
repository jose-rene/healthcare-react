import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { Button, Card, Col, Collapse, Row, Form } from "react-bootstrap";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";

/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */

const DueDateForm = ({
    requestDue,
    requestDueNa,
    requestLoading,
    openDueDate,
    toggleOpenDueDate,
    saveRequest,
    updateError,
    disabled,
}) => {
    const [{ due_date, due_time, due_na }, setDueDate] = useState({
        due_date: "",
        due_time: "",
        due_na: false,
    });

    useEffect(() => {
        if (requestDue) {
            setDueDate({
                due_date: moment(requestDue).format("YYYY-MM-DD"),
                due_time: moment(requestDue).format("HH:mm"),
                due_na: false,
            });
        } else if (requestDueNa) {
            setDueDate({ due_date: "", due_time: "", due_na: true });
        }
    }, [requestDue, requestDueNa]);

    const updateData = ({ target: { name, value, checked } }) => {
        console.log(name, value, checked);
        if (name === "due_date") {
            setDueDate((prevDueDate) => ({
                ...prevDueDate,
                [name]: moment(value).format("YYYY-MM-DD"),
                due_na: false,
            }));
            return;
        }
        if (name === "due_time") {
            setDueDate((prevDueDate) => ({
                ...prevDueDate,
                [name]: moment(value, "HH:mm").format("HH:mm"),
                due_na: false,
            }));
            return;
        }

        if (name === "due_na") {
            setDueDate({
                due_date: "",
                due_time: "",
                due_na: checked,
            });
        }
    };

    const getTimes = useMemo(() => {
        return () => {
            const times = [{ value: "", title: "Time" }];
            // start at 7AM
            const today = moment(
                `${moment().format("YYYYMMDD")}07:00`,
                "YYYYMMDDHH:mm"
            );
            // half hour increments until 9PM
            for (let i = 0; i < 29; i++) {
                times.push({
                    id: i,
                    value: today.format("HH:mm"),
                    title: today.format("LT"),
                });
                today.add(30, "minutes");
            }
            return times;
        };
    }, []);
    // save the due date
    const handleSave = () => {
        saveRequest({
            type_name: "due",
            due_at: `${due_date} ${due_time}`,
            due_at_na: due_na,
        });
    };
    // console.log("due date", due_date, due_time, due_na, requestDue);
    return (
        <>
            <Card className={`border-1 mt-3${disabled ? " disabled" : ""}`}>
                <Card.Header className="border-0 bg-white ps-2">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-1${
                                        requestDue || requestDueNa
                                            ? ""
                                            : " invisible"
                                    }`}
                                />
                                Request Due Date
                            </h5>
                        </div>
                        <div className="ms-auto">
                            <Button variant="link" onClick={toggleOpenDueDate}>
                                {openDueDate
                                    ? "close"
                                    : requestDue || requestDueNa
                                        ? "change"
                                        : "add"}
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5">
                    <Collapse in={openDueDate}>
                        <div>
                            {
                                // check for openDueDate will show if disabled due to opacity
                                updateError && openDueDate && (
                                    <PageAlert
                                        variant="warning"
                                        dismissible
                                        timeout={6000}
                                    >
                                        {updateError}
                                    </PageAlert>
                                )
                            }
                            <Row>
                                <Col lg={6}>
                                    <LoadingOverlay
                                        active={requestLoading}
                                        spinner
                                        text="Updating..."
                                        styles={{
                                            overlay: (base) => ({
                                                ...base,
                                                borderRadius: "12px",
                                            }),
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="pb-1">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="due_na"
                                                    name="due_na"
                                                    label="N/A"
                                                    checked={due_na}
                                                    onChange={updateData}
                                                />
                                            </div>
                                            <div className="ms-4">
                                                <Form.Label htmlFor="due_date">
                                                    Due Date
                                                </Form.Label>
                                            </div>
                                            <div className="ms-2">
                                                <Form.Control
                                                    className="mb-2"
                                                    id="due_date"
                                                    name="due_date"
                                                    type="date"
                                                    value={due_date}
                                                    disabled={due_na}
                                                    onChange={updateData}
                                                />
                                            </div>
                                            <div className="ms-2 pb-2">
                                                <Form.Select
                                                    name="due_time"
                                                    label="Time"
                                                    onChange={updateData}
                                                    disabled={due_na}
                                                    value={due_time}
                                                >
                                                    {getTimes().map(
                                                        ({
                                                            id,
                                                            value: val,
                                                            title,
                                                        }) => (
                                                            <option
                                                                value={val}
                                                                key={id}
                                                            >
                                                                {title}
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                            </div>
                                        </div>
                                        <Row>
                                            <Col>
                                                <Button onClick={handleSave}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </LoadingOverlay>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                    <Collapse in={!openDueDate}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Due Date
                                </Col>
                                <Col>
                                    {requestDue || requestDueNa ? (
                                        requestDue ? (
                                            <p>{`${moment(requestDue).format(
                                                "YYYY-MM-DD"
                                            )} ${moment(requestDue).format(
                                                "LT"
                                            )}`}</p>
                                        ) : (
                                            <p>N/A</p>
                                        )
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenDueDate}
                                        >
                                            Enter Due Date
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
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

export default DueDateForm;
