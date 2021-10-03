import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Col, Collapse, Row, Form } from "react-bootstrap";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import { useUser } from "Context/UserContext";
import dayjs from "dayjs";
import {
    fromUtc,
    fromUtcDate,
    fromUtcTime,
    formatDate,
    formatTime,
} from "../../../helpers/datetime";

const localizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(localizedFormat);

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
    const { getUser } = useUser();
    const { timeZone, timeZoneName } = getUser();

    const [{ due_date, due_time, due_na }, setDueDate] = useState({
        due_date: "",
        due_time: "",
        due_na: false,
    });

    useEffect(() => {
        if (requestDue) {
            setDueDate({
                due_date: fromUtcDate(requestDue),
                due_time: fromUtcTime(requestDue),
                due_na: false,
            });
        } else if (requestDueNa) {
            setDueDate({ due_date: "", due_time: "", due_na: true });
        }
    }, [requestDue, requestDueNa]);

    const updateData = ({ target: { name, value, checked } }) => {
        // console.log(name, value, checked);
        if (name === "due_na") {
            setDueDate((prevDue) => ({
                ...prevDue,
                due_date: "",
                due_time: "",
                due_na: checked,
            }));
            return;
        }
        setDueDate((prevDue) => ({
            ...prevDue,
            [name]: name === "due_date" ? formatDate(value) : formatTime(value),
            due_na: false,
        }));
    };

    const getTimes = useMemo(() => {
        return () => {
            const times = [{ value: "", title: "Time" }];
            // start at 7AM
            let today = dayjs(
                `${dayjs().format("YYYYMMDD")}07:00`,
                "YYYYMMDDHH:mm"
            );
            // half hour increments until 9PM
            for (let i = 0; i < 29; i++) {
                times.push({
                    id: i,
                    value: today.format("HH:mm"),
                    title: today.format("LT"),
                });
                today = today.add(30, "minutes");
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
            timeZone,
        });
    };
    // console.log("due date", due_date, due_time, due_na, requestDue);
    return (
        <>
            <Card
                className={`border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3${
                    disabled ? " disabled" : ""
                }`}
            >
                <Card.Header className="border-0 bg-light ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-3${
                                        requestDue || requestDueNa
                                            ? ""
                                            : " invisible"
                                    }`}
                                />
                                Due Date
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openDueDate && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenDueDate}
                                >
                                    {requestDue || requestDueNa
                                        ? "change"
                                        : "add"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5">
                    <Collapse in={openDueDate}>
                        <div>
                            {updateError && (
                                <PageAlert
                                    variant="warning"
                                    dismissible
                                    timeout={6000}
                                >
                                    {updateError}
                                </PageAlert>
                            )}
                            <Row>
                                <Col xl={8}>
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
                                        <div className="d-flex flex-column flex-sm-row align-items-sm-center mb-2">
                                            <div>
                                                <Form.Check
                                                    type="checkbox"
                                                    id="due_na"
                                                    name="due_na"
                                                    label="N/A"
                                                    checked={due_na}
                                                    onChange={updateData}
                                                    className="pb-1"
                                                    inline
                                                />
                                            </div>
                                            <div className="me-3">
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
                                            <div className="pb-2">
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
                                                <Button
                                                    variant="secondary"
                                                    onClick={toggleOpenDueDate}
                                                    className="me-3"
                                                >
                                                    Cancel
                                                </Button>
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
                                    {requestDue || requestDueNa ? (
                                        requestDue ? (
                                            <p>
                                                {fromUtc(
                                                    requestDue,
                                                    timeZoneName
                                                )}
                                            </p>
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
