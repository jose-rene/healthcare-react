require('dotenv').config();

const {
    API_HOST = '0.0.0.0',
    API_PORT = 8061,
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
            args: `serve --host=${API_HOST} --port=${API_PORT}`,
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
        {
            // script name
            name: 'web:start',
            cwd: './web',
            // import defaults
            ...defaults,
            script: 'node_modules/react-scripts/scripts/start.js',
            args: `${defaultArgs}`,

            node_args: `--inspect`,
            // while developing more than one cluster breaks things.
            exec_mode: "fork",
            instances: '1',
            // nuxt dev watches for changes already
            watch: false,

            env: {
                // Inject env vars here
            },
        }
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
