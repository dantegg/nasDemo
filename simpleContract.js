"use strict"

// var MemoryDayItem = function(text) {
//     if (text) {
//         var obj = JSON.parse(text);
//         this.memoryDate = obj.memoryDate;
//         this.content = obj.content;
//         this.title = obj.title;
//     }
// };

// MemoryDayItem.prototype = {
//     toStirng: function() {
//         return JSON.stringify(this);
//     }
// };


var MemoryDayContract = function() {
    // LocalContractStorage.defineMapProperty(this, "data", {
    //     parse: function(text) {
    //         return new MemoryDayItem(text)
    //     },
    //     stringify: function(o) {
    //         return o.toStirng()
    //     }
    // })
    LocalContractStorage.defineMapProperty(this, "data", null)
}

MemoryDayContract.prototype = {
    init: function() {
    },
    get: function() {
        var fromUser = Blockchain.transaction.from
        return this.data.get(fromUser)
    },
    append: function(title, content, memoryDate) {
        var fromUser = Blockchain.transaction.from
        var _data = this.data.get(fromUser)
        var deleteStatus = false
        if (_data === null) {
            _data = [{
                title,
                content,
                memoryDate,
                index: 0,
                deleteStatus
            }]
        } else {
            var index = _data.length
            _data.push({
                title,
                content,
                memoryDate,
                index,
                deleteStatus
            })
        }
        this.data.set(fromUser, _data)
    },
    query: function(currentPage, pageSize) {
        var fromUser = Blockchain.transaction.from
        var _begin = (Number(currentPage) - 1) * Number(pageSize)
        var _end = Number(currentPage) * Number(pageSize)
        var _existData = this.data.get(fromUser).slice(_begin, _end).filter(x => {
            return x.deleteStatus === false
        })
        return _existData
    },
    del: function(index) {
        var fromUser = Blockchain.transaction.from
        var _data = this.data.get(fromUser)
        _data[index].deleteStatus = true
        this.data.set(fromUser, _data)
    },
    getAllCount: function() {
        var fromUser = Blockchain.transaction.from
        return this.data.get(fromUser).length
    }
}

module.exports = MemoryDayContract