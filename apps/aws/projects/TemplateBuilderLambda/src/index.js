"use strict";

const { handlebarsTemplate } = require("./helpers/string");

const successResponse = (callback, data = {}) => {
    const response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
        },
        "body": JSON.stringify({ "message": "OK", data }),
        "isBase64Encoded": false,
    };
    callback && callback(null, response);
};

exports.handler = (event, context, callback) => {
    const {
        data,
        template,
    } = event;

    if (!data || !template) {
        throw "missing-data-or-template";
    }

    const responseData = {
        template: handlebarsTemplate(template, data),
    };

    successResponse(callback, responseData);
};
