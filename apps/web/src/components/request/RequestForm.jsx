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
        id: requestId = "",
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
    const [openMember, setOpenMember] = useState(false);
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };
    const [openRequestInfo, setOpenRequestInfo] = useState(false);
    const toggleOpenRequestInfo = () => {
        setOpenRequestInfo(!openRequestInfo);
    };
    const [openRequestItem, setOpenRequestItem] = useState(false);
    const toggleOpenRequestItem = () => {
        setOpenRequestItem(!openRequestItem);
    };
    const [openRequestDoc, setOpenRequestDoc] = useState(false);
    const toggleOpenRequestDoc = () => {
        setOpenRequestDoc(!openRequestDoc);
    };
    const [openDueDate, setOpenDueDate] = useState(false);
    const toggleOpenDueDate = () => {
        setOpenDueDate(!openDueDate);
    };

    useEffect(() => {
        setRequestData(data);
    }, [data]);

    // current step
    const getStepCompleted = useMemo(() => {
        return () => {
            if (!auth_number || !requestCodes?.length) {
                return 1;
            }
            if (!requestItems?.length) {
                return 2;
            }
            if (!documents?.length) {
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
    }, [step]);

    // console.log("step -> ", step, data.status, requestDue);

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
            const result = await fireSubmit({ method: "get" });
            // close
            if (form && form === "doc") {
                setOpenRequestDoc(false);
            }
            setRequestData(result);
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

    // submit request
    const submitRequest = () => {
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
                    }}
                />
                <RequestInfoForm
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
                <RequestItemForm
                    {...{
                        requestItems,
                        payerProfile,
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
                            <Button variant="primary" onClick={submitRequest}>
                                Submit Request
                            </Button>
                        </Col>
                    </Row>
                )}
            </>
        ))
    );
};
export default RequestForm;
