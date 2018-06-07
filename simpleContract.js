"use strict"

var MemoryDayItem = function(text) {
    if (text) {
        var obj = JSON.parse(text)
        this.memoryDate = obj.memoryDate
        this.content = obj.content
        this.title = obj.title
    }
}

MemoryDayItem.prototype = {
    toStirng: function() {
        return JSON.stringify(this)
    }
}


var MemoryDayContract = function() {}

MemoryDayContract.prototype = {
    init: function() {

    },
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function(text) {
            return new MemoryDayItem(text)
        },
        stringify: function(o) {
            return o.toStirng()
        }
    })
    // toString: function() {
    //     return JSON.stringify(this)
    // }
};

MemoryDayContract.prototype = {
    save: function(title, content, memoryDate) {
        if (!title || !content || !memoryDate) {
            throw new Error("title , content or memoryDate is empty!")
        }
        if (title.length > 20 || content.length > 500) {
            throw new Error("title or content exceed limit length")
        }
        var from = Blockchain.transaction.from
        var memoryDayItem = this.data.get(title)
        memoryDayItem = new MemoryDayItem()
        memoryDayItem.title = title
        memoryDayItem.content = content
        memoryDayItem.memoryDate = memoryDate
        this.data.put(from, memoryDayItem)
    },

    get: function() {
        var fromUser = Blockchain.transaction.from
        return this.data.get(fromUser)
    }
}

module.exports = MemoryDayContract