<script lang="js" setup>
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {ArrowRight, Delete, Edit} from "@element-plus/icons-vue";
import {addSolutionService,queryListSolutionService,updateSolutionService,deleteSolutionService} from "@/api/solution.js";
import {getName} from "@/api/question.js";
import useUserInfoStore from '@/stores/userInfo.js'
import MdEditor from "@/components/MdEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

const props=defineProps(['questionId'])

const question=ref({
    questionId:'',
    name:'',
    link:'',
    platformId:'',
    platformName:'',
})

//控制添加弹窗
const addVisible = ref(false)

const watchVisible=ref(false)

//模糊查询搜索词
const search =ref('')

const markdownTitle=ref('')
const markdownText=ref('')
const author=ref('')


const dialogTitle=ref('')

//题解列表
const solutionList=ref([])

//题解模型
const solutionModel = ref({
    id:'',
    userId:'',
    username: '',
    title:"",
    content:"",
    createTime:'',
    updateTime:'',
})

//清空模型的数据
const clearData = () => {
    solutionModel.value.title = '';
    solutionModel.value.content='';
}


//查询
const onSearch = async() => {
    let params = {
        questionId:props.questionId,
        search: search.value,
    }
    await queryListSolutionService(params).then((result)=>{
        //渲染视图
        solutionList.value = result.data;
    }).catch((err)=>{
        console.log(err)
    })
}

onMounted(()=>{
    onSearch()
})

const getName1=async ()=>{
    await getName(props.questionId).then((result)=>{
        //渲染视图
        question.value = result.data;
        debugger
    }).catch((err)=>{
        console.log(err)
    })
}

getName1()
//删除题解
const deleteSolution = (row) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该题解吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        await deleteSolutionService(row.id).then(res=>{
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

//展示编辑弹窗
const showDialog = (row) => {
    addVisible.value = true;
    dialogTitle.value = '编辑题解'
    //数据拷贝
    solutionModel.value.title = row.title;
    solutionModel.value.content = row.content;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    solutionModel.value.id = row.id
}

const showDetail=(row)=>{
    markdownTitle.value=row.title;
    markdownText.value=row.content;
    author.value=row.username;
    watchVisible.value=true;
}

const addSol=async()=>{
    let params={
        questionId:props.questionId,
        title:solutionModel.value.title,
        content:solutionModel.value.content
    }
    debugger
    await addSolutionService(params).then(res=>{
        ElMessage.success('添加题解成功');
        addVisible.value=false;
        onSearch()
    }).catch(err=>{
        console.log(err)
    })
}

const updateSol=async()=>{
    let params={
        id:solutionModel.value.id,
        questionId:props.questionId,
        title:solutionModel.value.title,
        content:solutionModel.value.content
    }
    await updateSolutionService(params).then(res=>{
        ElMessage.success('更新题解成功');
        addVisible.value=false;
        onSearch()
    }).catch(err=>{
        console.log(err)
    })
}


</script>

<template>
    <el-card class="page-container">
        <!--头部-->
        <template #header>
            <div class="header">
                <el-breadcrumb :separator-icon="ArrowRight" style="font-size: 16px">
                    <el-breadcrumb-item :to="{path:'/question/'+question.platformId+'/'+question.platformName}">问题管理</el-breadcrumb-item>
                    <el-breadcrumb-item >
                        <el-link :href="question.link" target="_blank" style="text-decoration: none;" type="primary" :underline="false">
                            {{question.questionId}}.{{question.name}}
                        </el-link>
                    </el-breadcrumb-item>
                </el-breadcrumb>


                <div class="extra" >
                    <el-button type="primary" @click="addVisible=true;dialogTitle='添加题解';clearData()">添加题解</el-button>
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
                <el-button @click="search = '' ;">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 题解列表 -->
        <el-table :data="solutionList" max-height="342" style="width: 100%">
            <el-table-column  label="标题" prop="title" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="作者" prop="username" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="详情" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="showDetail(scope.row)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center">

            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" align="center">

            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="{ row }">
                    <div v-if="userInfo.id===row.userId">
                        <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                        <el-button :icon="Delete" circle plain type="danger" @click="deleteSolution(row)" ></el-button>
                    </div>
                </template>
            </el-table-column>
            <!--无数据展示-->
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="addVisible" :title="dialogTitle" width="70%" top="10vh">
            <el-input v-model="solutionModel.title" placeholder="请输入题解标题"></el-input>
            <MdEditor style="margin-top: 10px" v-model="solutionModel.content"/>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogTitle === '添加题解' ? addSol() : updateSol()">保存</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="watchVisible" :title="markdownTitle+'（作者：'+author+'）'" width="70%" top="10vh">
            <MdViewer :markdown-text="markdownText"></MdViewer>
            <template #footer>
                <span class="dialog-footer">
<!--                    <el-button @click="watchVisible = false">取消</el-button>-->
                    <el-button type="primary" @click="watchVisible = false">返回</el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style scoped lang="scss">
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>
