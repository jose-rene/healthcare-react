import React, { useState } from "react";
import Icon from "../../../components/elements/Icon";
import Modal from "../../../components/elements/Modal";

const TopNavNotifications = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <span className="c-pointer pe-3" onClick={() => setIsOpen(!isOpen)}>
                <Icon iconType="d" icon="bell-on" size="1x" />
            </span>

            <Modal show={isOpen} onHide={() => setIsOpen(false)} title="Notifications">
                These are your notifications
            </Modal>
        </>
    );
};

export default TopNavNotifications;
