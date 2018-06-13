<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12" :offset="6">
                <div class="memory-head">
                    <h1>星云纪念日</h1>
                    <div class="no-result" v-if="noResult">
                        <div>还没有记录，去创建一条吧！</div>
                        <div><i class="el-icon-arrow-down"></i></div>
                    </div>
                    <div>
                        <el-button type="primary" icon="el-icon-edit" circle @click="modalToggle"></el-button>
                    </div>
                </div>
                <div class="memory-body">
                    <div v-for="item in data" :key="item" class="memoryCard">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="time">
                                    已经 <span>{{ item.memoryDate }}</span> 天
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
                        <el-button icon="el-icon-arrow-down" circle @click="query()"></el-button>
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
    return {
      modalVisible: false,
      dappAddress: 'n1h8nWQasUmtkuYDufwYT5VKmjZuWxyQHWc',   // mainnet
      // dappAddress: 'n1pP4zdjUnxqoyjJ2br3gdNEDdqu4nnLjor',  // testnet
      serialNumber: null,
      notEnd: true,
      data: [1, 2, 3, 4, 5],
      pageNum: 0,
      address: null,
      noResult: false,
      form: {
        editTitle: null,
        editContent: null,
        editTime: null
      },
      
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
        const callArgs = JSON.stringify([this.form.editTitle, this.form.editContent, this.form.editTime])
        console.log('ss', callArgs)

        const nebpay = new NebPay()
        this.serialNumber = nebpay.call(this.dappAddress, "0", "append", callArgs, {
            listener: function(resp) {
                console.log("the callback is " + resp)
            }
        })
      // this.modalToggle()

    },
    cancel() {
      this.modalToggle()
    },
    deleteItem(item) {
        console.log(item)
        this.$confirm('此操作将删除这条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    query() {
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
        neb.api.call(from, to, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
            console.log('resp', resp)
            vm.data = JSON.parse(resp.result)
            if (resp.result === 'null') {
                vm.noResult = true
            }
        }).catch(function (err) {
            console.log("err" + err.message)
        })
        this.notEnd = false
    }
  }
};
</script>
<style lang="sass" src="./style.sass" scoped></style>