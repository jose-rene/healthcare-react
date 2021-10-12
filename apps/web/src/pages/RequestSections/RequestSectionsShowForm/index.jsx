import React from "react";
import PageLayout from "../../../layouts/PageLayout";

const RequestSectionsShowForm = (props) => {
    const { params } = props.match;
    const { request_id, form_id } = params;

    // TODO :: load form with answers
    // TODO :: load request
    // TODO :: render form using form show component

    return (
        <PageLayout>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </PageLayout>
    );
};

export default RequestSectionsShowForm;
