#!/usr/bin/env node
'use strict';

const shell = require('shelljs');
const open = require('open');

const branch = shell.exec('git branch --show-current');
const [match, key, task_id] = branch.replace(/\n/, '').match(/(GRY#)(\d+|[A-Z]+-\d+)/);

if (!task_id && isNaN(parseInt(task_id))) {
    throw 'ID not found';
}
const url = `https://dmecg.aha.io/requirements/GRY-${task_id}?active_tab=tasks`;

(async () => {
    console.log(`Opening the task ${task_id} in azure boards`);

    await open(url, { wait: true });

    console.log('Opened...');
})();
