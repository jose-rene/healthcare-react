require('dotenv').config();

const {
    HOST = '0.0.0.0',
    PORT = 8061,
} = process.env;

const defaultArgs = ``;

const defaults = {
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: defaultArgs,

    wait_ready: true,
    exec_mode: "cluster",
    instances: 'max',
    autorestart: true,
    max_memory_restart: '1G',
    kill_timeout: 2000,
    listen_timeout: 1000,
    // start script
    script: './node_modules/.bin/nuxt',
    env: {
        NODE_ENV: 'development'
    },
    watch: true,
    ignore_watch: [
        '.git',
        '.idea',
        'node_modules',
    ],
};

module.exports = {
    apps: [
        {
            name: 'api:serve',
            ...defaults,

            script: 'artisan',
            args: `serve --host=${HOST} --port=${PORT}`,
            interpreter: 'php',
            exec_mode: 'fork',
            cwd: './API',
            instances: 1,

            env: {},
        },
        {
            name: 'api:queue',
            ...defaults,

            script: 'artisan',
            interpreter: 'php',
            exec_mode: 'fork',
            cwd: './API',

            // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
            args: `queue:work --tries 3 `,
            instances: 1,
            env: {
            },
        },
    ],

    // deploy: {
    //     production: {
    //         user: 'node',
    //         host: '212.83.163.1',
    //         ref: 'origin/master',
    //         repo: 'git@github.com:repo.git',
    //         path: '/var/www/production',
    //         'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    //     }
    // }
};
