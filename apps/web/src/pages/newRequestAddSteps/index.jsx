import React from "react";

export { default as NewRequestAddSteps1 } from "NewRequestAddSteps1";
export { default as NewRequestAddSteps2 } from "NewRequestAddSteps2";
export { default as NewRequestAddSteps3 } from "NewRequestAddSteps3";
export { default as NewRequestAddSteps4 } from "NewRequestAddSteps4";
export { default as NewRequestAddSteps5 } from "NewRequestAddSteps5";

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
