import React from "react";

import FapIcon from "components/elements/FapIcon";

const LoadingIcon = () => {
    return (
        <div className="text-center">
            <FapIcon icon="spinner" size="2x" />
            <span className="fs-3 ms-2 align-middle">Loading...</span>
        </div>
    );
};

export default LoadingIcon;
