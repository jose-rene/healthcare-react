import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionnaireForm from "../components/assessment/Questionnaire";
import useApiCall from "../hooks/useApiCall";
import PageLayout from "../layouts/PageLayout";

const Assessment = () => {
    const { id } = useParams();
    const [
        {
            loading,
            data: { questionnaire, answers },
            error,
        }, fireLoadAssessment] = useApiCall();

    // load the questionnaire
    useEffect(() => {
        fireLoadAssessment({
            url: `/assessment/${id}`,
        });
    }, [id]);

    return (
        <PageLayout loading={loading}>
            {questionnaire ? (
                <QuestionnaireForm
                    id={questionnaire.id}
                    assessmentId={id}
                    answers={answers}
                />
            ) : (
                <div className="col-12 text-center">
                    {loading ? (
                        <p>Assessment loading</p>
                    ) : (
                        <p>There is an error: {error}</p>
                    )}
                </div>
            )}
        </PageLayout>
    );
};

export default Assessment;
