import React from "react";
import { Container } from "react-bootstrap";
import PageAlert from "components/elements/PageAlert";
import PageLayout from "../../layouts/PageLayout";
import { _GET } from "../../helpers/request";

const Error401 = (params) => {
    const { history } = params;

    const tryAgain = () => {
        const redirect = _GET("redirect");

        history.push(redirect);
    };

    return (
        <PageLayout>
            <Container className="container mt-5">
                <div className="row">
                    <div className="col-md-10 col-md-offset-2" onClick={tryAgain}>
                        <PageAlert variant="danger">
                            Access denied. You do not have permission to the
                            requested page.
                        </PageAlert>
                    </div>
                </div>
            </Container>
        </PageLayout>
    );
};

export default Error401;
