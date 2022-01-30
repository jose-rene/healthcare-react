import React, { useState, useEffect, useMemo } from "react";

import { Button, Col, Row } from "react-bootstrap";
import PageAlert from "components/elements/PageAlert";
import FapIcon from "components/elements/FapIcon";
import useApiCall from "../../hooks/useApiCall";
import RequestInfoForm from "./forms/RequestInfoForm";
import RequestItemForm from "./forms/RequestItemForm";
import RequestDocForm from "./forms/RequestDocForm";
import MemberInfoForm from "./forms/MemberInfoForm";
import DueDateForm from "./forms/DueDateForm";

const RequestForm = ({ data }) => {
    // destructured section data from the request data
    const [requestData, setRequestData] = useState({});
    const {
        activities = [],
        id: requestId = "",
        auth_number = "",
        classification_id: classificationId,
        member: memberData = null,
        codes: requestCodes = [],
        request_items: requestItems = [],
        payer: payerProfile = null,
        documents = [],
        due_at: requestDue = "",
        due_at_na: requestDueNa = false,
        documents_na: hasNoDocuments = false,
        documents_reason: documentsReason = "",
        status = "None",
    } = requestData;

    // section togglers
    const [
        [
            openMember,
            openActivity,
            openRequestInfo,
            openRequestItem,
            openRequestDoc,
            openDueDate,
        ],
        setToggler,
    ] = useState([false, false, false, false, false]);
    // const [openMember, setOpenMember] = useState(false);,
    const setOpenMember = (open) => {
        setToggler([open, false, false, false, false]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };

    const setOpenActivity = (open) => {
        setToggler([false, open, false, false, false, false]);
    };
    const toggleOpenActivity = () => {
        setOpenActivity(!openActivity);
    };

    // const [openRequestInfo, setOpenRequestInfo] = useState(false);
    const setOpenRequestInfo = (open) => {
        setToggler([false, false, open, false, false, false]);
    };

    const toggleOpenRequestInfo = () => {
        setOpenRequestInfo(!openRequestInfo);
    };
    // const [openRequestItem, setOpenRequestItem] = useState(false);
    const setOpenRequestItem = (open) => {
        setToggler([false, false, false, open, false, false]);
    };
    const toggleOpenRequestItem = () => {
        setOpenRequestItem(!openRequestItem);
    };
    // const [openRequestDoc, setOpenRequestDoc] = useState(false);
    const setOpenRequestDoc = (open) => {
        setToggler([false, false, false, false, open, false]);
    };
    const toggleOpenRequestDoc = () => {
        setOpenRequestDoc(!openRequestDoc);
    };
    // const [openDueDate, setOpenDueDate] = useState(false);
    const setOpenDueDate = (open) => {
        setToggler([false, false, false, false, false, open]);
    };
    const toggleOpenDueDate = () => {
        setOpenDueDate(!openDueDate);
    };
    const closeAllForms = () => {
        setToggler([false, false, false, false, false, false]);
    };

    useEffect(() => {
        setRequestData(data);
    }, [data]);

    // current step
    const getStepCompleted = useMemo(() => {
        return () => {
            if (!auth_number || !requestCodes?.length || !classificationId) {
                return 1;
            }
            if (!requestItems?.length) {
                return 2;
            }
            if (!documents?.length && !hasNoDocuments) {
                return 3;
            }
            if (!requestDue && !requestDueNa) {
                return 4;
            }
            return 5;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestData]);

    const step = getStepCompleted();

    useEffect(() => {
        setOpenRequestInfo(false);
        // eslint-disable-next-line default-case
        switch (step) {
            case 1:
                setOpenRequestInfo(true);
                break;
            case 2:
                setOpenRequestItem(true);
                break;
            case 3:
                setOpenRequestDoc(true);
                break;
            case 4:
                setOpenDueDate(true);
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestData]);

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
            // console.log(result);
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
            setRequestData(result);
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

    // submit request
    const submitRequest = () => {
        closeAllForms();
        saveRequest({ type_name: "submit" });
    };

    return (
        memberData &&
        (status === "Received" ? (
            <PageAlert variant="success" icon="file-medical-alt">
                <span>Your Request, {auth_number}, has been received</span>
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
                <MemberInfoForm
                    {...{
                        memberData,
                        openMember,
                        toggleOpenMember,
                        refreshRequest,
                        requestLoading,
                    }}
                />
                <RequestInfoForm
                    {...{
                        auth_number,
                        requestCodes,
                        openRequestInfo,
                        toggleOpenRequestInfo,
                        saveRequest,
                        payerProfile,
                        classificationId,
                        requestLoading,
                        updateError,
                    }}
                />
                <RequestItemForm
                    {...{
                        requestItems,
                        payerProfile,
                        classificationId,
                        openRequestItem,
                        toggleOpenRequestItem,
                        saveRequest,
                        requestLoading,
                        updateError,
                        disabled: step < 2,
                    }}
                />
                <RequestDocForm
                    {...{
                        requestId,
                        documents,
                        refreshRequest,
                        requestLoading,
                        saveRequest,
                        hasNoDocuments,
                        documentsReason,
                        openRequestDoc,
                        toggleOpenRequestDoc,
                        disabled: step < 3,
                    }}
                />
                <DueDateForm
                    {...{
                        requestDue,
                        requestDueNa,
                        refreshRequest,
                        requestLoading,
                        openDueDate,
                        toggleOpenDueDate,
                        saveRequest,
                        updateError,
                        disabled: step < 4,
                    }}
                />
                {step === 5 && (
                    <Row className="mt-3">
                        <Col lg={6}>
                            <Button
                                variant="primary"
                                onClick={submitRequest}
                                disabled={requestLoading}
                            >
                                {requestLoading ? (
                                    <>
                                        <span className="me-2">Processing</span>
                                        <FapIcon icon="spinner" />
                                    </>
                                ) : (
                                    <span>Submit Request</span>
                                )}
                            </Button>
                        </Col>
                    </Row>
                )}
            </>
        ))
    );
};
export default RequestForm;
