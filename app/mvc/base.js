class Base {
    constructor(obj, options) {
        Object.assign(this, obj);
    }

    toJSON(){
        return JSON.stringify(this);
    }
}

module.exports = Base;