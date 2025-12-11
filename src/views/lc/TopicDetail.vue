<script lang="js" setup>

//url传进来题单Id，题单名称
const props=defineProps(['topicId','topicName'])
//标签管理api
import {labelListService} from "@/api/label.js";
//题单问题管理api
import {getLabelsListByTopicService,getQuestionPageByTopicAndTypeService,addTopicQuestionService,addListTopicQuestionService,updateTopicQuestionService,deleteTopicQuestionService} from "@/api/topic_question.js";
//问题管理api
import {questionListService,updateQuestionState} from "@/api/question.js";
//题单管理api
import {topicListService} from "@/api/topic.js";

import {onMounted, ref} from 'vue'
import {ElMessage,ElMessageBox} from "element-plus";
import {ArrowRight, CircleCheckFilled, Clock, Delete, Edit} from "@element-plus/icons-vue";
import useUserInfoStore from '@/stores/userInfo.js'

const levelName=["简单","中等","困难"]

//获取用户信息存储
const userInfoStore = useUserInfoStore();
//获取用户信息
const userInfo = ref({...userInfoStore.info})
//题单标签列表
const topicLabelList=ref([])
//抽屉标题
const title = ref("")
//抽屉是否可见
const visibleDrawer=ref(false)
//按钮是否被禁用
const isDisable=ref(false)
//题目是否多选
const isMultiple=ref(false)
//被激活的题单类型Id
const activeId=ref('')
//题单问题数据模型
const topicQuestionModel=ref({
    id:0,
    topicName:props.topicName,
    question:{id:0,value:0,state:0},
    questionName:'',
    questionIdList:[],
    questionNameList:[],
    topicType:{value:"",label:""},
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
    getLabels();
    handleChange(activeId.value);
}

//获取当前题单所有类型
const getLabels=async ()=>{
    await getLabelsListByTopicService(props.topicId).then((result)=>{
        topicLabelList.value=result.data
        debugger
    }).catch(err=>{
        console.log(err)
    })
}

onMounted(()=>{
    getLabels();
})

//清理数据
const clearData=()=>{
    // topicQuestionModel.value.topicType={};
    // topicQuestionModel.value.topicTypeName='';
    topicQuestionModel.value.question={};
    topicQuestionModel.value.questionIdList=[];
    topicQuestionModel.value.questionName='';
}

//加载
const loading=ref(false)

//要展示的table里的问题列表
const questionList=ref([])

//查询出的问题列表
const allQuestionList=ref([])

//查询出的题单列表
const allTopicList=ref([])

//标签列表
const allLabelList=ref([])

//根据名称模糊查询所有题单
const queryAllTopic=async(query)=>{
    if(query){
        loading.value=true
        let params={
            search:query
        }
        await topicListService(params).then(result=>{
            loading.value = false
            allTopicList.value = result.data.map((item) => {
                return { value:item.id, label:item.name}
            })
        })
    }else{
        allTopicList.value=[]
    }
}
//根据名称模糊查询所有题单标签
const queryAllLabel=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query,
            type:"题单"
        }
        await labelListService(params).then((result)=>{
            loading.value = false
            allLabelList.value = result.data.map((item) => {
                return { value:item.id, label:item.name}
            })
        })
    }else{
        allLabelList.value=[]
    }
}
//根据名称模糊查询所有问题
const queryAllQuestion=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query
        }
        await questionListService(params).then((result)=>{
            loading.value = false
            allQuestionList.value = result.data.map((item) => {
                return { value:item.questionId, label:item.name,id:item.id,state:item.state}
            })
        })
    }else{
        allQuestionList.value=[]
    }
}
//将问题添加到题单
const addShip=async ()=>{
    //批量插入
    if(isMultiple.value){
        let params=[]
        for(let i=0;i<topicQuestionModel.value.questionIdList.length;i++){
            params.push({topicId:props.topicId,questionId:topicQuestionModel.value.questionIdList[i].id,labelId:topicQuestionModel.value.topicType.value})
        }
        await addListTopicQuestionService(params).then(result=>{
            ElMessage.success(result.msg? result.msg:'添加成功');
            visibleDrawer.value=false;
            getLabels();
        }).catch(err=>{
            console.log(err)
            ElMessage.error('添加失败')
        })
    }else{//单个插入
        let params={
            topicId:props.topicId,
            questionId:topicQuestionModel.value.question.id,
            labelId:topicQuestionModel.value.topicType.value
        }
        await addTopicQuestionService(params).then((result)=>{
            ElMessage.success(result.msg? result.msg:'添加成功');
            visibleDrawer.value=false;
            getLabels();
        }).catch(err=>{
            console.log(err)
            ElMessage.error('添加失败')
        })
    }
}
//更新问题题单关系
const updateShip=async ()=>{
    let params={
        id:topicQuestionModel.value.id,
        topicId:props.topicId,
        questionId:topicQuestionModel.value.question.value,
        labelId:topicQuestionModel.value.topicType.value
    }
    debugger
    await updateTopicQuestionService(params).then(()=>{
        let config={
            id:topicQuestionModel.value.question.value,
            state:topicQuestionModel.value.question.state,
        }
        updateQuestionState(config).then(res=>{
            ElMessage.success(res.msg? res.msg:'修改成功');
            visibleDrawer.value=false;
            getLabels();
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
        debugger
        await deleteTopicQuestionService(row.topicQuestionId).then(()=>{
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }).catch((err)=>{
            console.log(err)
        })
        //刷新列表
        await getLabels();
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
    debugger
    topicQuestionModel.value.topicType.value=row.topicType.id
    topicQuestionModel.value.topicType.label=row.topicType.name
    topicQuestionModel.value.question.id=row.questionId
    topicQuestionModel.value.question.value=row.id
    topicQuestionModel.value.question.label=row.questionId+"."+row.name
    topicQuestionModel.value.question.state=row.state
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
        topicId:props.topicId,
        typeId:val
    }

    await getQuestionPageByTopicAndTypeService(params).then((result)=>{
        console.log(result)
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
                <el-breadcrumb :separator-icon="ArrowRight" style="font-size: 16px">
                    <el-breadcrumb-item :to="{path:'/topic'}">题单管理</el-breadcrumb-item>
                    <el-breadcrumb-item >{{props.topicName}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加题目';clearData();isDisable=false;isMultiple=false;" >添加题目</el-button>
                    <el-button type="primary" @click="visibleDrawer = true;title = '批量添加题目';clearData();isDisable=false;isMultiple=true;" >批量添加题目</el-button>
                </div>
            </div>
        </template>
        <div v-if="topicLabelList.length>0" class="demo-collapse">
            <el-collapse v-model="activeId" @change="handleChange" accordion>
                <el-collapse-item v-for="(item,index) in topicLabelList" :key=index :title="item.name" :name="item.id">
                    <template #title>
                        <el-text type="primary" size="large" >{{item.name}}</el-text>
                    </template>
                    <!-- 问题列表 -->
                    <el-table :data="questionList" max-height="342" style="width: 100%">
                        <el-table-column label="状态" prop="state" width="100" align="center"
                            :filters="[
                                { text: '已完成', value: 2 },
                                { text: '未开始', value: 0 },
                                { text: '尝试中', value: 1 },
                            ]"
                            :filter-method="filterState">
                            <template #default="scope">
                                <el-icon v-if="scope.row.state===2" size="20" color="#15BD66"><CircleCheckFilled /></el-icon>
                                <el-icon v-else-if="scope.row.state===1" size="20" color="#FFB800"><Clock /></el-icon>
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

                        <el-table-column label="标签" prop="topicType">
                            <template #default="scope">
                                <el-tag v-for="item in scope.row.labelList">
                                    {{item.name}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="难易程度" prop="levelName"
                                         :filters="[
                { text: '简单', value: 0},
                { text: '中等', value: 1 },
                { text: '困难', value: 2 },
              ]" :filter-method="filterState"
                        >
                            <template #default="scope">
                                <el-tag v-if="scope.row.level===0" type="success" effect="dark">
                                    {{scope.row.difficultyScore===0?levelName[scope.row.level]:scope.row.difficultyScore}}
                                </el-tag>
                                <el-tag v-else-if="scope.row.level===1" type="warning" effect="dark">
                                    {{scope.row.difficultyScore===0?levelName[scope.row.level]:scope.row.difficultyScore}}
                                </el-tag>
                                <el-tag v-else type="danger" effect="dark">
                                    {{scope.row.difficultyScore===0?levelName[scope.row.level]:scope.row.difficultyScore}}
                                </el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column label="题解">
                            <template #default="scope">
                                <router-link :to="{path:'/solution/'+scope.row.id}">
                                    <el-button type="primary" size="small">
                                        {{scope.row.solutionCount}}
                                    </el-button>
                                </router-link>
                            </template>
                        </el-table-column>

                        <el-table-column v-if="userInfo.power!=='USER'" label="上次修改时间" prop="updateTime"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template #default="{ row }">
                                <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true;isMultiple=false;" ></el-button>
                                <el-button v-if="userInfo.power!=='USER'" :icon="Delete" circle plain type="danger" @click="deleteShip(row)" ></el-button>
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
                <div v-if="isMultiple">
                    <el-form-item label="问题列表" >
                        <el-select
                            :disabled="isDisable"
                            v-model="topicQuestionModel.questionIdList"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入题目"
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
                </div>
                <div v-else>
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
                </div>

                <el-form-item label="属于题单">
                    <el-select
                        :disabled="!isDisable"
                        v-model="topicQuestionModel.topicName"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入题单名"
                        remote-show-suffix
                        :remote-method="queryAllTopic"
                        :loading="loading"
                        style="width: 240px">
                        <el-option
                            v-for="item in allTopicList"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select
                        v-model="topicQuestionModel.topicType"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入标签"
                        remote-show-suffix
                        :remote-method="queryAllLabel"
                        :loading="loading"
                        style="width: 240px">
                        <el-option
                            v-for="item in allLabelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="isDisable" label="题目状态">
                    <el-radio-group v-model="topicQuestionModel.question.state">
                        <el-radio  :label="0" >未开始</el-radio>
                        <el-radio  :label="1" >尝试中</el-radio>
                        <el-radio  :label="2">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加题目'||title === '批量添加题目' ? addShip() : updateShip()">确认</el-button>
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

