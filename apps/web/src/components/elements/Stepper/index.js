import React from "react";
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    makeStyles,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import "./stepper.css";
import { getStepContent } from "../../../pages/newRequestAddSteps";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    buttonNext: {
        width: "177px",
        height: "35px",
        backgroundColor: "#2E94E6",
        color: "#FFF",
        "&:hover": { backgroundColor: "#2E94E6" },
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "19px",
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(3),
    },
    buttonPrevious: {
        width: "177px",
        height: "35px",
        borderColor: "#2E94E5",
        "&:hover": { backgroundColor: "#FFF" },
        borderWidth: "2px",
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#2E94E6",
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(3),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(10),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    circle: {
        width: 58,
        height: 58,
        borderRadius: "50%",
        backgroundColor: "#DADEE0",
        marginLeft: -15,
    },
    completed: {
        color: "#fff",
        fontSize: 22,
        width: 58,
        height: 58,
        borderRadius: "50%",
        backgroundColor: "#2E94E5",
        marginLeft: -15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const ChangeStyle = ({ active, completed }) => {
    const classes = useStyles();

    return (
        <div className={[classes.root, active && classes.active]}>
            {completed ?
                <div className={classes.completed}><i
                    className="fas fa-check" /></div> :
                <div className={classes.circle} />}
        </div>
    );
};

ChangeStyle.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

function getSteps () {
    return [
        "Verify Member Information",
        "Unique Assessment ID",
        "Relevant Diagnosis",
        "Request Category/Type",
        "Due Date",
    ];
}

const Stepper = NewRequestAdd = () => {
    const classes = useStyles();
    const steps = getSteps();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <div className={classes.root}>
                <Stepper
                    className={classes.active}
                    activeStep={activeStep}
                    orientation="vertical"
                >
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel
                                StepIconComponent={ChangeStyle}
                            >{label}
                            </StepLabel>
                            <StepContent>
                                <Typography
                                    component={"span"}
                                    variant={"body2"}
                                >
                                    {getStepContent(index)}
                                </Typography>
                                <div className="col-lg-12" style={{
                                    padding: "0px",
                                    marginTop: "78px",
                                }}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    className="btn-blue btn-outline">Back
                                            </button>
                                        </div>

                                        <div className="col-lg-6">
                                            <button
                                                onClick={handleNext}
                                                className="btn-blue text-btn"
                                            >
                                                {activeStep === steps.length - 1
                                                    ? "Create New Request"
                                                    : "Next"}</button>
                                        </div>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </>
    );
};
export default Stepper;
