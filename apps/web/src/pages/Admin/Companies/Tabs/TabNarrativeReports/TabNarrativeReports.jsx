import React, { useState, useRef, useEffect } from "react";

import {
    Tabs,
    Tab,
    DropdownButton,
    Dropdown,
    NavDropdown,
} from "react-bootstrap";

import InputText from "../../../../../components/inputs/InputText";

import { validateImage } from "../../../../../helpers/validate";

import EmailTemplate from "./EmailTemplate";

const templates = [
    {
        templateName: "Secure Email (Office 365)",
        subject: "Completed DME CG Narrativo_Report_<<Auth>>",
        body:
            "Sunt incididunt cupidatat ipsum ut sunt ipsum. Ex incididunt velit irure sunt cupidatat voluptate sit. Tempor quis eiusmod aute labore sit amet sint. Cupidatat elit est officia mollit consectetur consequat enim. Voluptate in aliquip aliqua veniam qui enim aute excepteur id tempor amet laborum. Anim amet cupidatat id magna aute et enim cupidatat amet non deserunt nulla Lorem. Qui est amet minim consequat. Dolor irure id non consequat incididunt labore eiusmod ullamco occaecat occaecat. In adipisicing voluptate culpa id cillum laborum culpa Lorem labore incididunt occaecat. Mollit ut eu ut tempor elit excepteur. Irure Lorem velit Lorem veniam culpa et minim exercitation laborum quis in ut. Sint laborum aliquip quis in. Ad eiusmod duis sunt incididunt ad nostrud sunt deserunt aliqua et et Lorem incididunt duis. Lorem eu dolore anim et minim adipisicing tempor laborum proident sunt velit. Ex consectetur qui eu ut. Exercitation nulla aliqua consectetur nostrud officia veniam aliqua aute sunt ullamco dolor ipsum.",
    },
    {
        templateName: "Secure",
        subject:
            "Adipisicing laborum excepteur anim pariatur duis Lorem eiusmod.",
        body:
            "Dolore irure ullamco pariatur eu do pariatur deserunt dolore cupidatat reprehenderit mollit. Consequat laboris non ad do aliqua. Sit ipsum fugiat ex qui ad laborum anim deserunt sit ex quis. Esse minim amet laborum proident tempor pariatur elit aliquip amet laborum exercitation qui magna. Magna Lorem cillum pariatur dolor nisi et in aliqua veniam adipisicing. Aliqua quis culpa nulla mollit officia veniam laboris. Velit dolor nisi aliqua aliqua. Ipsum ut incididunt ea aliqua adipisicing aliquip nisi cillum ipsum quis ad sint esse esse. Dolore laborum velit sit incididunt officia. Magna anim sit duis laborum nisi sint dolore nostrud occaecat sint non fugiat. Sint elit ipsum aliqua adipisicing officia elit irure deserunt adipisicing sint et ea elit. Quis Lorem est tempor non veniam enim adipisicing incididunt sint laboris. Aute esse ad nisi incididunt excepteur duis minim incididunt officia deserunt culpa ex ipsum quis. Dolore pariatur aliqua laboris in id dolore elit tempor qui officia reprehenderit occaecat. Adipisicing commodo adipisicing nisi consectetur consectetur labore qui minim. Anim sit veniam commodo labore velit qui ullamco Lorem tempor ex eiusmod deserunt. Ad excepteur exercitation occaecat deserunt tempor fugiat. Aliqua nulla ut dolor non nostrud proident. Deserunt pariatur dolor cillum culpa incididunt consequat. Ipsum sint non tempor magna eiusmod. Nulla in cillum ut magna elit sint dolore nisi sunt non mollit veniam. Non veniam sint nostrud ea laboris. Minim tempor irure reprehenderit adipisicing velit qui.",
    },
];

const TabNarrativeReports = () => {
    const [activeDropdown, setActiveDropdown] = useState("Secure");
    const [activeTab, setActiveTab] = useState("submissions");
    const [activeTemplates, setActiveTemplates] = useState("");

    const hiddenFileInput = useRef(null);

    useEffect(() => {
        const activeItem = templates.filter((template) => {
            return template.templateName === activeDropdown;
        });

        setActiveTemplates(activeItem);
    }, [activeDropdown]);

    const onFileChange = (event) => {
        const fileUploaded = event.target.files[0];
        const error = validateImage(fileUploaded);

        if (error) {
            return;
        }
    };

    const onPhotoUpload = () => {
        hiddenFileInput.current.click();
    };

    const handleDropdown = (evt) => {
        setActiveDropdown(evt);
    };

    const handleTabs = (currentTab) => {
        const eventBlockList = [
            "actions",
            "Secure",
            "Secure Email (Office 365)",
        ];
        if (eventBlockList.indexOf(currentTab) === -1) {
            setActiveTab(currentTab);
        }

        return;
    };

    return (
        <div className="row">
            <div className="col-md-5">
                <div>
                    <h2 className="box-outside-title">Criteria</h2>
                    <div className="white-box mt-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Lacus sit aliquam, varius dignissim ut eu tortor egestas
                        urna. Auctor donec ac dictumst neque. Sagittis, mattis
                        mauris pulvinar diam ut odio curabitur. Et sit id nunc
                        aliquet gravida scelerisque aliquet. Nunc interdum
                        rutrum odio lorem porttitor ipsum scelerisque egestas
                        odio. Purus tincidunt ultricies id risus aenean nam urna
                        sit nulla. Et cras facilisis tempor sit pharetra.
                    </div>
                </div>

                <div>
                    <h2 className="box-outside-title">Company Logo</h2>
                    <div className="row white-box mt-0 ml-0">
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="logo-img-container">
                                <img
                                    className="logo-img"
                                    src="/images/dme-icon.svg"
                                    alt=""
                                    onClick={onPhotoUpload}
                                />
                                <div className="photo-icon-container">
                                    <img
                                        src="/images/icons/camera.svg"
                                        alt=""
                                    />
                                </div>
                                <InputText
                                    type="file"
                                    name="file"
                                    ref={hiddenFileInput}
                                    onChange={onFileChange}
                                    style={{
                                        display: "none",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="logo-alert">
                                <img
                                    src="/images/icons/alert-circle.png"
                                    alt=""
                                />

                                <div className="text">
                                    Recommended Picture Dimension is 124px x
                                    124px
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-7">
                <Tabs
                    defaultActiveKey={activeTab}
                    className="inside-tabs position-relative"
                    activeKey={activeTab}
                    onSelect={handleTabs}
                >
                    <Tab eventKey="submissions" title="Submission">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-2">
                                    <span className="submission-text">
                                        To: Email / Name
                                    </span>
                                </div>
                                <div className="col-md-10">
                                    <InputText
                                        className="submission-text-input"
                                        name="to_email"
                                        placeholder="vem@safelivingsolutionsllc.com"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <span className="submission-text">
                                        CC: Email / Name
                                    </span>
                                </div>
                                <div className="col-md-10">
                                    <InputText
                                        className="submission-text-input"
                                        name="cc_email"
                                        placeholder="test@safelivingsolutionsllc.com"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <span className="submission-text">
                                        BBC Email
                                    </span>
                                </div>
                                <div className="col-md-10">
                                    <InputText
                                        className="submission-text-input"
                                        name="bbc_email"
                                        placeholder="jerry@dme-cg.com"
                                    />
                                </div>
                            </div>

                            <NavDropdown.Divider />

                            {activeTemplates && (
                                <EmailTemplate
                                    subject={activeTemplates[0].subject}
                                    body={activeTemplates[0].body}
                                />
                            )}
                        </div>
                    </Tab>

                    <Tab eventKey="template" title="Template">
                        <div className="white-box mt-0">
                            {activeTemplates && (
                                <EmailTemplate
                                    subject={activeTemplates[0].subject}
                                    body={activeTemplates[0].body}
                                />
                            )}
                        </div>
                    </Tab>

                    <Tab
                        eventKey="actions"
                        tabClassName="position-absolute actions-tab"
                        title={
                            <DropdownButton
                                id="actions"
                                title={activeDropdown}
                                variant="default"
                                className="tab-dropdown"
                                onSelect={handleDropdown}
                            >
                                <Dropdown.Item
                                    eventKey="Secure"
                                    className="text-dark"
                                >
                                    Secure
                                </Dropdown.Item>
                                <Dropdown.Item
                                    eventKey="Secure Email (Office 365)"
                                    className="text-dark"
                                >
                                    Secure Email (Office 365)
                                </Dropdown.Item>
                            </DropdownButton>
                        }
                    />
                </Tabs>
            </div>
        </div>
    );
};

export default TabNarrativeReports;
