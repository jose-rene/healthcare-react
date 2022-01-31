import React, { useState, useEffect } from "react";
import Form from "components/elements/Form";
import useApiCall from "hooks/useApiCall";
import { PUT } from "config/URLs";
import NarrativeReportEditorForm from "./NarrativeReportEditorForm";

const EditNarrativeReport = ({ match }) => {
    const { slug = false } = match.params;

    const [{ loading }, fireLoadTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
        defaultLoading: true,
    });

    const [{ loading: saving }, fireUpdateTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
        method: PUT,
    });

    const [
        {
            data: { data: reports = [] },
        },
        fireLoadReports,
    ] = useApiCall({
        url: `request`,
    });

    const [form, setForm] = useState({
        template: "",
        test_json: "",
        styles: "",
    });

    const handleFormSubmit = (formValues) => {
        fireUpdateTemplate({ params: formValues });
    };

    const handleLoadData = async () => {
        let theJson;

        await fireLoadReports();

        const { test_json, ...others } = await fireLoadTemplate();

        try {
            theJson = JSON.stringify(test_json, null, 2);
        } catch (err) {
            console.log(err);
        }
        const formData = { test_json: theJson || "", ...others };

        //noinspection JSCheckFunctionSignatures
        setForm(formData);
    };

    useEffect(() => {
        // kick off loading the page data
        handleLoadData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? null : (
        <div>
            <Form defaultData={form} onSubmit={handleFormSubmit}>
                <NarrativeReportEditorForm
                    saving={saving}
                    slug={slug}
                    reports={reports}
                />
            </Form>
        </div>
    );
};

export default EditNarrativeReport;
