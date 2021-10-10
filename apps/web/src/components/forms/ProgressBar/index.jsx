import React from "react";
import { Card } from "react-bootstrap";
import { useFormProgressContext } from "../../../Context/FormProgress";

const ProgressBar = () => {
    const { sectionsMapper } = useFormProgressContext();

    return (
        <Card className="mb-3 border-0 bg-light">
            <Card.Body
                className="px-0 pb-0"
                style={{ zIndex: "0" }}
            >
                <ul className="progressbar">
                    {sectionsMapper.map(({ isCompleted, label }) => {
                        return (
                            <li className={isCompleted ? "active" : "in-active"}>
                                {label}
                            </li>
                        );
                    })}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default ProgressBar;
