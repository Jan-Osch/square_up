var uuid4 = require('UuidHelper').uuid4;

function Identity(name){
    this.name = name;
    this.uuid = uuid4();
}

module.exports = Identity;