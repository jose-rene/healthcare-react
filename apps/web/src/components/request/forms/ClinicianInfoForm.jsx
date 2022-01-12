import React, { useEffect, useMemo } from "react";

import ContextSelect from "components/contextInputs/Select";

import useApiCall from "hooks/useApiCall";

const ClinicianInfoForm = () => {
    const [
        {
            data: { data = [] },
        },
        getClinicians,
    ] = useApiCall({
        url: "admin/clinicaluser/search",
    });

    useEffect(() => {
        getClinicians({ params: { type_id: 1 } });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clinicianOptions = useMemo(() => {
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
            name="clinician_id"
            label="Clinician"
            options={clinicianOptions}
        />
    );
};

export default ClinicianInfoForm;
