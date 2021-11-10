import React from "react";
import dayjs from "dayjs";

import FapIcon from "components/elements/FapIcon";

const PageFooter = () => {
    const now = dayjs();

    return (
        <div className="d-flex justify-content-center align-items-center my-3 fw-light">
            <FapIcon icon="copyright" size="1x" />
            <span className="px-2">{now.year()} Periscope</span>
        </div>
    );
};

export default PageFooter;
