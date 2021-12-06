import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import MemberInfoView from "components/request/views/MemberInfoView";
import useApiCall from "hooks/useApiCall";
import ScheduleView from "./views/ScheduleView";
import ActivityView from "./views/ActivityView";

const AssessmentEditForm = ({ reasonOptions, data }) => {
    const [assessmentData, setAssessmentData] = useState({});
    const [[openSchedule, openMember, openActivity], setToggler] = useState([
        false,
        false,
        false,
    ]);

    useEffect(() => {
        if (data) {
            setAssessmentData(data);
        }
    }, [data]);

    const setOpenSchedule = (open) => {
        setToggler([open, false, false]);
    };
    const toggleOpenSchedule = () => {
        setOpenSchedule(!openSchedule);
    };
    const setOpenMember = (open) => {
        setToggler([false, open, false]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };
    const setOpenActivity = (open) => {
        setToggler([false, false, open]);
    };
    const toggleOpenActivity = () => {
        setOpenActivity(!openActivity);
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
            }
        }

        setAssessmentData(refreshData);
    };

    const { activities = [] } = assessmentData;

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
                                <li>Appointment {"\n"} Scheduled</li>
                                <li>Appointment {"\n"} Completed</li>
                                <li> Member {"\n"} Assessed</li>
                                <li>Report {"\n"} Complete</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-lg-center">
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
            </Row>
        </>
    );
};

export default AssessmentEditForm;
