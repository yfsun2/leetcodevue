<script lang="js" setup>
import {typeListService} from "@/api/type.js";

const props=defineProps(['topicId'])

import {getTypeListByTopicService,getQuestionPageByTopicAndTypeService,addTopicQuestionService,updateTopicQuestionService,deleteTopicQuestionService} from "@/api/topic_question.js";
import {updateQuestionState} from "@/api/question.js";
import { ref } from 'vue'
import {questionListService} from "@/api/question.js";
import {ElMessage,ElMessageBox} from "element-plus";
import {CircleCheckFilled, Clock, Delete, Edit} from "@element-plus/icons-vue";

//类型列表
const typeList=ref([])

const title = ref("")
const visibleDrawer=ref(false)

const isDisable=ref(false)

const activeId=ref('')

const topicQuestionModel=ref({
    id:0,
    question:{id:0,value:0,stateId:0},
    questionName:'',
    topicType:{value:0,},
    topicTypeName:'',
})

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(0)//总条数
const pageSize = ref(10)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    handleChange(activeId.value);
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    getType();
    handleChange(activeId.value);
}


const getType=async ()=>{
    await getTypeListByTopicService(props.topicId).then((result)=>{
        typeList.value=result.data
    })
}
getType()

const clearData=()=>{
    // topicQuestionModel.value.topicType={};
    // topicQuestionModel.value.topicTypeName='';
    topicQuestionModel.value.question={};
    topicQuestionModel.value.questionName='';
}

//加载
const loading=ref(false)

//问题列表
const allQuestionList=ref([])

//要展示的table里的
const questionList=ref([])
//类型
const allTypeList=ref([])

const queryAllType=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query
        }
        await typeListService(params).then((result)=>{
            setTimeout(() => {
                loading.value = false
                allTypeList.value = result.data.map((item) => {
                    return { value:item.id, label:item.name}
                })
            }, 200)
        })
    }else{
        allTypeList.value=[]
    }
}

const queryAllQuestion=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query
        }
        await questionListService(params).then((result)=>{
            setTimeout(() => {
                loading.value = false
                allQuestionList.value = result.data.map((item) => {
                    return { value:item.questionId, label:item.name,id:item.id,stateId:item.stateId}
                })
            }, 200)
        })
    }else{
        allQuestionList.value=[]
    }
}

const addShip=async ()=>{
    let params={
        topicId:parseInt(props.topicId),
        questionId:topicQuestionModel.value.question.id,
        typeId:topicQuestionModel.value.topicType.value
    }
    await addTopicQuestionService(params).then((result)=>{
        ElMessage.success(result.msg? result.msg:'添加成功');
        visibleDrawer.value=false;
        getType();
    })
}

const updateShip=async ()=>{
    debugger
    let params={
        id:topicQuestionModel.value.id,
        topicId:parseInt(props.topicId),
        questionId:topicQuestionModel.value.question.value,
        typeId:topicQuestionModel.value.topicType.value
    }
    await updateTopicQuestionService(params).then(result=>{
        let config={
            id:topicQuestionModel.value.question.value,
            stateId:topicQuestionModel.value.question.stateId,
        }
        updateQuestionState(config).then(res=>{
            ElMessage.success(res.msg? res.msg:'修改成功');
            visibleDrawer.value=false;
            getType();
            handleChange(activeId.value);
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
}

const deleteShip=async (row)=>{
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该问题吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        await deleteTopicQuestionService(row.topicQuestionId).then((result)=>{
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }).catch((err)=>{
            console.log(err)
        })
        //刷新列表
        await getType();
        await handleChange(activeId.value);
    }).catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}

//展示编辑弹窗
const showDialog = (row) => {
    visibleDrawer.value = true;
    title.value = '编辑题目';
    topicQuestionModel.value.topicType.value=row.topicType.id
    topicQuestionModel.value.topicType.label=row.topicType.name
    topicQuestionModel.value.question.value=row.id
    topicQuestionModel.value.question.label=row.name
    topicQuestionModel.value.question.stateId=row.stateId
    //扩展id属性,将来需要传递给后台,完成分类的修改
    topicQuestionModel.value.id = row.topicQuestionId
}
//展开处理
const handleChange = async (val) => {
    if(!val) return
    if(val!==activeId.value){
        pageNum.value=1;
        total.value=0;
        pageSize.value=5;
    }

    let params = {
        current: pageNum.value,
        size: pageSize.value,
        topicId:parseInt(props.topicId),
        typeId:parseInt(val)
    }

    await getQuestionPageByTopicAndTypeService(params).then((result)=>{
        total.value = result.data.total;
        questionList.value = result.data.records;
    }).catch((err)=>{
        console.log(err)
    })
}

const filterState = (value, row, column) => {
    const property = column.property
    return row[property] === value
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>题目管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加题目';clearData();isDisable=false;">添加题目</el-button>
                </div>
            </div>
        </template>
        <div v-if="typeList.length>0" class="demo-collapse">
            <el-collapse v-model="activeId" @change="handleChange" accordion>
                <el-collapse-item v-for="(item,index) in typeList" :key=index :title="item.name" :name="item.id">
                    <template #title>
                        <el-text type="primary" size="large">{{item.name}}</el-text>
                    </template>
                    <!-- 问题列表 -->
                    <el-table :data="questionList" max-height="342" style="width: 100%">
                        <el-table-column label="状态" prop="stateName" width="100" align="center"
                                         :filters="[
                { text: '已完成', value: '已完成'},
                { text: '未开始', value: '未开始' },
                { text: '尝试中', value: '尝试中' },
              ]"
                                         :filter-method="filterState"
                        >
                            <template #default="scope">
                                <el-icon v-if="scope.row.stateName==='已完成'" size="20" color="#15BD66"><CircleCheckFilled /></el-icon>
                                <el-icon v-else-if="scope.row.stateName==='尝试中'" size="20" color="#FFB800"><Clock /></el-icon>
                                <el-icon v-else size="20" ></el-icon>
                            </template>
                        </el-table-column>
                        <el-table-column label="题目" sortable prop="id">
                            <template #default="scope">
                                <el-tooltip
                                    content="点击进入新页面"
                                    placement="top-start"
                                    effect="light">
                                    <el-link :href="scope.row.link" target="_blank" type="primary" style="text-decoration: none" :underline="false">
                                        {{scope.row.questionId}}.{{ scope.row.name }}
                                    </el-link>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column label="类型名称" prop="typeNameList">
                            <template #default="scope">
                                <el-tag v-for="item in scope.row.typeList">
                                    {{item.name}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="难易程度" prop="levelName"
                                         :filters="[
                { text: '简单', value: '简单'},
                { text: '中等', value: '中等' },
                { text: '困难', value: '困难' },
              ]" :filter-method="filterState"
                        >
                            <template #default="scope">
                                <el-tag v-if="scope.row.levelName==='简单'" type="success" effect="dark">
                                    {{scope.row.difficultyScore===0?scope.row.levelName:scope.row.difficultyScore}}
                                </el-tag>
                                <el-tag v-else-if="scope.row.levelName==='中等'" type="warning" effect="dark">
                                    {{scope.row.difficultyScore===0?scope.row.levelName:scope.row.difficultyScore}}
                                </el-tag>
                                <el-tag v-else type="danger" effect="dark">
                                    {{scope.row.difficultyScore===0?scope.row.levelName:scope.row.difficultyScore}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="上次修改时间" prop="updateTime"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template #default="{ row }">
                                <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true;"></el-button>
                                <el-button :icon="Delete" circle plain type="danger" @click="deleteShip(row)"></el-button>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="没有数据" />
                        </template>
                    </el-table>
                    <!-- 分页条 -->
                    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10,20]"
                                   layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-else>
            <el-empty description="没有数据" />
        </div>


        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加问题表单 -->
            <el-form :model="topicQuestionModel" label-width="100px">
                <el-form-item label="问题" >
                    <el-select
                        :disabled="isDisable"
                        v-model="topicQuestionModel.question"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入题目名"
                        remote-show-suffix
                        :remote-method="queryAllQuestion"
                        :loading="loading"
                        style="width: 240px">
                        <el-option
                            v-for="item in allQuestionList"
                            :key="item.value"
                            :label="item.value+'.'+item.label"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        v-model="topicQuestionModel.topicType"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入类型名"
                        remote-show-suffix
                        :remote-method="queryAllType"
                        :loading="loading"
                        style="width: 240px">
                        <el-option
                            v-for="item in allTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="题目状态">
                    <el-radio-group v-model="topicQuestionModel.question.stateId">
                        <el-radio  :label="0" >未开始</el-radio>
                        <el-radio  :label="1" >尝试中</el-radio>
                        <el-radio  :label="2">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加题目' ? addShip() : updateShip()">确认</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
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
}

/* 抽屉样式 */
.avatar-uploader {
    :deep(.el-drawer) {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>

