<template>
    <div>
        <el-row :gutter="20" class="head-area">
            <el-col :xs="{span: 22, offset: 1}" :sm="{span: 22, offset: 1}" :md="{span: 12, offset: 6}" :lg="{span: 12, offset: 6}" :xl="{span: 12, offset: 6}">
                <div class="memory-head">
                    <div class="head-left">
                        <div class="calender-area">
                            <div class="week-day">{{ week[currentDate.getDay()]}}</div>
                            <div class="date-day">{{ currentDate.getDate() }}</div>
                        </div>
                        <h1>星云纪念日</h1>
                    </div>
                    <div class="head-right">
                        <div class="edit-area">
                            <el-button type="primary" icon="el-icon-edit" circle @click="modalToggle"></el-button>
                            <span v-if="noResult">还没有记录，创建一条吧!</span>
                        </div>
                    </div>
                    
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-loading="loading">
            <el-col :span="12" :offset="6">
                
                <div class="memory-body">
                    <div v-for="item in data" :key="item.index" class="memoryCard">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="time">
                                    <div>距离 {{item.memoryDate}}</div>
                                    {{ (caculateDate(item.memoryDate) > 0) ? '还有' : '已经' }} <span>{{ Math.abs(caculateDate(item.memoryDate)) }}</span> 天
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="detail">
                                    <div class="title">{{ item.title }}</div>
                                    <div class="content">{{ item.content }}</div>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="operation">
                                    <el-button @click="deleteItem(item)" icon="el-icon-delete" circle></el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="text-align: center" v-if="notEnd">
                        <el-button icon="el-icon-arrow-down" circle @click="query(currentPage)"></el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog
            title="新的记录"
            :visible.sync="modalVisible"
            width="30%">
            <el-form ref="form" :model="form" :label-position="'top'" >
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.editTime" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.editTitle" placeholder="请输入事件名称"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.editContent" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import NebPay from 'nebpay.js'
import nebulas from 'nebulas'

export default {
  data() {
    let currentDate = new Date()
    return {
      modalVisible: false,
      dappAddress: 'n1s2FEfEKasfvLtqxx496UkBgf2gpcS3oAt',   // mainnet
      // dappAddress: 'n1pP4zdjUnxqoyjJ2br3gdNEDdqu4nnLjor',  // testnet
      serialNumber: null,
      data: [],
      pageNum: 0,
      address: null,
      noResult: false,
      form: {
        editTitle: null,
        editContent: null,
        editTime: null
      },
      allCount: 0,
      loading: false,
      currentDate,
      week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      intervalQuery: null,
      currentPage: 1
    };
  },
  mounted() {
      window.postMessage({
      'target': 'contentscript',
      'data': {},
      'method': 'getAccount'
    }, '*')

    window.addEventListener('message', e => {
      if (e.data && e.data.data && e.data.data.account) {
        this.address = e.data.data.account
        this.query()
        this.queryCount()
      }
    })
  },
  methods: {
    modalToggle() {
      this.modalVisible = !this.modalVisible;
    },
    confirm() {
        console.log('vvv', this.form)
        if (!this.form.editTime || !this.form.editTitle) {
            this.$message.error('请检查日期，名称，都不能为空哦');
            return
        }
        if (this.form.editTitle.length > 10) {
            this.$message.error('名称最多10个字');
            return
        }
        if (this.form.editContent && this.form.editContent.length > 100) {
            this.$message.error('备注最多100个字');
            return
        }
        // const _month = this.form.editTime.getMonth() + 1
        // const _year = this.form.editTime.getFullYear()
        // const _date = this.form.editTime.getDate()
        // const _time = _year + '-' + _month + '-' + _date
        console.log(this.form.editTime)
        const vm = this
        const callArgs = JSON.stringify([this.form.editTitle, this.form.editContent, this.form.editTime])
        console.log('ss', callArgs)

        const nebpay = new NebPay()
        vm.serialNumber = nebpay.call(this.dappAddress, "0", "append", callArgs, {
            qrcode: {
                showQRCode: false
            },
            callback: NebPay.config.mainnetUrl,
            listener: function(resp) {
                console.log("the callback is " + resp)
            }
        })
        this.modalToggle()
        this.loading = true
        this.intervalQuery = setInterval(function() {
            vm.funcIntervalQuery(vm.serialNumber, 'append');
        }, 10000)
    },
    cancel() {
      this.modalToggle()
    },
    deleteItem(item) {
        console.log(item)
        console.log(this.data)
        console.log(this.data.indexOf(item))
        const vm = this
        this.$confirm('此操作将删除这条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const callArgs = JSON.stringify([item.index])
            const nebpay = new NebPay()
            vm.serialNumber = nebpay.call(this.dappAddress, "0", "del", callArgs, {
                qrcode: {
                    showQRCode: false
                },
                callback: NebPay.config.mainnetUrl,
                listener: function(resp) {
                    console.log("the delete is " + resp)
                }
            })
            console.log(vm.serialNumber, 'serial111')
            vm.intervalQuery = setInterval(function() {
                console.log(vm.serialNumber, 'serial222')
                vm.funcIntervalQuery(vm.serialNumber, 'del');
            }, 10000)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    query(page = 1) {
        console.log('query')
        var neb = new nebulas.Neb()
        var Account = nebulas.Account
        neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
        const from = this.address
        const to = this.dappAddress
        const value = "0"
        const nonce = "0"
        const gas_price = "1000000"
        const gas_limit = "2000000"
        const callFunciton = "get"
        const callArgs = ""
        const contract = {
            "function": callFunciton,
            "args": callArgs
        }
        const vm = this
        vm.loading = true
        if (page === 1) {
            neb.api.call(from, to, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
                        if (resp.result === 'null') {
                            vm.noResult = true
                        } else {
                            let _callArgs = JSON.stringify([page, 5])
                            let _contract = {
                                "function": "query",
                                "args": _callArgs
                            }
                            neb.api.call(from, to, value, nonce, gas_price, gas_limit, _contract).then(function(resp) {
                                console.log('resp', resp)
                                vm.data = JSON.parse(resp.result)
                                vm.loading = false
                                vm.currentPage += 1

                            })
                        }
                    }).catch(function (err) {
                        console.log("err" + err.message)
                    })
        } else {
            let _callArgs = JSON.stringify([page, 5])
            let _contract = {
                 "function": "query",
                "args": _callArgs
            }
            neb.api.call(from, to, value, nonce, gas_price, gas_limit, _contract).then(function(resp) {
                console.log('page', resp)
                vm.data = vm.data.concat(JSON.parse(resp.result))
                vm.loading = false
                vm.currentPage += 1
            })
        }
        
    },
    queryCount() {
        var neb = new nebulas.Neb()
        var Account = nebulas.Account
        neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
        const from = this.address
        const to = this.dappAddress
        const value = "0"
        const nonce = "0"
        const gas_price = "1000000"
        const gas_limit = "2000000"
        const callFunciton = "getAllCount"
        const callArgs = ""
        const contract = {
            "function": callFunciton,
            "args": callArgs
        }
        const vm = this
        vm.loading = true
        neb.api.call(from, to, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
            console.log('count', resp)
            vm.allCount = Number(resp.result)
            vm.noResult = Number(resp.result) === 0
            console.log(vm.data.length)
            vm.loading = false
        }).catch(function (err) {
            console.log("err" + err.message)
        })
    },

    caculateDate(date) {
        const _current = new Date()
        const _record = new Date(date)
        const _difference = _record.getTime() - _current.getTime()
        const _diffHour = Math.floor((_difference % (24 * 3600 * 1000)) / (3600 * 1000))
        const _diffDay = Math.floor(_difference/(24 * 3600 * 1000))
        if (_diffDay === 0 && _diffHour !== 0) {
            return 1
        } else {
            return  _diffDay
        }
        // return Math.floor(_difference/(24 * 3600 * 1000))
    },
    funcIntervalQuery(serialNumber, type) {
        const nebpay = new NebPay()
        const vm = this
        nebpay.queryPayInfo(serialNumber)
            .then(function(resp) {
                console.log('tx result: ' + resp)
                var respObject = JSON.parse(resp)
                if (respObject.data.status === 1) {
                    clearInterval(vm.intervalQuery)
                    vm.loading = false
                    switch(type) {
                        case 'append':
                            vm.$message({
                                type: 'success',
                                message: '添加成功!请在钱包确认状态'
                            });
                            break
                        case 'del':
                            vm.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            break
                    }
                    vm.query()
                    vm.queryCount()
                }
            })
            .catch(function(err) {
                console.log(err)
            })
    }
  },
  computed: {
      notEnd(){
          return this.allCount !== this.data.length
      }
  }
};
</script>
<style lang="sass" src="./style.sass" scoped></style>