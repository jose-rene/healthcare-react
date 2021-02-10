import React from "react";
import PageLayout from "../../layouts/PageLayout";

const Error401 = () => {
    return (
        <PageLayout>
            <header className="App-header">
                <h3 className="text-center text-dark">
                    Access denied. It does not seem like you have access to view
                    the requested page.
                </h3>
            </header>
        </PageLayout>
    );
};

export default Error401;
