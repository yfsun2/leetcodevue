<script lang="js" setup>
import {onMounted, ref, watch} from 'vue'
import {listEveryday, questionListService,updateEveryday} from "@/api/question.js";
import {ElMessage} from "element-plus";


function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以需要+1，并且使用padStart来确保月份是两位数
    const day = String(date.getDate()).padStart(2, '0'); // 使用padStart来确保日期是两位数
    return `${year}-${month}-${day}`;
}

const dialogVisible=ref(false)
//加载
const loading=ref(false)

//查询出的问题列表
const allQuestionList=ref([])

const monthData=ref({})

const calendar = ref()

const chooseDate=ref()

const question=ref({id:'',value:0,state:0})

const selectDate = (val) => {
    if (!calendar.value) return
    calendar.value.selectDate(val)
}

const getThisMonth=async (date) => {
    console.log(date)
    await listEveryday(date).then(result => {
        monthData.value = result.data
    }).catch(err => {
        console.log(err)
    })
}

onMounted(()=>{
    getThisMonth(getCurrentDate())
})

const datestr=ref()
const questionId=ref()

const todayProblem=(param,id)=>{
    dialogVisible.value=true;
    question.value={id:'',value:0,state:0};
    datestr.value=param;
    questionId.value=id;
}

const updateEveryDay=async(type)=>{
    let param={
        date:datestr.value.day,
        questionId:questionId.value,
    }
    if(type===1){
        param.date=''
    }else{
        param.questionId=question.value.id
    }
    debugger
    await updateEveryday(param).then(result => {
        ElMessage.success(result.msg? result.msg:'更新成功');
        dialogVisible.value=false
        getThisMonth(datestr.value.day)
    }).catch(err => {
        console.log(err)
    })
}

watch(chooseDate, (newVal, oldVal) => {
    if(newVal!==oldVal){
        var year = chooseDate.value.getFullYear();
        var month = chooseDate.value.getMonth() + 1;
        var date=chooseDate.value.getDate()
        if (date >= 1 && date <= 9) {//日如果小于10就补个0
            date = "0" + date;
        }
        if (month >= 1 && month <= 9) {//月如果小于10就补个0
            month = "0" + month;
        }
        const selectDay=year + '-' + month + '-' + date
        getThisMonth(selectDay)
    }
})

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

</script>

<template>
    <el-card class="page-container">
        <el-calendar ref="calendar" class="calender" v-model="chooseDate">
            <template #header="{ date }">
                <span >
                    <img src="@/assets/0x3f.png" style="width: 25px;margin-right: 10px"  alt=""/>
                    <span style="font-size: 25px;font-weight: bold" >灵茶の试炼</span>
                </span>
                <span style="font-weight: bold;font-size: 25px">{{ date }}</span>
                <el-button-group>
                    <el-button size="small" @click="selectDate('prev-year')">
                        上一年
                    </el-button>
                    <el-button size="small" @click="selectDate('prev-month')">
                        上个月
                    </el-button>
                    <el-button size="small" @click="selectDate('today')">
                        今天
                    </el-button>
                    <el-button size="small" @click="selectDate('next-month')">
                        下个月
                    </el-button>
                    <el-button size="small" @click="selectDate('next-year')">
                        下一年
                    </el-button>
                </el-button-group>
            </template>
            <template #date-cell="{ data }" >
                <div v-if="monthData[data.day]" v-on:dblclick="todayProblem(data,monthData[data.day].id)" >
                    <el-tooltip placement="top-start">
                        <template #content>
                            <el-link type="primary" :href="monthData[data.day].link" style="text-decoration: none;color: white" :underline="false" target="_blank">
                                {{monthData[data.day].questionId+'.'+monthData[data.day].name}}
                            </el-link>
                        </template>
                        <p v-if="monthData[data.day].state===2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="2em" height="2em" fill="currentColor" style="color: rgb(45,181,93)"><path fill-rule="evenodd" d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </p>
                        <p v-else>
                            <el-text v-if="monthData[data.day].level===0" type="success" size="large" style="font-weight: bold">
                                {{monthData[data.day].questionId+'.'+monthData[data.day].name}}
                            </el-text>
                            <el-text v-else-if="monthData[data.day].level===1" type="warning" size="large" style="font-weight: bold">
                                {{monthData[data.day].questionId+'.'+monthData[data.day].name}}
                            </el-text>
                            <el-text v-else type="danger" size="large" style="font-weight: bold">
                                {{monthData[data.day].questionId+'.'+monthData[data.day].name}}
                            </el-text>
                        </p>
                    </el-tooltip>
                </div>
                <div v-else>
                    <p :class="data.isSelected ? 'is-selected' : ''" v-on:dblclick="todayProblem(data,0)">
                        {{ data.day.split('-').slice(2).join('-') }}
                    </p>
                </div>
            </template>
        </el-calendar>

        <el-dialog v-model="dialogVisible" title="选择问题" width="30%">
            <el-form  label-width="100px" style="padding-right: 30px">
                <el-form-item label="问题" >
                    <el-select
                        v-model="question"
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
            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="danger" @click="updateEveryDay(1)"> 清除 </el-button>
                        <el-button type="primary" @click="updateEveryDay(2)"> 确认 </el-button>
                    </span>
            </template>
        </el-dialog>
    </el-card>

</template>

<style scoped lang="scss">
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
:deep(.el-calendar-table .el-calendar-day){
    width: 100%;
    height: 65px;
    text-align: center;
    vertical-align: center;
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
