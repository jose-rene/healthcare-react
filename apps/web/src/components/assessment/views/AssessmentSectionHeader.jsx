import React from "react";
import { useAssessmentContext } from "../../../Context/AssessmentContext";
import FapIcon from "../../elements/FapIcon";

const AssessmentSectionHeader = ({ sectionName, title }) => {
    const { sectionStatus } = useAssessmentContext();
    const status = sectionStatus(sectionName);

    return (
        <div className="d-inline-block flex-grow-1">
            <div className="d-flex">
                <div
                    className={`d-inline-block text-${
                        status ? "black" : "danger"
                    }`}
                >
                    {title}
                </div>
                <FapIcon
                    icon={status ? "check" : "times"}
                    size="sm"
                    className="me-1"
                />
            </div>
        </div>
    );
};

export default AssessmentSectionHeader;
