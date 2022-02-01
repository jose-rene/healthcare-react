const Handlebars = require("handlebars");

Handlebars.registerHelper("compare", function (v1, operator, v2, options) {
    const operators = {
        // eslint-disable-next-line
        "==": v1 == v2,
        "===": v1 === v2,
        // eslint-disable-next-line
        "!=": v1 != v2,
        "!==": v1 !== v2,
        ">": v1 > v2,
        ">=": v1 >= v2,
        "<": v1 < v2,
        "<=": v1 <= v2,
        "||": !!(v1 || v2),
        "&&": !!(v1 && v2),
    };
    if (operators.hasOwnProperty(operator)) {
        if (operators[operator]) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
    return console.error('Error: Expression "' + operator + '" not found');
});

Handlebars.registerHelper("isequal", function (value, comparison) {
    return value === comparison;
});

Handlebars.registerHelper("contains", function (value, comparison) {
    try {
        return (value || "").includes(comparison);
    } catch (e) {
        return false;
    }
});

exports.handlebarsTemplate = (templateString, object) => {
    try {
        const templateObj = Handlebars.compile(templateString);
        return templateObj(object);
    } catch (e) {
        return e.toString();
    }
};
