import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import QuestionnaireForm from "components/assessment/Questionnaire";

/* eslint-disable react/jsx-props-no-spreading */

const Questionnaire = ({ email, full_name }) => {
    const { id } = useParams();
    // console.log("questionnaire id", id);
    return (
        <PageLayout>
            <QuestionnaireForm id={id} />
        </PageLayout>
    );
};

const mapStateToProps = ({ user: { email, full_name } }) => ({
    email,
    full_name,
});

export default connect(mapStateToProps)(Questionnaire);
