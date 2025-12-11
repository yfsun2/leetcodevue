<script setup lang="js">
import {ref} from "vue";
import {uploadFile} from "@/api/file.js";

import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import 'mavon-editor/dist/markdown/github-markdown.css'
import 'mavon-editor/dist/highlightjs/styles/github.min.css'
import 'mavon-editor/dist/highlightjs/highlight.min.js'

// let props=defineProps(['markdownText'])

const markdownText = defineModel()

const mavon=ref(null)

const uploadImage=async(pos,file)=>{
    let formdata = new FormData();
    formdata.append('file', file);
    debugger
    await uploadFile(formdata).then(res=>{
        debugger
        mavon.value.$img2Url(pos, res.data.fileUrl);
    }).catch(err=>{
        debugger
        console.log(err)
    })
}

const externalLink={
    markdown_css: function() {
        return false;
    }
}


</script>

<template>
    <div>
        <div id="editor">
            <mavon-editor
                ref="mavon"
                v-model="markdownText"
                :fontSize="'15px'"
                :ishljs="true"
                :shortCut="false"
                :externalLink="externalLink"
                @imgAdd="uploadImage"
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

#editor {
    margin: auto;
    width: 100%;
    height: 420px;
}

</style>
