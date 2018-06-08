"use strict"

var MemoryDayItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.memoryDate = obj.memoryDate;
        this.content = obj.content;
        this.title = obj.title;
    }
};

MemoryDayItem.prototype = {
    toStirng: function() {
        return JSON.stringify(this);
    }
};


var MemoryDayContract = function() {
    // LocalContractStorage.defineMapProperty(this, "data", {
    //     parse: function(text) {
    //         return new MemoryDayItem(text)
    //     },
    //     stringify: function(o) {
    //         return o.toStirng()
    //     }
    // })
    LocalContractStorage.defineMapProperty(this, "data")
}

MemoryDayContract.prototype = {
    init: function() {
    },
    // save: function(title, content, memoryDate) {
    //     if (!title || !content || !memoryDate) {
    //         throw new Error("title , content or memoryDate is empty!")
    //     }
    //     if (title.length > 20 || content.length > 500) {
    //         throw new Error("title or content exceed limit length")
    //     }
    //     var from = Blockchain.transaction.from
    //     var memoryDayItem = this.data.get(title)
    //     memoryDayItem = new MemoryDayItem()
    //     memoryDayItem.title = title
    //     memoryDayItem.content = content
    //     memoryDayItem.memoryDate = memoryDate
    //     this.data.put(from, memoryDayItem)
    // },

    get: function() {
        var fromUser = Blockchain.transaction.from
        return this.data.get(fromUser)
    },
    append: function(title, content, memoryDate) {
        var index = this.size
        var memoryDayItem = new MemoryDayItem()
        memoryDayItem.title = title
        memoryDayItem.content = content
        memoryDayItem.memoryDate = memoryDate
        var from = Blockchain.transaction.from
        var _existData = this.get() || []
        this.data.set(from, _existData.push(memoryDayItem))
    },
    // query: function(limit="-1", offset="0") {
    //     limit = parseInt(limit)
    //     offset = parseInt(offset)
    //     if (limit <= 0) {
    //         limit = 100
    //     }
    //     if (offset < 0) {
    //         offset = 0
    //     } else if (offset > this.size) {
    //         offset = this.size -1
    //         limit = 1
    //     }
    //     var number = offset+limit
    //     if (number > this.size) {
    //         number = this.size
    //     }
    //     var result = ''
    //     for (var i = offset;i<number;i++) {
    //         var data = this.arrayMap.get(i)
    //         result += data+','
    //     }
    //     result = result.substring(0, result.length - 1)
    //     return result
    // }
}

module.exports = MemoryDayContract