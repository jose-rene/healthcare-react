import React from "react";

const GryRowSpace = () => {
    return <div className="pt-3" />;
};

GryRowSpace.register = {
    icon: "fas fa-space",
    name: "Row Space",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryRowSpace;
