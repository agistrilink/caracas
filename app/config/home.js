const common = require('./common'),
    deepAssign = require('deep-assign');

module.exports = deepAssign(common, {
    basePath: 'X:/VHE/vsc',
    storage: {
        dir: 'X:/VHE/tmp/node-persist/caracas'
    }
});
