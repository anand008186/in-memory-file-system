class Directory {
    constructor(name) {
      this.name = name;
      this.contents = {}; // { name: File | Directory }
    }
  
    add(item) {
      this.contents[item.name] = item;
    }
  
    remove(name) {
      delete this.contents[name];
    }
  
    get(name) {
      return this.contents[name];
    }
  
    list() {
      return Object.keys(this.contents);
    }
  }
  
  module.exports = Directory;
  