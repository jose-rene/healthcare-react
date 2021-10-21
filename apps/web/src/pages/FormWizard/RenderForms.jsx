import ProgressBar from "../../components/forms/ProgressBar";
import React from "react";
import { useFormProgressContext } from "../../Context/FormProgress";
import { Button } from "../../components";

const RenderForms = ({ forms = [] }) => {
    const { changeSectionStatus, sections } = useFormProgressContext();

    const handleTestThing = (sectionName) => {
        const {
            isCompleted = false,
        } = sections[sectionName];

        changeSectionStatus(sectionName, { isCompleted: !isCompleted });
    };

    return (
        <div>
            <ProgressBar />

            <div className="mb-3">
                <Button onClick={() => handleTestThing("first")}>Test Thing</Button>
            </div>
            <div className="mb-3">
                <Button onClick={() => handleTestThing("second")}>Test another Thing</Button>
            </div>
        </div>
    );
};

export default RenderForms;
