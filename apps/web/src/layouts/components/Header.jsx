import FapIcon from "components/elements/FapIcon";
import React from "react";
import {
    Container,
    Navbar,
    Button,
    InputGroup,
    FormControl,
} from "react-bootstrap";
import MenuUser from "./menu/MenuUser";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageHeader = ({
    full_name,
    avatar_url,
    handleShowMenu,
    logOut,
    primaryRole,
    roles,
    handleRoleSwitch,
}) => {
    return (
        <Navbar bg="white" expand fixed="top" className="py-0">
            <Container fluid className="px-3">
                <Button
                    variant="link"
                    onClick={handleShowMenu}
                    className="p-0 border-0 d-sm-none"
                >
                    <FapIcon icon="bars" />
                </Button>
                <Navbar.Brand href="/dashboard" className="mx-auto m-sm-0">
                    <img
                        src="/icon/apple-icon-60x60.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Periscope"
                    />
                    <span className="ms-1">Periscope</span>
                </Navbar.Brand>
                <div className="d-none d-sm-inline ps-sm-5">
                    <InputGroup className="w-auto">
                        <InputGroup.Text
                            id="search-addon"
                            className="bg-white border-end-0"
                        >
                            <FapIcon icon="search" />
                        </InputGroup.Text>
                        <FormControl
                            className="border-start-0"
                            placeholder="What are you looking for?"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                    </InputGroup>
                </div>
                <MenuUser
                    {...{
                        full_name,
                        avatar_url,
                        logOut,
                        primaryRole,
                        roles,
                        handleRoleSwitch,
                    }}
                />
            </Container>
        </Navbar>
    );
};

export default PageHeader;
