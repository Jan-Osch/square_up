function Settlement(name){
    this.name = name;
    this.identities = [];
    this.items = [];
    this.created = Date.now();
}

Settlement.prototype.setData = function(data){
    for(var prop in this){
        if (data[prop]!== undefined){
            this[prop] = data[prop];
        }
    }
};

Settlement.prototype.addItem = function(item){
    this.items.push(item);
};

Settlement.prototype.removeItemAtIndex = function(index){
    this.items.splice(index, 1);
};

Settlement.prototype.addIdentity = function(identity){
    this.identities.push(identity);
};


Settlement.prototype.removeIdentityAtIndex = function(index){
    this.identities.splice(index, 1);
};


