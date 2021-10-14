import React, { useEffect, useMemo } from "react";

import ContextSelect from "components/contextInputs/Select";

import useApiCall from "hooks/useApiCall";

const ReviewerInfoForm = () => {
    const [
        {
            data: { data = [] },
        },
        getReviewer,
    ] = useApiCall({
        url: "admin/clinicaluser/search?type_id=2",
    });

    useEffect(() => {
        getReviewer();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reviewerOptions = useMemo(() => {
        if (!data) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        data.forEach(({ id, name }) => {
            result.push({
                id,
                title: name,
                val: id,
            });
        });

        return result;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <ContextSelect
            name="reviewer_id"
            label="Reviewer"
            options={reviewerOptions}
        />
    );
};

export default ReviewerInfoForm;
