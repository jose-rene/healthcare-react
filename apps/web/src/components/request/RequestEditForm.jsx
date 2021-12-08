import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

import PageAlert from "components/elements/PageAlert";
import FapIcon from "components/elements/FapIcon";

import { useUser } from "Context/UserContext";

import useApiCall from "hooks/useApiCall";
import RequestItemView from "./views/RequestItemView";
import MemberInfoView from "./views/MemberInfoView";
import RequestInfoView from "./views/RequestInfoView";
import RequestDocView from "./views/RequestDocView";
import DueDateView from "./views/DueDateView";
import ClinicianInfoView from "./views/ClinicianInfoView";

import "styles/request-progress.scss";

const RequestEditForm = ({ data }) => {
    const { userIs } = useUser();

    // destructured section data from the request data
    const [requestData, setRequestData] = useState({});
    const {
        id: requestId = "",
        clinician = null,
        reviewer = null,
        auth_number = "",
        member: memberData = null,
        codes: requestCodes = [],
        request_items: requestItems = [],
        payer: payerProfile = null,
        documents = [],
        due_at: requestDue = "",
        due_at_na: requestDueNa = false,
        status = "None",
    } = requestData;

    // section togglers
    const [
        [
            openClinicianInfo,
            openMember,
            openRequestInfo,
            openRequestItem,
            openRequestDoc,
            openDueDate,
        ],
        setToggler,
    ] = useState([false, false, false, false, false, false]);

    const setClinicianInfo = (open) => {
        setToggler([open, false, false, false, false, false]);
    };
    const toggleOpenClinicianInfo = () => {
        setClinicianInfo(!openClinicianInfo);
    };

    const setOpenMember = (open) => {
        setToggler([false, open, false, false, false, false]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };

    const setOpenRequestInfo = (open) => {
        setToggler([false, false, open, false, false, false]);
    };
    const toggleOpenRequestInfo = () => {
        setOpenRequestInfo(!openRequestInfo);
    };

    const setOpenRequestItem = (open) => {
        setToggler([false, false, false, open, false, false]);
    };
    const toggleOpenRequestItem = () => {
        setOpenRequestItem(!openRequestItem);
    };

    const setOpenRequestDoc = (open) => {
        setToggler([false, false, false, false, open, false]);
    };
    const toggleOpenRequestDoc = () => {
        setOpenRequestDoc(!openRequestDoc);
    };

    const setOpenDueDate = (open) => {
        setToggler([false, false, false, false, false, open]);
    };
    const toggleOpenDueDate = () => {
        setOpenDueDate(!openDueDate);
    };

    useEffect(() => {
        setRequestData(data);
    }, [data]);

    // api call to update request
    const [{ error: updateError, loading: requestLoading }, fireSubmit] =
        useApiCall({
            method: "put",
            url: `request/${data.id}`,
        });
    // save request
    const saveRequest = async (formData) => {
        try {
            const result = await fireSubmit({ params: formData });
            const { type_name: type } = formData;
            // toggle the edit window
            if (type === "diagnosis") {
                setOpenRequestInfo(false);
            }
            if (type === "request-items") {
                setOpenRequestItem(false);
            }
            if (type === "due") {
                setOpenDueDate(false);
            }
            setRequestData(result);
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

    // refresh request
    const refreshRequest = async (form) => {
        try {
            // @note set persist changes to false, otherwise fireSubmit will change to a get request
            const result = await fireSubmit({
                method: "get",
                persist_changes: false,
            });
            // close
            if (form && form === "doc") {
                setOpenRequestDoc(false);
            }
            if (form && form === "member") {
                setOpenMember(false);
            }
            if (form && form === "clinician") {
                setClinicianInfo(false);
            }
            setRequestData(result);
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

    // submit request
    // const submitRequest = () => {
    //     saveRequest({ type_name: "submit" });
    // };

    return (
        memberData &&
        (status === "Completed" ? (
            <PageAlert variant="success" icon="file-medical-alt">
                <span>Your Request, {auth_number}, has been completed</span>
                <Button
                    href="/healthplan/start-request"
                    className="ms-3 px-2"
                    variant="outline-success"
                >
                    <span className="ms-1">
                        Enter another <FapIcon icon="chevron-right" size="1x" />
                    </span>
                </Button>
            </PageAlert>
        ) : (
            <>
                <Row className="justify-content-lg-center">
                    <Col xl={11}>
                        <Card className="mb-3 border-0 bg-light">
                            <Card.Body
                                className="px-0 pb-0"
                                style={{ zIndex: "0" }}
                            >
                                <ul className="progressbar">
                                    <li className="active">
                                        Request {"\n"} Submitted
                                    </li>
                                    <li
                                        className={
                                            status === "Assigned" ||
                                            status === "Scheduled"
                                                ? "active"
                                                : ""
                                        }
                                    >
                                        Therapist {"\n"} Assigned
                                    </li>
                                    <li
                                        className={
                                            status === "Scheduled"
                                                ? "active"
                                                : ""
                                        }
                                    >
                                        Appointment {"\n"} Scheduled
                                    </li>
                                    <li> In {"\n"} Review</li>
                                    <li>Report {"\n"} Complete</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        {userIs([
                            "software_engineer",
                            "client_services_specialist",
                        ]) && (
                            <ClinicianInfoView
                                {...{
                                    requestId,
                                    clinician,
                                    reviewer,
                                    openClinicianInfo,
                                    toggleOpenClinicianInfo,
                                    refreshRequest,
                                    requestLoading,
                                }}
                            />
                        )}
                        <MemberInfoView
                            {...{
                                memberData,
                                openMember,
                                toggleOpenMember,
                                refreshRequest,
                                requestLoading,
                            }}
                        />
                        <RequestInfoView
                            {...{
                                auth_number,
                                requestCodes,
                                openRequestInfo,
                                toggleOpenRequestInfo,
                                saveRequest,
                                requestLoading,
                                updateError,
                            }}
                        />
                        <RequestItemView
                            {...{
                                requestItems,
                                payerProfile,
                                openRequestItem,
                                toggleOpenRequestItem,
                                saveRequest,
                                requestLoading,
                                updateError,
                            }}
                        />
                        <RequestDocView
                            {...{
                                requestId,
                                documents,
                                refreshRequest,
                                requestLoading,
                                openRequestDoc,
                                toggleOpenRequestDoc,
                            }}
                        />
                        <DueDateView
                            {...{
                                requestDue,
                                requestDueNa,
                                refreshRequest,
                                requestLoading,
                                openDueDate,
                                toggleOpenDueDate,
                                saveRequest,
                                updateError,
                            }}
                        />
                    </Col>
                </Row>
            </>
        ))
    );
};
export default RequestEditForm;
