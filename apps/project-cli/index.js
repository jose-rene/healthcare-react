#!/usr/bin/env node
'use strict';

const slugify = require('slugify');
const argv = require('argv');
var shell = require('shelljs');

argv.option({
    name: 'type',
    short: 't',
    type: 'string',
    description: 'feature|release|hotfix|bugfix',
});

argv.option({
    name: 'description',
    short: 'd',
    type: 'string',
    description: 'Description of the task',
});

argv.option({
    name: 'bugfix',
    short: 'b',
    type: 'string',
    description: 'Mark the type as bugfix',
});

argv.option({
    name: 'number',
    short: 'n',
    type: 'string',
    description: 'task number from devops board',
});

argv.option({
    name: 'generate',
    short: 'g',
    type: 'string',
    description: 'Generate or checkout to the branch',
});

// allow for number and description to come in as arguments instead of options
const stuff = argv.run();

// Default to options override with arguments if they are present
const {
    options: {
        type = stuff.options.bugfix ? 'bugfix' : 'feature',
        number = stuff.targets[0] || '',
        description = stuff.targets[1] || '',
        generate = false,
    },
} = stuff;

if (!description || !number) {
    throw 'Missing required details like description and task id';
}

const shortDescription = slugify(description.replace(/\//, '-')).substring(0, 16).replace(/-$/, '').toLowerCase();

const branchName = `${type}/GRY#${number}/${shortDescription}`;

// Output the command
console.log(`\r\ngit checkout -b ${branchName}\r\n`);

// Checkout to the new branch if its requested
if (generate) {
    console.log(`Generating/ checkout out to the new branch ${branchName}.`);

    shell.exec(`git checkout ${branchName}  2> /dev/null || git checkout -b ${branchName} 2> /dev/null`);
}
