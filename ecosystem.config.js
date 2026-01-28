export const apps = [{
    name: 'control-clima',
    exec_mode: 'cluster',
    instances: 'max', // Or a number of instances
    script: './dist/main.js',
    node_args: '--max-http-header-size=80000'
    // args: 'start'
},];