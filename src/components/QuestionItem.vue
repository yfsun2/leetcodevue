<script setup>
defineProps(['item'])
</script>

<template>
    <el-tooltip
        :content="item?.difficultyScore===0?item?.levelName:item?.difficultyScore"
        placement="top-start"
        effect="light">
            <el-link v-if="item?.levelName==='简单'" :href="item?.link" target="_blank" type="success" style="text-decoration: none" :underline="false">
                {{ item?.questionId }}. {{ item?.name }}
            </el-link>
            <el-link v-else-if="item?.levelName==='中等'" :href="item?.link" target="_blank" type="warning" style="text-decoration: none" :underline="false">
                {{ item?.questionId }}. {{ item?.name }}
            </el-link>
            <el-link v-else :href="item?.link" target="_blank" type="danger" style="text-decoration: none" :underline="false">
                {{ item?.questionId }}. {{ item?.name }}
            </el-link>
    </el-tooltip>
<!--    <el-tag v-if="item.stateName==='未开始'" type="info" effect="dark">-->
<!--        {{item.stateName}}-->
<!--    </el-tag>-->
<!--    <el-tag v-else-if="item.stateName==='已完成'" type="success" effect="dark">-->
<!--        {{item.stateName}}-->
<!--    </el-tag>-->
<!--    <el-tag v-else type="danger" effect="dark">-->
<!--        {{item.stateName}}-->
<!--    </el-tag>-->
<!--    <br/>-->
<!--    <el-tag v-if="item.levelName==='简单'" type="success" effect="dark">-->
<!--        {{item.difficultyScore===0?item.levelName:item.difficultyScore}}-->
<!--    </el-tag>-->
<!--    <el-tag v-else-if="item.levelName==='中等'" type="warning" effect="dark">-->
<!--        {{item.difficultyScore===0?item.levelName:item.difficultyScore}}-->
<!--    </el-tag>-->
<!--    <el-tag v-else type="danger" effect="dark">-->
<!--        {{item.difficultyScore===0?item.levelName:item.difficultyScore}}-->
<!--    </el-tag>-->
</template>

<style scoped>

</style>
