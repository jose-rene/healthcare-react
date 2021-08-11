require('dotenv').config();

const {
    API_HOST = '0.0.0.0',
    API_PORT = 8061,
    API_ID = 1,
    // required for api communications. You should see some notes about this in the
    // root of the project .env.example file
    API_SECRET,

    APP_HOST = "0.0.0.0",
    APP_PORT = "3000",
} = process.env;

const defaultArgs = `SKIP_PREFLIGHT_CHECK=true`;

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
            name: "api:serve",

            script: "artisan",
            args: `serve --host=${API_HOST} --port=${API_PORT}`,
            interpreter: "php",
            instances: 1,
            cwd: "./apps/backend",

            env: {
                // Pass all env variables along
                ...process.env || {},
            },
        },
        {
            name: "api:queue",
            script: "artisan",
            interpreter: "php",
            exec_mode: "fork",
            instances: 1,
            cwd: "./apps/backend",

            // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
            args: `queue:work --tries 3 `,
            env: {
                // Pass all env variables along
                ...process.env || {},
            },
        },
        {
            // script name
            name: "web:start",
            cwd: "./apps/web",
            // import defaults
            script: "./node_modules/react-scripts/scripts/start.js",
            args: `${defaultArgs}`,

            node_args: `--inspect`,
            // while developing more than one cluster breaks things.
            exec_mode: "fork",
            instances: "1",
            // nuxt dev watches for changes already
            watch: false,

            env: {
                // Inject env vars here. Just make sure to prefix them with REACT_APP
                REACT_APP_API_HOST: API_HOST,
                REACT_APP_API_PORT: API_PORT,
                REACT_APP_API_ID: API_ID,
                REACT_APP_API_SECRET: API_SECRET,
                HOST: APP_HOST,
                PORT: APP_PORT,
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
