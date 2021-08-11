import React from "react";

import Textarea from "components/inputs/Textarea";

const TabNotes = () => {
    return (
        <div className="col-lg-7 col-md-12 ps-0">
            <div className="white-box white-box-small">
                <Textarea
                    className="form-control custom-textarea-input"
                    value="Activity Update"
                />
            </div>
        </div>
    );
};

export default TabNotes;
