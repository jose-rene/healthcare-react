import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { isEmpty } from "lodash";

import MemberInfoView from "components/request/views/MemberInfoView";
import LoadingIcon from "components/elements/LoadingIcon";

import useApiCall from "hooks/useApiCall";
import ScheduleView from "./views/ScheduleView";
import ActivityView from "./views/ActivityView";
import MediaView from "./views/MediaView";
import ConsiderationView from "./views/ConsiderationView";


const AssessmentEditForm = ({ reasonOptions, data }) => {
    const [assessmentData, setAssessmentData] = useState({});
    const [
        [openSchedule, openMember, openActivity, openMedia, openConsideration],
        setToggler] = useState([false, false, false, false, false]);

    useEffect(() => {
        if (data) {
            setAssessmentData(data);
        }
    }, [data]);

    const setOpenSchedule = (open) => {
        setToggler([open, false, false, false, false]);
    };
    const toggleOpenSchedule = () => {
        setOpenSchedule(!openSchedule);
    };
    const setOpenMember = (open) => {
        setToggler([false, open, false, false, false]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };
    const setOpenActivity = (open) => {
        setToggler([false, false, open, false, false]);
    };
    const toggleOpenActivity = () => {
        setOpenActivity(!openActivity);
    };
    const setOpenMedia = (open) => {
        setToggler([false, false, false, open, false]);
    };
    const toggleOpenMedia = () => {
        setOpenMedia(!openMedia);
    };
    const setOpenConsideration = (open) => {
        setToggler([false, false, false, false, open]);
    };
    const toggleOpenConsideration = () => {
        setOpenConsideration(!openConsideration);
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
                    setOpenConsideration(false);
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
    } = assessmentData;

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
                                <li>Appointment {"\n"} Completed</li>
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
                                }}
                            />
                        </Col>
                        <Col xl={10}>
                            <ConsiderationView
                                {...{
                                    openConsideration,
                                    toggleOpenConsideration,
                                    classifications,
                                    requestItems,
                                    refreshAssessment,
                                    refreshLoading,
                                }}
                            />
                        </Col>
                    </>
                )}
            </Row>
        </>
    );
};

export default AssessmentEditForm;
