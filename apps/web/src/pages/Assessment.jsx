import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import QuestionnaireForm from "../components/assessment/Questionnaire";
import apiService from "../services/apiService";

const Assessment = ({ email, full_name }) => {
    const { id } = useParams();
    const questionnaireId = null;

    // load questionnaire
    const [{ data, loading, error }, setAssessment] = useState({
        data: null,
        loading: true,
        error: null,
    });

    // load the questionnaire
    useEffect(() => {
        let isMounted = true;
        apiService(`/assessment/${id}`)
            .then((apiData) => {
                if (isMounted) {
                    setAssessment((prevState) => ({
                        ...prevState,
                        data: apiData,
                        loading: false,
                        error: null,
                    }));
                    // console.log(apiData);
                }
            })
            .catch((errorMessage) => {
                // console.log(e);
                setAssessment((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: errorMessage,
                }));
            });
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <PageLayout>
            {data ? (
                <QuestionnaireForm
                    id={data.questionnaire.id}
                    assessmentId={id}
                    answers={data.answers}
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

const mapStateToProps = ({ user: { email, full_name } }) => ({
    email,
    full_name,
});

export default connect(mapStateToProps)(Assessment);
