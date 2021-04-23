const event = require('./events/defaultEvent.json');
const { handler } = require('../src/index');

const callback = (a, b, c) => {
    console.log('test lambda', { a, b, c });
};

handler(event, {}, callback);
