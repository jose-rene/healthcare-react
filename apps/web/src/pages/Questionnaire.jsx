import React from "react";
import { useParams } from "react-router-dom";
import QuestionnaireForm from "components/assessment/Questionnaire";
import PageLayout from "../layouts/PageLayout";

/* eslint-disable react/jsx-props-no-spreading */

const Questionnaire = () => {
    const { id } = useParams();
    // console.log("questionnaire id", id);
    return (
        <PageLayout>
            <QuestionnaireForm id={id} />
        </PageLayout>
    );
};

export default Questionnaire;
