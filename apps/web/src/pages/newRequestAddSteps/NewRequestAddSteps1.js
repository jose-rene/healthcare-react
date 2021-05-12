import React, { useMemo } from "react";
import { isEmpty } from "lodash";

import Switch from "../../components/inputs/Switch";
import Modal from "../../components/modal/Modal";

import "./newRequestAddSteps.css";

const NewRequestAddSteps1 = ({
    memberData,
    payerProfile,
    memberVerified,
    setMemberVerified,
}) => {
    const address = useMemo(() => {
        if (isEmpty(memberData)) {
            return "";
        }

        return memberData.member.address;
    }, [memberData]);

    const phone = useMemo(() => {
        if (isEmpty(memberData)) {
            return "";
        }

        return memberData.member.phone;
    }, [memberData]);

    const plan = useMemo(() => {
        if (isEmpty(memberData)) {
            return "";
        }

        return memberData.member.payer;
    }, [memberData]);

    const lob = useMemo(() => {
        if (isEmpty(memberData)) {
            return "";
        }

        return memberData.member.lob;
    }, [memberData]);

    const member = useMemo(() => {
        if (isEmpty(memberData)) {
            return "";
        }

        return memberData.member;
    }, [memberData]);

    const handleToggle = (checked, index) => {
        setMemberVerified((prevData) => {
            const verified = [...prevData];
            verified[index] = checked;
            return verified;
        });
    };

    return (
        <>
            <div className="container-info">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-6 pl-0">
                            <p className="title-info">
                                Verify Member Information
                            </p>
                            <p className="subtitle-info">
                                <i className="fas fa-exclamation-triangle" />{" "}
                                Verify the member information using the toggles
                                bellow
                            </p>
                        </div>

                        <div className="col-md-10 checkbox inline row ml-0">
                            <div className="col-md-4">
                                <p className="text-checkbox title-row">
                                    Address
                                </p>
                            </div>

                            <div className="col-md-5">
                                {(address && (
                                    <p className="text-checkbox">
                                        {`${address.address_1} ${address.city}, ${address.state} ${address.postal_code}`}
                                    </p>
                                )) ||
                                    ""}
                            </div>

                            <div className="col-md-2 my-auto">
                                <Switch
                                    checked={!!memberVerified[0]}
                                    onChange={(e) =>
                                        handleToggle(e.target.checked, 0)
                                    }
                                />
                            </div>

                            <div className="col-md-1 my-auto">
                                <Modal
                                    title="Edit Member Address"
                                    nameField="address"
                                    data={address}
                                    member_id={member.id}
                                    payerProfile={payerProfile}
                                />
                            </div>
                        </div>

                        <div className="col-md-10 checkbox inline row ml-0">
                            <div className="col-md-4">
                                <p className="text-checkbox title-row">Phone</p>
                            </div>

                            <div className="col-md-5">
                                <p className="text-checkbox">{phone?.number}</p>
                            </div>

                            <div className="col-md-2 my-auto">
                                <Switch
                                    checked={!!memberVerified[1]}
                                    onChange={(e) =>
                                        handleToggle(e.target.checked, 1)
                                    }
                                />
                            </div>

                            <div className="col-md-1 my-auto">
                                <Modal
                                    title="Edit Member Phone"
                                    nameField="phone"
                                    data={phone}
                                    member_id={member.id}
                                    payerProfile={payerProfile}
                                />
                            </div>
                        </div>

                        <div className="col-md-10 checkbox inline row ml-0">
                            <div className="col-md-4">
                                <p className="text-checkbox title-row">Plan</p>
                            </div>

                            <div className="col-md-5">
                                <p className="text-checkbox">
                                    {plan.company_name}
                                </p>
                            </div>

                            <div className="col-md-2 my-auto">
                                <Switch
                                    checked={!!memberVerified[2]}
                                    onChange={(e) =>
                                        handleToggle(e.target.checked, 2)
                                    }
                                />
                            </div>

                            <div className="col-md-1 my-auto">
                                <Modal
                                    title="Edit Member Plan"
                                    nameField="plan"
                                    data={plan}
                                    member_id={member.id}
                                    payerProfile={payerProfile}
                                />
                            </div>
                        </div>

                        <div className="col-md-10 checkbox inline row ml-0">
                            <div className="col-md-4">
                                <p className="text-checkbox title-row">
                                    Line of Business
                                </p>
                            </div>

                            <div className="col-md-5">
                                <p className="text-checkbox">{lob.name}</p>
                            </div>

                            <div className="col-md-2 my-auto">
                                <Switch
                                    checked={!!memberVerified[3]}
                                    onChange={(e) =>
                                        handleToggle(e.target.checked, 3)
                                    }
                                />
                            </div>

                            <div className="col-md-1 my-auto">
                                <Modal
                                    title="Edit Line of Business"
                                    nameField="line_of_business"
                                    data={lob}
                                    member_id={member.id}
                                    payerProfile={payerProfile}
                                />
                            </div>
                        </div>

                        <div className="col-md-10 checkbox inline row ml-0">
                            <div className="col-md-4">
                                <p className="text-checkbox title-row">
                                    Member ID
                                </p>
                            </div>

                            <div className="col-md-5">
                                <p className="text-checkbox">
                                    {member.member_number}
                                </p>
                            </div>

                            <div className="col-md-2 my-auto">
                                <Switch
                                    checked={!!memberVerified[4]}
                                    onChange={(e) =>
                                        handleToggle(e.target.checked, 4)
                                    }
                                />
                            </div>

                            <div className="col-md-1 my-auto">
                                <Modal
                                    title="Edit Member ID"
                                    nameField="member_number"
                                    data={member}
                                    member_id={member.id}
                                    payerProfile={payerProfile}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewRequestAddSteps1;
