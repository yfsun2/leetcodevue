<script setup>
import {Edit, Delete, CircleCheckFilled, CircleCloseFilled, Management} from '@element-plus/icons-vue'
import {onMounted, ref, watch} from 'vue'
import { questionPageService,addQuestionService,deleteQuestionService,updateQuestionService,getByUrl} from '@/api/question.js'
import { labelListService} from '@/api/label.js'
import {ElMessage,ElMessageBox} from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
import {useRouter} from "vue-router";
const route = useRouter()


const props=defineProps(['platformId'])

const userInfoStore = useUserInfoStore();

const userInfo = ref({...userInfoStore.info})


const showTag=ref(true)

watch(() => props.platformId, (newValue, oldValue) => {
    console.log(`someProp changed from ${oldValue} to ${newValue}`);
    onSearch()
});

//模糊查询搜索词
const search =ref({
    name:route.currentRoute.value.query.query,
    typeId:null
})
//问题列表
const questionList=ref([])
//标签
let allLabelList=ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(0)//总条数
const pageSize = ref(50)//每页条数

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

//定义变量,控制标题的展示
const title = ref('')

//控制添加问题弹窗
const visibleDrawer = ref(false)

//加载
let loading=ref(false)

let isDisable=ref(false)

//展示编辑弹窗
const showDialog = (row) => {
    visibleDrawer.value = true;
    title.value = '编辑问题';
    //数据拷贝
    questionModel.value.questionId = row.questionId;
    questionModel.value.name = row.name;
    questionModel.value.link = row.link;
    questionModel.value.labelList = row.labelList?(row.labelList.map((item)=>{
        return {value:item.id,label:item.name}
    })):[];
    questionModel.value.level = row.level;
    questionModel.value.difficultyScore = row.difficultyScore;
    questionModel.value.state = row.state;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    questionModel.value.id = row.id
}

//问题展示模型
const questionModel = ref({
    id:0,
    questionId:'',
    name: '',
    link:"",
    labelList:[],
    level:0,
    difficultyScore:0,
    state:0,
    solutionCount:0,
})


//查询
const onSearch = async() => {
    let params = {
        current: pageNum.value,
        size: pageSize.value,
        search: search.value.name,
        typeId:search.value.typeId,
        platformId:props.platformId,
    }
    debugger
    await questionPageService(params).then((result)=>{
        //渲染视图
        total.value = result.data.total;
        questionList.value = result.data.records;
    }).catch((err)=>{
        console.log(err)
    })
}

onMounted(()=>{
    onSearch();
})

const queryAllLabel=async (query)=>{
    if(query){
        loading.value = true
        let params = {
            search: query,
            type:"问题"
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

const addQuestion=async()=>{
    let params = {
        questionId:questionModel.value.questionId,
        name:questionModel.value.name,
        link:questionModel.value.link,
        labelId:questionModel.value.labelList.map((item)=>item.value).join(','),
        level:questionModel.value.level,
        difficultyScore:questionModel.value.difficultyScore,
        state:questionModel.value.state,
        platformId:props.platformId
    }
    await addQuestionService(params).then((result)=>{
        ElMessage.success(result.msg? result.msg:'添加成功');
        //隐藏弹窗
        visibleDrawer.value = false;
        //刷新当前列表
        onSearch()
    }).catch((err)=>{
        console.log(err)
        ElMessage.error(err.msg? err.msg:'添加失败');
    })
}

//编辑问题
const updateQuestion = async () => {
    let params = {
        id:questionModel.value.id,
        questionId:questionModel.value.questionId,
        name:questionModel.value.name,
        link:questionModel.value.link,
        labelId:questionModel.value.labelList.map((item)=>item.value).join(','),
        level:questionModel.value.level,
        difficultyScore:questionModel.value.difficultyScore,
        state:questionModel.value.state
    }

    //调用接口
    await updateQuestionService(params).then((result)=>{
        ElMessage.success(result.msg ? result.msg : '修改成功')
        //隐藏弹窗
        visibleDrawer.value = false;
        //刷新列表
        onSearch()
    }).catch((err)=>{
        console.log(err)
        ElMessage.error(err.msg? err.msg:'添加失败');
    })
}

//清空模型的数据
const clearData = () => {
    //保留上次
    if(typeof questionModel.value.questionId==='number'){
        questionModel.value.questionId ++;
    }else {
        if(questionModel.value.questionId.length===0){
            questionModel.value.questionId='A'
        }
        let lastCode=questionModel.value.questionId.charCodeAt(questionModel.value.questionId.length-1);
        let newChar=String.fromCharCode(lastCode+1);
        questionModel.value.questionId=questionModel.value.questionId.slice(0,-1)+newChar
    }
    // questionModel.value.questionId ++;
    questionModel.value.name = '';
    questionModel.value.link = '';
    questionModel.value.labelList = [];
    questionModel.value.level = 0;
    questionModel.value.difficultyScore =0;
    questionModel.value.state = 0;
}

//删除问题
const deleteQuestion = (row) => {
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
        await deleteQuestionService(row.id).then(()=>{
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
//列过滤
const filterState = (value, row, column) => {
    const property = column.property
    return row[property] === value
}

const mySort=(a,b)=>{
    return Number(a)-Number(b)
}


</script>

<template>
    <el-card class="page-container">
        <!--头部-->
        <template #header>
            <div class="header">
                <span style="margin-right: 20px">问题管理</span>
                <!-- 搜索表单 -->
                <el-form inline style="max-height: 28px">
                    <el-form-item label="名称：">
                        <el-input  placeholder="名称" v-model="search.name" @input="onSearch" />
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select
                            v-model="search.typeId"
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
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">搜索</el-button>
                        <el-button @click="search.name = '' ;search.typeId=null">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="extra" >
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加问题';clearData();isDisable=false">添加问题</el-button>
                </div>
            </div>
        </template>

        <!-- 问题列表 -->
        <el-table :data="questionList" max-height="380" style="width: 100%">
            <el-table-column label="状态" prop="state" width="100" align="center"
                 :filters="[
                { text: '已完成', value: 2},
                { text: '未开始', value: 0 },
                { text: '尝试中', value: 1 }]"
               :filter-method="filterState"
            >
            <template #default="scope">
                <el-icon v-if="scope.row.state===2" size="20" color="#15BD66"><CircleCheckFilled /></el-icon>
                <el-icon v-else-if="scope.row.state===1" size="20" color="#fb5858"><CircleCloseFilled /></el-icon>
                <el-icon v-else size="20" ></el-icon>
            </template>
            </el-table-column>
            <el-table-column label="题目" sortable prop="questionId" :sort-method="mySort" width="280px">
                <template #default="scope">
                    <el-link :href="scope.row.link" target="_blank" type="primary" style="text-decoration: none" :underline="false">
                        {{scope.row.questionId}}.{{ scope.row.name }}
                    </el-link>
                </template>
            </el-table-column>

            <el-table-column label="标签" width="300px">
                <template #header>
                    <el-row>
                        <el-text style="margin-right: 5px" type="info">显示标签</el-text>
                        <el-switch v-model="showTag" />
                    </el-row>
                </template>
                <template  #default="scope">
                    <el-tag   v-for="item in scope.row.labelList" v-if="showTag">
                        {{item.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="难易程度" prop="level"
                 :filters="[
                 { text: '简单', value: 0},
                 { text: '中等', value: 1 },
                 { text: '困难', value: 2 }]"
                 :filter-method="filterState">
                <template #default="scope">
                    <el-tag v-if="scope.row.level===0" type="success" effect="dark">
                        {{scope.row.difficultyScore===0?"简单":scope.row.difficultyScore}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.level===1" type="warning" effect="dark">
                        {{scope.row.difficultyScore===0?"中等":scope.row.difficultyScore}}
                    </el-tag>
                    <el-tag v-else type="danger" effect="dark">
                        {{scope.row.difficultyScore===0?"困难":scope.row.difficultyScore}}
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
            <el-table-column label="上次修改时间" prop="updateTime" width="200px"> </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true"></el-button>
                    <el-button v-if="userInfo.power!=='USER'" :icon="Delete" circle plain type="danger" @click="deleteQuestion(row)" ></el-button>
                </template>
            </el-table-column>
            <!--无数据展示-->
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
                       layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                       @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加问题表单 -->
            <el-form :model="questionModel" label-width="100px">
                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="题目ID">
                    <el-input  v-model="questionModel.questionId"></el-input>
                </el-form-item>
                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="题目标题">
                    <el-input v-model="questionModel.name" placeholder="请输入题目标题"></el-input>
                </el-form-item>

                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="问题URL">
                    <el-input v-model="questionModel.link" placeholder="请输入问题URL"></el-input>
                </el-form-item>

                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="标签">
                    <el-select
                        v-model="questionModel.labelList"
                        multiple
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
                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="难易程度">
                    <el-radio-group v-model="questionModel.level">
                        <el-radio  :label="0">简单</el-radio>
                        <el-radio  :label="1">中等</el-radio>
                        <el-radio  :label="2">困难</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="userInfo.power!=='USER'||title==='添加问题'" label="难度分">
                    <el-input-number v-model="questionModel.difficultyScore" :min="0" :max="4000" :step="50"></el-input-number>
                </el-form-item>
                <el-form-item  label="题目状态">
                    <el-radio-group v-model="questionModel.state">
                        <el-radio  :label="0" >未开始</el-radio>
                        <el-radio  :label="1" >尝试中</el-radio>
                        <el-radio  :label="2">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加问题' ? addQuestion() : updateQuestion()">确认</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>

<style lang="scss" scoped>
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
