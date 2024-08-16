<script setup>
import {Edit, Delete} from '@element-plus/icons-vue'
import {ref} from 'vue'
import { typePageService,addTypeService ,deleteTypeService,updateTypeService} from '@/api/type.js'
import {ElMessage,ElMessageBox} from 'element-plus'

//模糊查询词
const search =ref('')

//table要用的列表
const typeList=ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(0)//总条数
const pageSize = ref(5)//每页条数

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

//控制添加分类弹窗
const dialogVisible = ref(false)

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑类型'
    //数据拷贝
    typeModel.value.name = row.name;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    typeModel.value.id = row.id
}

//表单模型
const typeModel = ref({
    name: ''
})

//模糊查询
const onSearch = async(val) => {
  let params = {
    current: pageNum.value,
    size: pageSize.value,
      search: search.value ? search.value : val,
  }
  let result = await typePageService(params);

  //渲染视图
  total.value = result.data.total;
  typeList.value = result.data.records;
}

onSearch();


const onAddType=async()=>{
  let params = {
    name:typeModel.value.name
  }

  let result= await addTypeService(params)
  ElMessage.success(result.msg? result.msg:'添加成功');

  dialogVisible.value = false;

  //刷新当前列表
  await onSearch()
}

//编辑分类
const updateCategory = async () => {
  //调用接口
  let result = await updateTypeService(typeModel.value);

  ElMessage.success(result.msg ? result.msg : '修改成功')

  //调用获取所有分类的函数
  await onSearch()

  //隐藏弹窗
  dialogVisible.value = false;
}

//清空模型的数据
const clearData = () => {
  typeModel.value.name = '';
}

//删除分类
const deleteCategory = (row) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该类型吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        await deleteTypeService(row.id).then(result=>{
            ElMessage.success('删除成功');
            //刷新列表
            onSearch();
        }).catch(err=>console.log(err))
    }).catch(() => {
        ElMessage.info('用户取消了删除')
    })
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>类型管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;title = '添加类型';clearData()">添加类型</el-button>
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
        <!-- 类型列表 -->
        <el-table :data="typeList" style="width: 100%">
            <el-table-column label="类型ID" prop="id"></el-table-column>
            <el-table-column label="类型名称" prop="name"></el-table-column>
            <el-table-column label="上次修改时间" prop="updateTime"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
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

        <!--    &lt;!&ndash; 抽屉 &ndash;&gt;-->
        <!--    <el-drawer v-model="visibleDrawer" title="添加类型" direction="rtl" size="50%">-->
        <!--      &lt;!&ndash; 添加文章表单 &ndash;&gt;-->
        <!--      <el-form :model="typeModel" label-width="100px">-->
        <!--        <el-form-item label="类型名称">-->
        <!--          <el-input v-model="typeModel.name" placeholder="请输入名称"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" @click="onAddType()">添加</el-button>-->
        <!--        </el-form-item>-->
        <!--      </el-form>-->
        <!--    </el-drawer>-->

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="typeModel"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="typeModel.name" minlength="1"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="title === '添加类型' ? onAddType() : updateCategory()"> 确认 </el-button>
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
}
</style>
