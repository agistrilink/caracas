const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    basePath: '/home/harrold.korte',
    storage: {
        dir: '/tmp/node-persist/caracas'
    }
});
