import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import Sections from "./Sections";
import apiService from "../../services/apiService";

function Questionnaire({ id, assessmentId, answers }) {
    const formMethods = useForm({
        mode: "onBlur",
        // reValidateMode: "all",
        shouldFocusError: false,
    });
    const onSubmit = (e) => {
        e.preventDefault();
        return false;
    };

    const [{ data, loading, error }, setQuestionnaire] = useState({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        console.log(
            // "Submitting: Errors:",
            // formMethods.errors,
            "...FormState:",
            formMethods.formState.dirtyFields
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formMethods.errors, formMethods.formState]);

    // load the questionnaire
    useEffect(() => {
        let isMounted = true;
        apiService(`/questionnaire/${id}`)
            .then((apiData) => {
                if (isMounted) {
                    setQuestionnaire((prevState) => ({
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
                setQuestionnaire((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: errorMessage,
                }));
            });
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // pre-validate form when questionnaire is loaded
    useEffect(() => {
        let isMounted = true;
        if (isMounted && data) {
            console.log("loaded!", data);
            // populate answers
            if (answers) {
                answers.forEach((ans) => {
                    console.log(ans);
                    formMethods.setValue(
                        `input_${ans.question_id}`,
                        ans.value === 0 ? false : ans.value
                    );
                });
            }
            formMethods.trigger();
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    // handle form submission
    const handleSubmit = (e) => {
        const formData = formMethods.getValues();
        console.log(formData);
        apiService(`/assessment/${assessmentId}`, {
            method: "put",
            params: formData,
        })
            .then((apiData) => {
                console.log(apiData);
            })
            .catch((errorMessage) => {
                console.log(errorMessage);
            });
    };
    return (
        <div className="row" style={{ marginTop: "20px" }}>
            {
                // eslint-disable-next-line no-nested-ternary
                data ? (
                    <div className="col-12 text-center">
                        <h2>{data.title}</h2>
                        <FormProvider {...formMethods}>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="hidden"
                                    name="questionnaire_id"
                                    value={data.id}
                                    ref={formMethods.register}
                                />
                                <Sections data={data.sections} />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </form>
                        </FormProvider>
                    </div>
                ) : (
                    <div className="col-12 text-center">
                        {loading ? (
                            <p>Questionnaire loading</p>
                        ) : (
                            <p>There is an error: {error}</p>
                        )}
                    </div>
                )
            }
            <div className="col-12">
                <Link to="/dashboard">Dashboard</Link>
            </div>
        </div>
    );
}

export default Questionnaire;
