class Base {
    constructor(obj) {
        Object.assign(this, obj);
    }

    toJSON(){
        return JSON.stringify(this);
    }
}

module.exports = Base;
