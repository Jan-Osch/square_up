var uuid = require('node-uuid');

function uuid4(){
    return uuid.v4();
}

exports.uuid4 = uuid4;
