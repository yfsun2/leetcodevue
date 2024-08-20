<script setup>
import {Edit,Delete} from '@element-plus/icons-vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import {ref, watch} from 'vue'
import {addContestService, contestPageService,deleteContestService,updateContestService} from '@/api/contest.js'
import {questionListService} from "@/api/question.js";
import QuestionItem from "@/components/QuestionItem.vue";
import {queryByIdService} from "@/api/platform.js";

const props=defineProps(['platformId'])

watch(() => props.platformId, (newValue, oldValue) => {
    console.log(`someProp changed from ${oldValue} to ${newValue}`);
    queryCount()
    onSearch()
});

const questionCount=ref([0,1,2,3])

//模糊查询搜索词
const search =ref('')

//问题列表
const contestList=ref([])
//类型
let allQuestionList=ref([])
//加载
let loading=ref(false)

const isDisable=ref(false)
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(1)//总条数
const pageSize = ref(10)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    onSearch();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    onSearch();
}
//抽屉标题
const title=ref('')
//控制抽屉显示
const visibleDrawer=ref(false)

//展示编辑弹窗
const showDialog = (row) => {
    visibleDrawer.value = true;
    title.value = '编辑周赛';
    //数据拷贝
    contestModel.value.contestId=row.contestId;
    contestModel.value.typeId=row.typeId;
    contestModel.value.questionList=row.questionList;
    contestModel.value.link=row.link;
    contestModel.value.questionIdNameList=row.questionList.map((item) => {
        return { value:item.id, label:item.questionId+"."+item.name,id:item.id}
    });
    contestModel.value.startTime=row.startTime;
    //扩展id属性,将来需要传递给后台,完成修改
    contestModel.value.id = row.id;
}

const queryCount=async ()=>{
    let params={
        id:props.platformId
    }
    let result=await queryByIdService(params);
    if(result.data.questionCount>0){
        let arrId=[]
        for(let i=0;i<result.data.questionCount;i++){
            arrId.push(i)
        }
        questionCount.value=arrId
    }
}
queryCount()

//模糊查询所有竞赛
const onSearch = async(val) => {
    let params = {
        current: pageNum.value,
        size: pageSize.value,
        search: search.value ? search.value : val,
        platformId:props.platformId
    }
    let result = await contestPageService(params);
    //渲染视图
    total.value = result.data.total;
    contestList.value = result.data.records;

    debugger
}

onSearch();

const queryAllQuestion=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query,
            platformId: props.platformId
        }
        await questionListService(params).then((result)=>{
            setTimeout(() => {
                loading.value = false
                allQuestionList.value = result.data.map((item) => {
                    return { value:item.questionId, label:item.name,id:item.id}
                })
            }, 200)
        })
    }else{
        allQuestionList.value=[]
    }
}

const contestModel=ref({
    id:0,
    contestId:0,
    typeId:0,
    link:'',
    questionList:[],
    questionIdNameList:[],
    startTime:0,
    platformId:0
})

const addContest=async()=>{
    let params = {
        contestId:contestModel.value.contestId,
        platformId:props.platformId,
        type:contestModel.value.typeId,
        link:contestModel.value.link,
        questionIdList:contestModel.value.questionIdNameList.map((item)=>item.id),
        startTime:contestModel.value.startTime,
    }
    await addContestService(params).then((result)=>{
        ElMessage.success(result.msg? result.msg:'添加成功');
        visibleDrawer.value = false;
        //刷新当前列表
        onSearch()
    }).catch((err)=>{
        console.log(err)
        ElMessage.error('添加失败');
    })
}

//编辑周赛
const updateContest= async () => {
    let params = {
        id:contestModel.value.id,
        contestId:contestModel.value.contestId,
        platformId:props.platformId,
        type:contestModel.value.typeId,
        link:contestModel.value.link,
        questionIdList:contestModel.value.questionIdNameList.map((item)=>item.id),
        startTime:contestModel.value.startTime,
    }
    //调用接口
    await updateContestService(params).then(result=>{
        ElMessage.success(result.msg ? result.msg : '修改成功')
        //隐藏弹窗
        visibleDrawer.value = false;
        //调用获取所有问题的函数
         onSearch()
    }).catch(err=>{
        console.log(err)
        ElMessage.error('修改失败')
    })
}


//删除问题
const deleteContest = (row) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该周赛吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        deleteContestService(row.id,row.type).then((result)=>{
            ElMessage.success('删除成功');
            //刷新列表
            onSearch();
        }).catch((err)=>{
            ElMessage.error('删除失败');
        })
    }).catch(() => {
        ElMessage.info('用户取消了删除');
    })
}

//清空模型的数据
const clearData = () => {
    contestModel.value.contestId = 0;
    contestModel.value.typeId = 0;
    contestModel.value.questionIdNameList = [];
}

const tableCellClassName=({rowIndex,columnIndex,row})=>{
    if(columnIndex>0&&row.questionList[columnIndex-1]?.stateName==="已完成"){
        return 'success-cell'
    }else if(columnIndex>0&&row.questionList[columnIndex-1]?.stateName==="尝试中"){
        return 'warning-cell'
    }else {
        return ''
    }
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>周赛管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加周赛';clearData();isDisable=false">添加周赛</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="名称：">
                <el-input  placeholder="名称" v-model="search" @input="onSearch"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="search = '';">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 周赛列表 -->
        <el-table :data="contestList" height="342" style="width: 100%" :cell-class-name="tableCellClassName">
            <el-table-column label="竞赛" align="center">
                <template #default="scope">
                    <el-tooltip
                        :content="'第'+scope.row.contestId+'场'+((scope.row.typeId===1)?'双周赛':'周赛')"
                        placement="top-start"
                        effect="light">
                        <el-link :href="scope.row.link" target="_blank" style="text-decoration: none" :underline="false">
                            第
                            <el-text v-if="scope.row.typeId===0" type="primary">
                                {{scope.row.contestId}}
                            </el-text>
                            <el-text v-else type="warning">
                                {{scope.row.contestId}}
                            </el-text>
                            场
                            <el-text v-if="scope.row.typeId===0" type="primary">
                                周赛
                            </el-text>
                            <el-text v-else type="warning">
                                双周赛
                            </el-text>
                        </el-link>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="问题" align="center" >
                <el-table-column v-for="index in questionCount" :label="'Q'+(index+1)" align="center">
                    <template #default="scope">
                        <QuestionItem  v-if="scope.row.questionList.length>0&&scope.row.questionList[index]" :item="scope.row.questionList[index]"></QuestionItem>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime" align="center" sortable></el-table-column>
            <el-table-column  label="操作" width="150" align="center">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteContest(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                       layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                       @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加&编辑问题表单 -->
            <el-form :model="contestModel" label-width="100px">
                <el-form-item label="周赛ID">
                    <el-input-number v-model="contestModel.contestId" :min="1" :max="1000" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="周赛类型">
                    <el-radio-group v-model="contestModel.typeId">
                        <el-radio  :label="0">单周赛</el-radio>
                        <el-radio  :label="1">双周赛</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="周赛链接">
                    <el-input v-model="contestModel.link"></el-input>
                </el-form-item>

                <el-form-item label="题目ID">
                    <el-select
                        v-model="contestModel.questionIdNameList"
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
                <el-form-item label="开始时间" >
                    <el-date-picker
                        v-model="contestModel.startTime"
                        type="datetime"
                        placeholder="开始时间"
                        :disabled-date="(time)=>time.getTime() > Date.now()"
                        size="large"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加周赛' ? addContest() : updateContest()">确认</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>

<style lang="scss" scoped>

.el-table .el-table__body tr.el-table__row:hover td {
    background-color: inherit;
}

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
    :deep(.avatar-uploader) {
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

:deep(.el-table .warning-cell) {
    background-color: #fbd8d8;
}

:deep(.el-table .success-cell){
    background-color: #dff0d8;
}
</style>

