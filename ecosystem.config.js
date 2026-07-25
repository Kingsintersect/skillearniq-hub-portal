module.exports = {
    apps: [{
        name: process.env.APP_NAME || 'skillearniqhub.qverselearning.org',
        script: 'node_modules/.bin/next',
        args: 'start',
        instances: '3', // uses 2 instances of the app
        // instances: 'max', //uses all available CPUs
        exec_mode: 'cluster',
        max_memory_restart: '400M', // auto-recycle a leaking worker
        min_uptime: '10s', // don't count fast crash-loops as "started"
        max_restarts: 10, // stop retrying after 10 failures, don't loop forever
        env: {
            PORT: process.env.APP_PORT || 3500,
            NODE_ENV: 'production',
        },
    }],
};