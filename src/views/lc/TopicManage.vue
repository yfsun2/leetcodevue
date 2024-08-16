<script setup>
import {Delete, Edit} from "@element-plus/icons-vue";
import {ref} from 'vue';
import {topicListService,addTopicService,updateTopicService,deleteTopicService} from "@/api/topic.js";
import {ElMessage, ElMessageBox} from "element-plus";

const dialogVisible=ref(false)
let title = ref("")

const topicList=ref([])

const topicModel=ref({
    id:0,
    name:'',
    detail:''
})

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑题单'
    //数据拷贝
    topicModel.value.name = row.name;
    topicModel.value.detail = row.detail;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    topicModel.value.id = row.id
}

//模糊查询所有竞赛
const onSearch = async() => {
    let result = await topicListService();
    //渲染视图
    topicList.value = result.data;
    debugger
}
onSearch();

const onAddTopic=async()=>{
    let params={
        name:topicModel.value.name,
        detail:topicModel.value.detail
    }
    await addTopicService(params).then((result)=>{
        ElMessage.success(result.msg? result.msg:'添加成功');
        //隐藏弹窗
        dialogVisible.value = false;
        onSearch()
    }).catch((err)=>{
        console.log(err)
    })
}

const updateTopic=async()=>{
    let params={
        id:topicModel.value.id,
        name:topicModel.value.name,
        detail:topicModel.value.detail
    }
    await updateTopicService(params).then((result)=>{
        ElMessage.success(result.msg ? result.msg : '修改成功')
        //隐藏弹窗
        dialogVisible.value = false;
        onSearch()
    }).catch((err)=>{
        console.log(err)
    })
}

const deleteTopic=async(row)=>{
    //提示用户  确认框
    ElMessageBox.confirm('你确认要删除该题单吗?','温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        await deleteTopicService(row.id);
        ElMessage({type: 'success', message: '删除成功', })
        //刷新列表
        await onSearch();
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '用户取消了删除',
        })
    })
}

//清空数据
const clearData = () => {
    topicModel.value.name = '';
    topicModel.value.detail = '';
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>题单管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;title = '添加题单';clearData()">添加题单</el-button>
                </div>
            </div>
        </template>
        <el-scrollbar class="scrollbar-wrapper">
            <div class="element-container">
                <el-card class="box-card" v-for="item in topicList" :key="item.id"  shadow="always" type="flex">
                    <el-row>
                        <el-col :span="17">

                            <router-link :to="{path:'/topic/detail/'+item.id}">
                                <el-button type="primary" size="large">
                                    {{item.name}}
                                </el-button>
                            </router-link>

                        </el-col>
                       <el-col :span="7">
                           <el-button :icon="Edit" circle plain type="primary" @click="showDialog(item)"></el-button>
                           <el-button :icon="Delete" circle plain type="danger" @click="deleteTopic(item)"></el-button>
                       </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-scrollbar>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="topicModel"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="题单名称" prop="name">
                    <el-input v-model="topicModel.name" type="text"></el-input>
                </el-form-item>
                <el-form-item label="题单详情" prop="detail">
                    <el-input v-model="topicModel.detail" type="textarea" ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title === '添加题单' ? onAddTopic() : updateTopic()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
    .page-container {
    min-height: 100%;
    box-sizing: border-box;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .scrollbar-wrapper {
        height: 430px;  /* 设置你需要的高度 */
        width: 100%;
        overflow: hidden;  /* 防止内容超出容器 */
    }
    .element-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        max-height: 100%;
    }
    .box-card {
        width: 30%;
        box-sizing: border-box;
        padding: 10px;
        margin: 20px;
    }
}
</style>
