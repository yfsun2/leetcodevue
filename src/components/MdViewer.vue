<script setup lang="js">

import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import 'mavon-editor/dist/markdown/github-markdown.css'
import 'mavon-editor/dist/highlightjs/styles/github.min.css'
import 'mavon-editor/dist/highlightjs/highlight.min.js'

let props=defineProps(['markdownText'])

const externalLink={
    markdown_css: function() {
        // 这是你的markdown css文件路径
        return false;
    }
}

</script>

<template>
    <div>
        <div id="preview">
            <mavon-editor
                v-model="props.markdownText"
                :ishljs="true"
                :subfield="false"
                :shortCut="false"
                :defaultOpen="'preview'"
                :editable="false"
                :toolbarsFlag="false"
                :externalLink="externalLink"
                style="height: 100%"/>
        </div>
    </div>

</template>

<style lang="scss">

.markdown-body code {
    margin: 0;
    font-size: 100%;
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
}

.markdown-body .highlight pre,
.markdown-body pre {
    padding: 16px;
    overflow: auto;
    font-size: 100%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
}

#preview {
    margin: auto;
    width: 100%;
    height: 420px;
}

</style>
