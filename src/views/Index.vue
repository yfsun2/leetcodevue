<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const mode='default' // 或 'simple'

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

</script>

<!--<template>-->
<!--    <div>-->
<!--        <div style="width: 45%;float: left;margin-left: 2%;border: 1px solid #ccc">-->
<!--            <Toolbar-->
<!--                style="border-bottom: 1px solid #ccc"-->
<!--                :editor="editorRef"-->
<!--                :defaultConfig="toolbarConfig"-->
<!--                :mode="mode"-->
<!--            />-->
<!--            <Editor-->
<!--                style="height: 500px; overflow-y: hidden;"-->
<!--                v-model="valueHtml"-->
<!--                :defaultConfig="editorConfig"-->
<!--                :mode="mode"-->
<!--                @onCreated="handleCreated"-->
<!--            />-->
<!--            <el-button type="primary"  @click="() => {div.innerHTML= valueHtml.valueOf();}">确认</el-button>-->
<!--        </div>-->
<!--        <div style="width: 45%;float: left;margin-left: 2%;border:1px solid gray;height: 600px" class="w-e-text" id="A">-->
<!--        </div>-->
<!--    </div>-->

<!--</template>-->

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>资源网址</span>
            </div>
        </template>
        <el-link href="https://cn.vuejs.org/guide/introduction.html" type="primary" target="_blank">Vue学习官网</el-link>
        <el-divider></el-divider>
        <el-link href="https://element-plus.org/zh-CN/" type="primary" target="_blank">ElementPlus学习官网</el-link>
        <el-divider></el-divider>
        <el-link href="https://leetcode.cn/problemset/" type="primary" target="_blank">力扣</el-link>
        <el-divider></el-divider>
        <el-link href="https://ac.nowcoder.com/" type="primary" target="_blank">牛客</el-link>
        <el-divider></el-divider>
        <el-link href="https://codeforces.com/" type="primary" target="_blank">CodeForces</el-link>
        <el-divider></el-divider>
        <el-link href="https://atcoder.jp/" type="primary" target="_blank">AtCoder</el-link>

    </el-card>
</template>

<style src="@wangeditor/editor/dist/css/style.css">

</style>
