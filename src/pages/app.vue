<template>
    <div>
        <p class="test">ahahah, {{ name }}</p>
        <el-button type="primary" icon="el-icon-edit"></el-button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: "vue"
            }
        }
    }
</script>
<style>
    .test{
        color: #1989fa
    }
</style>