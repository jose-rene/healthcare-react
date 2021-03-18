import React from "react";
import NewRequestAddSteps1 from "./NewRequestAddSteps1";
import NewRequestAddSteps2 from "./NewRequestAddSteps2";
import NewRequestAddSteps3 from "./NewRequestAddSteps3";
import NewRequestAddSteps4 from "./NewRequestAddSteps4";
import NewRequestAddSteps5 from "./NewRequestAddSteps5";

export const getStepContent = (step) => {
    switch (step) {
        case 0:
            return <NewRequestAddSteps1 />;
        case 1:
            return <NewRequestAddSteps2 />;
        case 2:
            return <NewRequestAddSteps3 />;
        case 3:
            return <NewRequestAddSteps4 />;
        case 4:
            return <NewRequestAddSteps5 />;
    }
};
