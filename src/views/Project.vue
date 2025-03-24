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
                    <el-scrollbar height="670px" style="width:102%;">
                        <el-row>
                            <el-col :span="24">
                                <el-upload v-model:file-list="fileList" class="upload-demo" drag multiple :limit="2"
                                    accept=".obj,.mtl" :on-exceed="handleExceed" :auto-upload="false"
                                    :on-change="handleFileChange">
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
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-text class="mx-1">冬至日 日照时长</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="winterSolstice" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">间距系数</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="spreadRatio" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">遥线距离</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="remoteDistance" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">建筑间距</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="buildingInterval" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">单体标准层面积</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="standardArea" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">最高高度</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="maxHeight" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">最高层数</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="maxFloor" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">首层层高</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="firstFloor" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5%;">
                            <el-col :span="12">
                                <el-text class="mx-1">标准层高</el-text>
                            </el-col>
                            <el-col :span="12">
                                <el-input-number v-model="standardFloor" :precision="2" :step="0.01" :max="10" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:7%;">
                            <el-col :span="14">

                            </el-col>
                            <el-col :span="10">
                                <el-button type="primary" plain style="width:125px;height:35px;"
                                    @click="generateObj">生成</el-button>
                            </el-col>
                        </el-row>
                    </el-scrollbar>
                </el-card>
            </el-aside>
            <el-main class="main">
                <!-- obj预览 -->
                <div style="width: 100%;height: calc(100% - 40px);" ref="captureArea">
                    <vue3dLoader v-if="objUrl && mtlUrl" :filePath="objUrl" :mtlPath="mtlUrl" class="scene-container"
                        :crossOrigin="'anonymous'" id="btn1"/>
                </div>
                <el-col v-if="render">
                    <el-button type="success" plain @click="screenShot" class="nextButton" ref="ref1">截屏</el-button>
                </el-col>
                <el-col v-else>
                    <el-row>
                        <el-button type="success" plain @click="complete" class="outputButton">导出</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" plain @click="dialogVisible = true"
                            class="nextButton">保存方案</el-button>
                    </el-row>
                </el-col>
            </el-main>
        </el-container>
    </el-container>
    <el-dialog v-model="dialogVisible" width="500">
        <el-text tag="b">
            <el-icon color="green">
                <SuccessFilled />
            </el-icon>
            项目{{ projectName }}已保存成功:)</el-text>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="returnHome">返回主页</el-button>
                <el-button type="warning" @click="continueToRender">继续渲染</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    继续编辑
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-tour v-model="open">
        <el-tour-step target="#btn1" description="请调整好模型的角度，以便渲染">
        </el-tour-step>
        <el-tour-step :target="ref1?.$el" description="调整好角度后，点击按钮即可进入渲染界面" />
    </el-tour>
    <el-dialog v-model="confirmPhoto" title="请确认截图" width="500">
        <img :src="screenshotUrl" alt="模型截图" class="preview-image">
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="confirmPhoto = false">取消</el-button>
                <el-button type="primary" @click="gotoRender">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import html2canvas from 'html2canvas'
import { useRouter } from "vue-router";
import { UploadFilled } from '@element-plus/icons-vue'
// import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from "element-plus";
import { generateObject } from '../api/api';
import { ElMessageBox } from 'element-plus';
import type { ButtonInstance } from 'element-plus';
const dialogVisible = ref(false)
const fileList = ref([]);
const router = useRouter();
const projectName = ref(null);
const projectId = ref(0);
const file = ref(null);
const winterSolstice = ref(0);  //冬至日
const spreadRatio = ref(0);    //间距系数
const remoteDistance = ref(0);
const buildingInterval = ref(0);
const standardArea = ref(0);
const maxHeight = ref(0);
const maxFloor = ref(0);
const firstFloor = ref(0);
const standardFloor = ref(0);
const objFile = ref(null);
const mtlFile = ref(null);
const generateObjFile = ref(null);
const generateMtlFile = ref(null);
const render = ref(false);
const open = ref(false);
const ref1 = ref<ButtonInstance>();
const objUrl = ref('/models/output_file.obj');
const mtlUrl = ref('/models/material.mtl');
const screenshotUrl = ref(null);
const captureArea = ref(null)
const confirmPhoto=ref(false);
const url = ref('');

const gotoRender= () =>{
    confirmPhoto.value = false;
    localStorage.setItem('screenshotData', screenshotUrl.value);
    // url.value = router.resolve({
    //     path: "/render",
    //     query: {
    //         projectId: projectId.value,
    //         projectName:projectName.value,
    //         step:1,
    //     },
    // });
    // window.open(url.value.href);
    const routeData = router.resolve({
        path: "/render",
        query: {
            projectId: projectId.value,
            projectName: projectName.value,
            step: 1,
        },
    });

    // 使用 router.push 进行跳转
    router.push(routeData.href);
};

const screenShot = async () => {
    try {
        await nextTick() // 确保 DOM 更新完成

        const options = {
            useCORS: true, // 启用跨域资源处理
            logging: false, // 关闭日志
            scale: 1, // 控制截图分辨率
            windowWidth: captureArea.value.scrollWidth,
            windowHeight: captureArea.value.scrollHeight,
            x: captureArea.value.offsetLeft,
            y: captureArea.value.offsetTop,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            onclone: (clonedDoc) => {
                // 处理克隆文档中的样式
                clonedDoc.querySelector('.scene-container').style.visibility = 'visible'
            }
        }

        // const canvas = await html2canvas(captureArea.value, options)

        // 转换为高质量 PNG
        // screenshotUrl.value = canvas.toDataURL('image/png', 1.0);
        const elementToCapture = document.body; // 截取整个页面
        const canvas = await html2canvas(elementToCapture);
        const screenshot = canvas.toDataURL('image/png');
        screenshotUrl.value= screenshot;
        confirmPhoto.value=true;
    } catch (error) {
        console.error('截图失败:', error)
    }
}

const handleFileChange = async (file: UploadUserFile, files: UploadUserFile[]) => {
    console.log('上传的文件列表:', files);
    const objCount = files.filter(f => f.name.endsWith('.obj')).length;
    const mtlCount = files.filter(f => f.name.endsWith('.mtl')).length;

    if (objCount > 1 || mtlCount > 1) {
        ElMessage.error('只能上传一个 .obj 文件和一个 .mtl 文件');
        return;
    }

    if (objCount === 1 && mtlCount === 1) {
        objFile.value = files.find(f => f.name.endsWith('.obj'));
        mtlFile.value = files.find(f => f.name.endsWith('.mtl'));
        try {
            try {
                const objFile = files.find(f => f.name.endsWith('.obj'));
                const mtlFile = files.find(f => f.name.endsWith('.mtl'));
                const objReader = new FileReader();
                const mtlReader = new FileReader();

                objReader.onload = (e) => {
                    objUrl.value = e.target.result;
                };

                mtlReader.onload = (e) => {
                    mtlUrl.value = e.target.result;
                };

                objReader.readAsDataURL(objFile.raw);
                mtlReader.readAsDataURL(mtlFile.raw);
            } catch (error) {
                console.error('模型加载失败:', error);
                ElMessage.error('模型加载失败: ' + error);
            }
        } catch (error) {
            console.error('模型加载失败:', error);
        }
    }
};

const handleExceed = (files, fileList) => {
    ElMessage.warning('只能上传一个 .obj 文件和一个 .mtl 文件');
};


const generateObj = async () => {
    const response = await generateObject(winterSolstice.value, spreadRatio.value, remoteDistance.value, buildingInterval.value, standardArea.value, maxHeight.value, maxFloor.value, firstFloor.value, standardFloor.value, objFile.value, mtlFile.value, projectId.value);
    generateObjFile.value = response.data.objFile;
    generateMtlFile.value = response.data.mtlFile;
};
const complete = () => {
    try {
        const objUrl = URL.createObjectURL(generateObjFile.value)
        const mtlUrl = URL.createObjectURL(generateMtlFile.value)

        const downloadLink = document.createElement('a')
        downloadLink.style.display = 'none'


        downloadLink.href = objUrl
        downloadLink.download = 'model.obj'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(objUrl)

        setTimeout(() => {
            downloadLink.href = mtlUrl
            downloadLink.download = 'material.mtl'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            URL.revokeObjectURL(mtlUrl)
        }, 500)

    } catch (error) {
        console.error('文件下载失败:', error)
        ElMessage.error('文件下载失败')
    }
};

const returnHome = () => {
    router.push("/home");
};

const continueToRender = () => {
    dialogVisible.value = false;
    render.value=true;
    open.value=true;
};

onMounted(() => {
    projectName.value = router.currentRoute.value.query.projectName;
    projectId.value = router.currentRoute.value.query.projectId;
});


</script>

<style scoped>
.preview-image {
    max-width: 100%;
    margin-top: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
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

.scene-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.scene-container canvas {
    width: 100% !important;
    height: 100% !important;
}

.outputButton {
    margin-top: 1.3%;
    margin-right: 10%;
    width: 8%;
    font-size: 15px;
    font-weight: bold;
    position: absolute;
    right: 0;
}

.nextButton {
    margin-top: 1.3%;
    margin-right: 1%;
    width: 8%;
    font-size: 15px;
    font-weight: bold;
    position: absolute;
    right: 0;
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