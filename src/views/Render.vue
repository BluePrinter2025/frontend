<template>
    <el-container class="all">
        <el-header class="head">
            <h2>BluePrinter</h2>
            <h3>{{ projectName }}</h3>
            <el-icon size="30px">
                <UserFilled />
            </el-icon>
        </el-header>
        <el-container class="bottom">
            <el-aside class="side">
                <el-card class="firstStep">
                    <el-upload v-model:file-list="fileList" class="upload-demo" drag multiple :limit="1" accept=".obj"
                        :on-exceed="handleExceed" :auto-upload="false" :on-change="handleFileChange">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            拖拽或 <em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip" style="text-align: center;">
                                文件后缀为.obj且不大于20MB。
                            </div>
                        </template>
                    </el-upload>
                    <el-row>
                        <el-col :span="12">
                            <el-text class="mx-1">建筑风格</el-text>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            
                        </el-col>
                    </el-row>
                </el-card>
            </el-aside>
            <el-main class="main">
                <!-- obj预览 -->

            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from "element-plus";
const router = useRouter();
const projectName = ref(null);
const projectId = ref(0);
const screenShotUrl=ref(null);
const file = ref(null);

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
    file.value = uploadFile;
    console.log(file.value);
}
const handleExceed: UploadProps['onExceed'] = () => {
    ElMessage.warning('每次只能上传一个文件')
}
const generateObj = () => {

};
onMounted(() => {
    projectName.value = router.currentRoute.value.query.projectName;
    projectId.value = router.currentRoute.value.query.projectId;
    const step = router.currentRoute.value.query.step;
    if(step===1){
        screenShotUrl.value == localStorage.getItem('screenshotData');
    }
});
</script>

<style scoped>
.all {
    height: 100vh;
}

.head {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bottom {
    height: 90%;
    width: 100%;
}

.side {
    width: 25%;
    height: 100%;

}

.main {
    height: 100%;
    width: 75%;
    background-color: rgb(244, 245, 246);
    border-radius: 40px 0 0 0;
}

.firstStep {
    margin-top: 2%;
    width: 90%;
    height: 98%;
    margin-left: 5%;
    border-radius: 10px;
}
</style>