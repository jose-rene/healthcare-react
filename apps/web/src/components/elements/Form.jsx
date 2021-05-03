import React from 'react';

const Form = ({ children, method = 'post', onSubmit, ...props }) => {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };
    return (
        <form onSubmit={handleFormSubmit} method={method} {...props}>
            {children}
        </form>
    );
};

export default Form;
