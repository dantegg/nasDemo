<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12" :offset="6">
                <div class="memory-head">
                    <h1>纪念日</h1>
                    <div>
                        <p>记录重要的日子</p>
                        <el-button type="primary" icon="el-icon-edit" circle></el-button>
                    </div>
                </div>
                <div class="memory-body">
                    <div v-for="item in data" :key="item" class="memoryCard">
                        123
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: "vue",
                data: [1, 2, 3, 4, 5]
            }
        }
    }
</script>
<style lang="sass" src="./style.sass" scoped></style>