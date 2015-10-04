var uuid4 = require('./../UuidHelper.js').uuid4;

function Identity(name){
    this.name = name;
    this.uuid = uuid4();
}

exports.Identity = Identity;