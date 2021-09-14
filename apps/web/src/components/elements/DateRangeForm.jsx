import React, { useState } from "react";
import { Col } from "react-bootstrap";
import moment from "moment";

import { useFormContext } from "Context/FormContext";

import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";

const DateRangeForm = ({ searchObj, setSearchObj }) => {
    const { update } = useFormContext();

    const [dateRangeOptions] = useState([
        { id: "", title: "", val: "" },
        { id: "7", title: "Last 7 Days", val: "7" },
        { id: "30", title: "Last 30 Days", val: "30" },
        { id: "90", title: "Last 90 Days", val: "90" },
    ]);

    const updateDateRange = ({ target: { value } }) => {
        const toValue = value ? moment().format("YYYY-MM-DD") : "";
        const fromValue = value
            ? moment().subtract(value, "days").format("YYYY-MM-DD")
            : "";
        setSearchObj({
            ...searchObj,
            from_date: fromValue,
            to_date: toValue,
            date_range: value,
        });

        update({
            from_date: fromValue,
            to_date: toValue,
            date_range: value,
        });
    };

    return (
        <>
            <Col md={3}>
                <ContextInput
                    name="from_date"
                    label="From Date"
                    className="w-100"
                    type="date"
                />
            </Col>

            <Col md={3}>
                <ContextInput
                    name="to_date"
                    label="To Date"
                    className="w-100"
                    type="date"
                />
            </Col>

            <Col md={3}>
                <ContextSelect
                    name="date_range"
                    label="Date Range"
                    options={dateRangeOptions}
                    onChange={updateDateRange}
                />
            </Col>
        </>
    );
};

export default DateRangeForm;