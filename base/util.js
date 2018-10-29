class Util {
  constructor() {
    this.hash = {}
  }
  unique = arr => {
    return arr.reduce(function(item, next) {
      this.hash[next.name] ? '' : (this.hash[next.name] = true && item.push(next))
      return item
    }, [])
  }
}
module.exports = new Util()
