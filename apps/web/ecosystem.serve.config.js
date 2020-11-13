require('dotenv').config();

const {
  // Which port this application should serve on
  WEB_HOST = '0.0.0.0',
  WEB_PORT = 8061,

  // required for api communications.
  API_HOST = "api.gryphon.com",
  API_PORT = 80,

  API_ID = 1,
  API_SECRET,

  // Max amount of ram the node process can use
  max_old_space_size = 1536,// IN mb
} = process.env;

module.exports = {
  apps: [
    {
      // script name
      name: 'web:start',

      args: 'run start',
      script: 'npm',

      wait_ready: false,
      exec_mode: "fork",
      instances: "1",
      autorestart: true,
      max_memory_restart: '1G',
      kill_timeout: 2000,
      listen_timeout: 1000,
      restart_delay: 5000,
      watch: true,

      node_args: `--max_old_space_size=${max_old_space_size}`,
      ignore_watch: [
        '.git',
        '.idea',
        'node_modules',
      ],

      env: {
        BROWSER: false,
        // Inject env vars here. Just make sure to prefix them with REACT_APP
        PORT: WEB_PORT,
        HOST: WEB_HOST,

        REACT_APP_API_HOST: API_HOST,
        REACT_APP_API_PORT: API_PORT,
        REACT_APP_API_ID: API_ID,
        REACT_APP_API_SECRET: API_SECRET,
      },
    }
  ],
};
