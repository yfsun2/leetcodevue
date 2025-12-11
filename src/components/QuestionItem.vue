<script setup>
defineProps(['item','platformId','platformName','index'])

const levelName=["简单","中等","困难"]
</script>

<!--{{ item?.questionId }}.-->

<template>
    <router-link :to="{name:'question',path:'/question/'+platformId+'/'+platformName,query:{query: item?.questionId}}" target="_blank" style="text-decoration: none;font-weight: bold" >
        <el-text v-if="item?.level===0" type="success">
            {{ item?.questionId }}.{{ item?.name }}
        </el-text>
        <el-text v-else-if="item?.level===1" type="warning">
            {{ item?.questionId }}.{{ item?.name }}
        </el-text>
        <el-text v-else type="danger">
            {{ item?.questionId }}.{{ item?.name }}
        </el-text>
    </router-link>
</template>

<style scoped>

</style>
