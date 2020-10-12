import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import apiService from "../services/apiService";
import DashLayout from "../layouts/dashLayout";
import Sections from "../components/assessment/Sections";
/* eslint-disable react/jsx-props-no-spreading */

const Questionnaire = ({ email, full_name }) => {
  const { id } = useParams();
  const formMethods = useForm();
  const onSubmit = (data) => {
    apiService("/assessment", { method: "post", params: data });
    console.log("submit", data);
  };

  // @todo move this to custom hook
  const [{ data, loading, error }, setQuestionnaire] = useState({
    data: null,
    loading: true,
    error: null,
  });
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
  }, [id]);
  return (
    <DashLayout>
      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col-12">
          <p>
            Hello Questionnaire! {email} {full_name}
          </p>
        </div>
        {
          // eslint-disable-next-line no-nested-ternary
          data ? (
            <div className="col-12 text-center">
              <h2>{data.title}</h2>
              <p>There is a questionnaire</p>
              <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                  <input
                    type="hidden"
                    name="questionnaire_id"
                    value={data.id}
                    ref={formMethods.register}
                  />
                  <Sections data={data.sections} />
                  <button type="submit" className="btn btn-primary">
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
                <p>There is an error</p>
              )}
            </div>
          )
        }
        <div className="col-12">
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </DashLayout>
  );
};

const mapStateToProps = ({ user: { email, full_name } }) => ({
  email,
  full_name,
});

export default connect(mapStateToProps)(Questionnaire);
