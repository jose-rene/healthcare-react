'use strict';

const successResponse = (callback) => {
    callback();
};

exports.handler = (event, context, callback) => {
    const {
        Records = [],
    } = event;

    Records.forEach(iteration);

    successResponse(callback);
};

const iteration = (record) => {
    /TODO :: proces the record;
};
