<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12" :offset="6">
                <div class="memory-head">
                    <h1>纪念日</h1>
                    <div>
                        <el-button type="primary" icon="el-icon-edit" circle @click="modalToggle"></el-button>
                    </div>
                </div>
                <div class="memory-body">
                    <div v-for="item in data" :key="item" class="memoryCard">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="time">
                                    已经 <span>{{ item }}</span> 天
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                                <div class="detail">
                                    <div class="title">xxx</div>
                                    <div class="content">content</div>
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
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data() {
    return {
      modalVisible: false,
      notEnd: true,
      data: [1, 2, 3, 4, 5],
      pageNum: 0
    };
  },
  mounted() {
      this.query()
  },
  methods: {
    modalToggle() {
      this.modalVisible = !this.modalVisible;
    },
    confirm() {
      this.modalToggle()
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
        this.notEnd = false
    }
  }
};
</script>
<style lang="sass" src="./style.sass" scoped></style>