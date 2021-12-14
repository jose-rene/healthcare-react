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
    return console.error("Error: Expression \"" + operator + "\" not found");
});

exports.handlebarsTemplate = (templateString, object) => {
    try {
        const templateObj = Handlebars.compile(templateString);
        return templateObj(object);
    } catch (e) {
        return e.toString();
    }
};
