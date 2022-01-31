import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { isEmpty } from "lodash";

import MemberInfoView from "components/request/views/MemberInfoView";
import LoadingIcon from "components/elements/LoadingIcon";

import useApiCall from "hooks/useApiCall";
import { useUser } from "Context/UserContext";
import ScheduleView from "./views/ScheduleView";
import ActivityView from "./views/ActivityView";
import MediaView from "./views/MediaView";
import ConsiderationView from "./views/ConsiderationView";
import AssessmentView from "./views/AssessmentView";
import DiagnosisView from "./views/DiagnosisView";
import { useAssessmentContext } from "../../Context/AssessmentContext";
import { PUT } from "../../config/URLs";

const AssessmentEditForm = ({ reasonOptions, data }) => {
    const { id } = data;
    const [assessmentData, setAssessmentData] = useState({});
    const [
        [
            openSchedule,
            openMember,
            openActivity,
            openMedia,
            openConsideration,
            openDiagnosis,
            openAssessment,
        ],
        setToggler,
    ] = useState([false, false, false, false, false, false, false]);

    const {
        isFullFormValid,
        updateFormValidation,
        isSectionValid,
        sectionStatus: getFormStatus,
        sectionsCompleted,
    } = useAssessmentContext();

    // eslint-disable-next-line
    const [{}, fireSaveAssessmentRequest] = useApiCall({
        method: PUT,
        url: `assessment/${id}/submit`,
    });

    const { userIs } = useUser();

    useEffect(() => {
        if (data) {
            setAssessmentData(data);
            updateFormValidation({
                schedule: true,
                media: true,
                considerations: true,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const setOpenSchedule = (open) => {
        setToggler([open, false, false, false, false, false, false]);
    };
    const toggleOpenSchedule = () => {
        setOpenSchedule(!openSchedule);
    };
    const setOpenMember = (open) => {
        setToggler([false, open, false, false, false, false, false]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };
    const setOpenActivity = (open) => {
        setToggler([false, false, open, false, false, false, false]);
    };
    const toggleOpenActivity = () => {
        setOpenActivity(!openActivity);
    };
    const setOpenMedia = (open) => {
        setToggler([false, false, false, open, false, false, false]);
    };
    const toggleOpenMedia = () => {
        setOpenMedia(!openMedia);
    };
    const toggleOpenConsideration = (open = null) => {
        setToggler([
            false,
            false,
            false,
            false,
            open === null ? !openConsideration : !!open,
            false,
            false,
        ]);
    };
    const toggleDiagnosis = (open = null) => {
        setToggler([
            false,
            false,
            false,
            false,
            false,
            open === null ? !openDiagnosis : !!open,
            false,
        ]);
    };
    const toggleAssessment = (open = null) => {
        setToggler([
            false,
            false,
            false,
            false,
            false,
            false,
            open === null ? !openAssessment : !!open,
        ]);
    };

    const [{ loading: refreshLoading }, fireRefreshAssessment] = useApiCall();

    const refreshAssessment = async (form = false) => {
        const refreshData = await fireRefreshAssessment({
            url: `/assessment/${data.id}`,
        });

        if (form) {
            // eslint-disable-next-line default-case
            switch (form) {
                case "member":
                    setOpenMember(false);
                    break;
                case "schedule":
                    setOpenSchedule(false);
                    break;
                case "media":
                    setOpenMedia(false);
                    break;
                case "consideration":
                    toggleOpenConsideration(false);
                    break;
                case "diagnosis":
                    toggleDiagnosis(false);
                    break;
            }
        }

        setAssessmentData(refreshData);
    };

    const {
        activities = [],
        status = "",
        member: { payer: { classifications } } = {
            payer: { classifications: [] },
        },
        request_items: requestItems = [],
        id: requestId = "",
        assessment_form: { forms = [], name: assessmentName = "" } = {
            forms: [],
            name: "",
        },
        codes: diagnosisCodes = [],
    } = assessmentData;

    const handleAssessmentSubmit = () => {
        console.log("handleAssessmentSubmit.clicked");
        fireSaveAssessmentRequest({ params: { type_name: "submit" } });
    };

    return (
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
                                    Ready to {"\n"} Schedule
                                </li>
                                <li
                                    className={
                                        status === "Scheduled" ? "active" : ""
                                    }
                                >
                                    Appointment {"\n"} Scheduled
                                </li>
                                <li>Assessment {"\n"} Started</li>
                                <li> Member {"\n"} Assessed</li>
                                <li>Report {"\n"} Complete</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-lg-center">
                {isEmpty(assessmentData) ? (
                    <Col xl={10}>
                        <LoadingIcon />
                    </Col>
                ) : (
                    <>
                        <Col xl={10}>
                            <ScheduleView
                                {...{
                                    openSchedule,
                                    toggleOpenSchedule,
                                    assessmentData,
                                    setAssessmentData,
                                    reasonOptions,
                                    refreshAssessment,
                                    refreshLoading,
                                    valid: isSectionValid("schedule"),
                                }}
                            />
                        </Col>
                        <Col xl={10}>
                            {assessmentData?.id && (
                                <MemberInfoView
                                    {...{
                                        memberData: assessmentData?.member,
                                        openMember,
                                        toggleOpenMember,
                                        refreshRequest: refreshAssessment,
                                        requestLoading: refreshLoading,
                                        assessmentForm: true,
                                    }}
                                />
                            )}
                        </Col>
                        <Col xl={10}>
                            <ActivityView
                                {...{
                                    openActivity,
                                    toggleOpenActivity,
                                    activities,
                                    refreshAssessment,
                                    refreshLoading,
                                }}
                            />
                        </Col>
                        <Col xl={10}>
                            <MediaView
                                {...{
                                    openMedia,
                                    toggleOpenMedia,
                                    assessmentData,
                                    refreshAssessment,
                                    refreshLoading,
                                    valid: isSectionValid("media"),
                                }}
                            />
                        </Col>
                        <Col xl={10}>
                            <DiagnosisView
                                {...{
                                    openDiagnosis,
                                    toggleDiagnosis,
                                    diagnosisCodes,
                                    refreshAssessment,
                                    refreshLoading,
                                    requestId,
                                }}
                            />
                        </Col>
                        {forms && forms.length ? (
                            <Col xl={10}>
                                <AssessmentView
                                    {...{
                                        forms,
                                        assessmentName,
                                        requestId,
                                        getFormStatus,
                                        openAssessment,
                                        toggleAssessment,
                                        valid: sectionsCompleted,
                                    }}
                                />
                            </Col>
                        ) : null}
                        <Col xl={10}>
                            <ConsiderationView
                                {...{
                                    openConsideration,
                                    toggleOpenConsideration,
                                    classifications,
                                    requestItems,
                                    refreshAssessment,
                                    refreshLoading,
                                    requestId,
                                    valid: isSectionValid("considerations"),
                                }}
                            />
                        </Col>
                        <Col xl={10}>
                            <Button
                                className="mt-3"
                                disabled={!isFullFormValid}
                                onClick={handleAssessmentSubmit}
                            >
                                {status === "Submitted" ? "Update" : "Submit"}
                            </Button>
                            {status === "Submitted" &&
                                userIs([
                                    "clinical_reviewer",
                                    "reviewer_manager",
                                ]) && (
                                    <a
                                        href={`/request/${id}/template/default`}
                                        className="ms-4 mt-3 btn btn-success"
                                    >
                                        Narrative Report
                                    </a>
                                )}
                        </Col>
                    </>
                )}
            </Row>
        </>
    );
};

export default AssessmentEditForm;
