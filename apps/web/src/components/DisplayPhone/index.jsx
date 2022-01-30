import React, { useMemo } from "react";

const DisplayPhone = ({ phone }) => {
    const formattedPhone = useMemo(() => {
        const cleaned = ("" + phone).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        console.log("formattedPhone", { cleaned, match, phone });

        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }

        return phone;
    }, [phone]);

    return <span>{formattedPhone}</span>;
};

export default DisplayPhone;
