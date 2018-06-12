<template>
    <p class="test">ahahah, {{ name }}</p>
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