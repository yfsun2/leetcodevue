<script setup>
import {Edit, Delete, CircleCheckFilled, CircleCheck, Clock, CircleCloseFilled} from '@element-plus/icons-vue'
import {ref} from 'vue'
import { questionPageService,addQuestionService,deleteQuestionService,updateQuestionService} from '@/api/question.js'
import { typeListService} from '@/api/type.js'
import {ElMessage,ElMessageBox} from 'element-plus'

//模糊查询搜索词
const search =ref('')
//问题列表
const questionList=ref([])
//类型
let allTypeList=ref([])

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
    questionModel.value.typeList = row.typeList.map((item)=>{
        return {value:item.id,label:item.name}
    });
    questionModel.value.levelId = row.levelId;
    questionModel.value.levelName = row.levelName;
    questionModel.value.difficultyScore = row.difficultyScore;
    questionModel.value.stateId = row.stateId;
    questionModel.value.stateName = row.stateName;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    questionModel.value.id = row.id
}

//问题展示模型
const questionModel = ref({
    id:0,
    questionId:'',
    name: '',
    link:"",
    typeList:[],
    levelId:0,
    levelName:"",
    difficultyScore:0,
    stateId:0,
    stateName:""
})

//查询
const onSearch = async(val) => {
    let params = {
        current: pageNum.value,
        size: pageSize.value,
        search: search.value ? search.value : val,
    }
    await questionPageService(params).then((result)=>{
        //渲染视图
        total.value = result.data.total;
        questionList.value = result.data.records;
    }).catch((err)=>{
        console.log(err)
    })
}

onSearch();

const queryAllType=async (query)=>{
    if(query){
        loading.value = true
        let params = {search: query}
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

const addQuestion=async()=>{
    let params = {
        questionId:questionModel.value.questionId,
        name:questionModel.value.name,
        link:questionModel.value.link,
        typeId:questionModel.value.typeList.map((item)=>item.value).join(','),
        level:questionModel.value.levelId,
        difficultyScore:questionModel.value.difficultyScore,
        state:questionModel.value.stateId
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
        typeId:questionModel.value.typeList.map((item)=>item.value).join(','),
        level:questionModel.value.levelId,
        difficultyScore:questionModel.value.difficultyScore,
        state:questionModel.value.stateId
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
    //questionModel.value.questionId = '';
    questionModel.value.name = '';
    questionModel.value.link = '';
    questionModel.value.typeList = [];
    questionModel.value.levelId = 0;
    questionModel.value.difficultyScore =0;
    questionModel.value.stateId = 0;
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
        await deleteQuestionService(row.id).then((result)=>{
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
</script>

<template>
    <el-card class="page-container">
        <!--头部-->
        <template #header>
            <div class="header">
                <span>问题管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;title = '添加问题';clearData();isDisable=false">添加问题</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="名称：">
                <el-input  placeholder="名称" v-model="search" @input="onSearch" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="search = '';">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 问题列表 -->
        <el-table :data="questionList" max-height="342" style="width: 100%">
            <el-table-column label="状态" prop="stateName" width="100" align="center"
                 :filters="[
                { text: '已完成', value: '已完成'},
                { text: '未开始', value: '未开始' },
                { text: '尝试中', value: '尝试中' }]"
               :filter-method="filterState"
            >
            <template #default="scope">
                <el-icon v-if="scope.row.stateName==='已完成'" size="20" color="#15BD66"><CircleCheckFilled /></el-icon>
                <el-icon v-else-if="scope.row.stateName==='尝试中'" size="20" color="#fb5858"><CircleCloseFilled /></el-icon>
                <el-icon v-else size="20" ></el-icon>
            </template>
            </el-table-column>
            <el-table-column label="题目" sortable prop="questionId">
                <template #default="scope">
                    <el-tooltip content="点击进入新页面" placement="top-start" effect="light">
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
                 { text: '困难', value: '困难' }]"
                 :filter-method="filterState"
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
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row);isDisable=true"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteQuestion(row)"></el-button>
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
                <el-form-item label="题目ID">
                    <el-input  v-model="questionModel.questionId"></el-input>
                </el-form-item>
                <el-form-item label="题目标题">
                    <el-input v-model="questionModel.name" placeholder="请输入题目标题"></el-input>
                </el-form-item>
                <el-form-item label="问题URL">
                    <el-input v-model="questionModel.link" placeholder="请输入问题URL"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-select
                        v-model="questionModel.typeList"
                        multiple
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
                <el-form-item label="难易程度">
                    <el-radio-group v-model="questionModel.levelId">
                        <el-radio  :label="0">简单</el-radio>
                        <el-radio  :label="1">中等</el-radio>
                        <el-radio  :label="2">困难</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="难度分">
                    <el-input-number v-model="questionModel.difficultyScore" :min="0" :max="4000" :step="50"></el-input-number>
                </el-form-item>
                <el-form-item label="题目状态">
                    <el-radio-group v-model="questionModel.stateId">
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
