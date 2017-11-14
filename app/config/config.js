const os = require('os'),
    env = os.hostname() === 'w5aj' ? 'idealo' : 'home',
    config = require('./' + env);

module.exports = config;
