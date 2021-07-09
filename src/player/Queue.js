Object.defineProperty(exports, "__esModule", { value: true })

module.exports = class Queue extends Array {
    constructor(...args) {
      super(...args)
      this.previousTracks = []
      this.current = null
      this.next = null
    }

    get duration() {
        let a, b
        const current = (b = (a = this.current) === null || a === void 0 ? void 0 : a.info.length) !== null && b !== void 0 ? b : 0
        return this.reduce((acc, cur) => acc + (cur.info.length || 0), current)
    }

    get totalSize() {
        return this.length + (this.current ? 1 : 0)
    }

    get provius() {
        return this.previousTracks[0]
    }
}