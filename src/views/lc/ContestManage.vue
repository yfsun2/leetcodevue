<script setup>
import {Edit,Delete} from '@element-plus/icons-vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import {onMounted, ref, watch} from 'vue'
import {addContestService, contestPageService,deleteContestService,updateContestService} from '@/api/contest.js'
import {questionListService} from "@/api/question.js";
import QuestionItem from "@/components/QuestionItem.vue";
import {queryByIdService} from "@/api/platform.js";
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const props=defineProps(['platformId','platformName'])


const userInfo = ref({...userInfoStore.info})

watch(() => props.platformId, (newValue, oldValue) => {
    console.log(`someProp changed from ${oldValue} to ${newValue}`);
    queryCount()
    onSearch()
});

const questionCount=ref([0,1,2,3])

//模糊查询搜索词
const search =ref('')

const prefix=ref("")
const type=ref(4)

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
    type.value=row.type;
    contestModel.value.contestId=row.contestId;
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

onMounted(()=>{
    queryCount();
    onSearch();
})
queryCount()



//模糊查询所有竞赛
async function onSearch () {
    let params = {
        current: pageNum.value,
        size: pageSize.value,
        search: search.value ,
        platformId:props.platformId
    }
    let result = await contestPageService(params);
    //渲染视图
    total.value = result.data.total;
    contestList.value = result.data.records;
}


const queryAllQuestion=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query,
            platformId: props.platformId
        }
        await questionListService(params).then((result)=>{
            loading.value = false
            allQuestionList.value = result.data.map((item) => {
                return { value:item.questionId, label:item.name,id:item.id}
            })
        })
    }else{
        allQuestionList.value=[]
    }
}

const contestModel=ref({
    id:0,
    contestId:'',
    type:0,
    link:'',
    questionList:[],
    questionIdNameList:[],
    startTime:0,
    platformId:0
})

const addContest=async()=>{
    let params = {
        contestId:prefix.value+contestModel.value.contestId,
        type:type.value,
        platformId:props.platformId,
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
    })
}

//编辑周赛
const updateContest= async () => {
    let params = {
        id:contestModel.value.id,
        contestId:prefix.value+contestModel.value.contestId,
        type:type.value,
        platformId:props.platformId,
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
    })
}


//删除周赛
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
        deleteContestService(row.id,row.type).then(()=>{
            ElMessage.success('删除成功');
            //刷新列表
            onSearch();
        }).catch((err)=>{
            console.log(err)
            ElMessage.error('删除失败');
        })
    }).catch(() => {
        ElMessage.info('用户取消了删除');
    })
}

//清空模型的数据
const clearData = () => {
    contestModel.value.contestId = '';
    contestModel.value.questionIdNameList = [];
}

const tableCellClassName=({rowIndex,columnIndex,row})=>{
    if(columnIndex>0&&row.questionList[columnIndex-1]?.state===2){
        return 'success-cell'
    }else if(columnIndex>0&&row.questionList[columnIndex-1]?.state===1){
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
                <!-- 搜索表单 -->
                <el-form inline style="max-height: 28px">
                    <el-form-item label="名称：">
                        <el-input  placeholder="名称" v-model="search" @input="onSearch"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">搜索</el-button>
                        <el-button @click="search = '';">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加周赛';clearData();isDisable=false">添加周赛</el-button>
                </div>
            </div>
        </template>

        <!-- 周赛列表 -->
        <el-table :data="contestList" height="380" style="width: 100%" :cell-class-name="tableCellClassName">
            <el-table-column label="竞赛" align="center">
                <template #default="scope">
                    <el-link :href="scope.row.link" target="_blank" style="text-decoration: none" :underline="false">
                        <el-text type="primary" v-if="scope.row.type===0">
                            {{scope.row.contestId}}
                        </el-text>
                        <el-text type="warning" v-else-if="scope.row.type===1">
                            {{scope.row.contestId}}
                        </el-text>
                        <el-text type="danger" v-else-if="scope.row.type===2">
                            {{scope.row.contestId}}
                        </el-text>
                        <el-text type="success" v-else-if="scope.row.type===3">
                            {{scope.row.contestId}}
                        </el-text>
                        <el-text type="info" v-else>
                            {{scope.row.contestId}}
                        </el-text>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="问题" align="center" >
                <el-table-column v-for="index in questionCount" :label="'Q'+(index+1)" align="center" >
                    <template #default="scope">
                        <QuestionItem  v-if="scope.row.questionList.length>0&&scope.row.questionList[index]" :item="scope.row.questionList[index]" :platform-id="props.platformId" :platform-name="props.platformName" :index="index+1"></QuestionItem>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime" align="center" sortable></el-table-column>
            <el-table-column  label="操作" width="150" align="center">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true" ></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteContest(row)" ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10,20,50]"
                       layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                       @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加&编辑问题表单 -->
            <el-form :model="contestModel" label-width="100px">
                <el-form-item label="周赛ID">
                    <el-input v-model="contestModel.contestId">
<!--                        v-if="title==='添加周赛'"-->
                        <template #prepend >
                            <el-select v-model="prefix" placeholder="周赛类型" style="width: 200px">
                                <el-option label="空" value="" ></el-option>
                                <el-option label="Weekly Contest" value="Weekly Contest " @click="type=0"></el-option>
                                <el-option label="Biweekly Contest" value="Biweekly Contest " @click="type=1"></el-option>
                                <el-option label="Codeforces Round" value="Codeforces Round " @click="type=0"></el-option>
                                <el-option label="Educational Codeforces Round" value="Educational Codeforces Round " @click="type=1"></el-option>
                                <el-option label="AtCoder Beginner Contest" value="AtCoder Beginner Contest " @click="type=0"></el-option>
                                <el-option label="AtCoder Regular Contest" value="AtCoder Regular Contest " @click="type=1"></el-option>
                                <el-option label="AtCoder Grand Contest" value="AtCoder Grand Contest " @click="type=2"></el-option>
                                <el-option label="牛客周赛 Round" value="牛客周赛 Round " @click="type=0"></el-option>
                                <el-option label="牛客小白月赛" value="牛客小白月赛" @click="type=3"></el-option>
                                <el-option label="牛客练习赛" value="牛客练习赛" @click="type=1"></el-option>
                                <el-option label="牛客挑战赛" value="牛客挑战赛" @click="type=2"></el-option>
                            </el-select>
                        </template>
                    </el-input>
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
    height: 500px;

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

