import React, { useState } from "react";
import { Col } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import dayjs from "dayjs";

const DateRangeForm = ({ searchObj, setSearchObj }) => {
    const { objUpdate } = useFormContext();

    const [dateRangeOptions] = useState([
        { id: "", title: "", val: "" },
        { id: "7", title: "Last 7 Days", val: "7" },
        { id: "30", title: "Last 30 Days", val: "30" },
        { id: "90", title: "Last 90 Days", val: "90" },
    ]);

    const updateDateRange = ({ target: { value } }) => {
        const toValue = value ? dayjs().format("YYYY-MM-DD") : "";
        const fromValue = value
            ? dayjs().subtract(value, "days").format("YYYY-MM-DD")
            : "";
        setSearchObj({
            ...searchObj,
            from_date: fromValue,
            to_date: toValue,
            date_range: value,
        });

        objUpdate({
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
                    type="date"
                    style={{ width: "100%" }}
                />
            </Col>

            <Col md={3}>
                <ContextInput
                    name="to_date"
                    label="To Date"
                    type="date"
                    style={{ width: "100%" }}
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
