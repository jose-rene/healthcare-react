import React from "react";
import { useAssessmentContext } from "../../../Context/AssessmentContext";
import FapIcon from "../../elements/FapIcon";

const AssessmentSectionStatus = ({ sectionName }) => {
    const { sectionStatus } = useAssessmentContext();
    const status = sectionStatus(sectionName);

    return (
        <div className={`d-inline-block text-${status ? "primary" : "danger"}`}>
            <FapIcon
                icon={status ? "check" : "times"}
                size="sm"
                className="me-1"
            />
        </div>
    );
};

export default AssessmentSectionStatus;
