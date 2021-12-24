import React from "react";

import InputText from "components/inputs/InputText";
import TextArea from "components/inputs/Textarea";
import Checkbox from "components/inputs/Checkbox";

const EmailTemplate = ({ subject, body }) => {
    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <span className="submission-text-bold">Email Contents</span>
                </div>
                <div className="col-md-9 d-flex justify-content-end align-items-center">
                    <div className="ml-3">
                        <Checkbox
                            labelLeft
                            name="user-golbal-settings"
                            label="User Global Settings"
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <span className="submission-text">Subject</span>
                </div>
                <div className="col-md-10">
                    <InputText
                        className="submission-text-input"
                        placeholder="jerry@dme-cg.com"
                        value={subject || ""}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <span className="submission-text">Body</span>
                </div>
                <div className="col-md-10">
                    <TextArea
                        className="submission-textarea-input"
                        placeholder="jerry@dme-cg.com"
                        value={body || ""}
                    />
                </div>
            </div>
        </>
    );
};

export default EmailTemplate;
