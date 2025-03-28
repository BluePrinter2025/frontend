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
                                <el-text class="mx-1">退线距离</el-text>
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
                        :crossOrigin="'anonymous'" id="btn1" :lights="lights" :key="componentKey" ref="threeScene"
                        :renderer-options="{ preserveDrawingBuffer: true }" @init="onSceneInit" />
                    <div v-if="loader"
                        style="width:100%;height:100%;display: flex;justify-content: center;align-items: center;">
                        <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
                            <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330"
                                stroke-linecap="round"></circle>
                            <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110"
                                stroke-linecap="round"></circle>
                            <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
                            <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
                        </svg>
                    </div>
                </div>
                <el-col v-if="render">
                    <el-button type="success" plain @click="screenShot" class="nextButton" ref="ref1">截屏</el-button>
                </el-col>
                <el-col v-else>
                    <el-row>
                        <el-text size="large" v-if="objUrl && mtlUrl" style=" margin-top: 1.3%;position: absolute;"
                            class="containtext">容积率:2.8</el-text>
                    </el-row>
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
const loader = ref(false);
const objUrl = ref('');
const mtlUrl = ref('');
const sigUrl = ref('')
const screenshotUrl = ref(null);
const captureArea = ref(null)
const confirmPhoto = ref(false);
const url = ref('');
const lights = ref();
const componentKey = ref(0);
const threeScene = ref(null);
lights.value = [
    {
        type: "AmbientLight",
        color: "white",
        intensity: 0.8,
    },
    {
        type: "DirectionalLight",
        position: { x: 100, y: 10, z: 100 },
        color: "white",
        intensity: 1.2,
    },
    {
        type: "PointLight",
        color: "#cccccc",
        position: { x: 200, y: -200, z: 100 },
        intensity: 1.2,
    },
    {
        type: "HemisphereLight",
        skyColor: "white",
        groundColor: "#cccccc",
        position: { x: 200, y: -200, z: 100 },
        intensity: 1,
    },
];
const gotoRender = () => {
    confirmPhoto.value = false;
    localStorage.setItem('screenshotData', screenshotUrl.value);
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
let renderer = null;

const onSceneInit = (event) => {
    renderer = event.renderer;
    console.log("渲染器已初始化:", renderer);
};
const screenShot = async () => {
    //等待下一帧渲染完成，成功了啊啊啊啊
    requestAnimationFrame(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            console.error("Canvas 未找到！");
            return;
        }
        const dataURL = canvas.toDataURL('image/png');
        screenshotUrl.value = dataURL;
        confirmPhoto.value = true;
    });
};

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


                loader.value = true;
                setTimeout(() => {
                    loader.value = false;
                    objUrl.value = '/models/测试_清理版.obj';
                    mtlUrl.value = '/models/测试_清理版.mtl';
                }, 1500);

                // componentKey.value += 1;

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
    try {
        loader.value = true;
        
        // 1. 调用接口生成文件
        const response = await generateObject(
            winterSolstice.value,
            spreadRatio.value,
            remoteDistance.value,
            buildingInterval.value,
            standardArea.value,
            maxHeight.value,
            maxFloor.value,
            firstFloor.value,
            standardFloor.value,
            objFile.value,
            mtlFile.value,
            projectId.value
        );

        // 3. 动态加载模型，这两个是包含周边建筑的模型文件
        objUrl.value = `http://127.0.0.1:5000${response.data.objFile}`; 
        mtlUrl.value = `http://127.0.0.1:5000/${response.data.mtlFile}`;
        //TODO 切换到不显示周边建筑：注意这里不加载mtl文件，需要修改前面的vue代码
        //这个是读取文件：
        //sigUrl.value = `http://127.0.0.1:5000/${response.data.sigFile}`;

        // 4. 强制重新渲染组件（如果需要）
        componentKey.value += 1;

    } catch (error) {
        console.error("生成模型失败:", error);
    } finally {
        loader.value = false;
    }

};
const complete = () => {
    // try {
    //     const objUrl = URL.createObjectURL(generateObjFile.value)
    //     const mtlUrl = URL.createObjectURL(generateMtlFile.value)

    //     const downloadLink = document.createElement('a')
    //     downloadLink.style.display = 'none'


    //     downloadLink.href = objUrl
    //     downloadLink.download = 'model.obj'
    //     document.body.appendChild(downloadLink)
    //     downloadLink.click()
    //     document.body.removeChild(downloadLink)
    //     URL.revokeObjectURL(objUrl)

    //     setTimeout(() => {
    //         downloadLink.href = mtlUrl
    //         downloadLink.download = 'material.mtl'
    //         document.body.appendChild(downloadLink)
    //         downloadLink.click()
    //         document.body.removeChild(downloadLink)
    //         URL.revokeObjectURL(mtlUrl)
    //     }, 500)

    // } catch (error) {
    //     console.error('文件下载失败:', error)
    //     ElMessage.error('文件下载失败')
    // }
    const urlList = ['/models/material.mtl', '/models/material.mtl'];
    setTimeout(() => downloadFile(urlList[0], 'output_file.obj'), 100);
    setTimeout(() => downloadFile(urlList[1], 'material.mtl'), 100);
};

const downloadFile = (url, filename) => {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
};

const returnHome = () => {
    router.push("/home");
};

const continueToRender = () => {
    dialogVisible.value = false;
    render.value = true;
    open.value = true;
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

.containtext {
    padding-top: 40px;
    margin-right: 10%;
    width: 8%;
    font-size: 17px;
    font-weight: bold;
    position: absolute;
    left: 0;
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

/* From Uiverse.io by Nawsome */
.pl {
    width: 6em;
    height: 6em;
}

.pl__ring {
    animation: ringA 2s linear infinite;
}

.pl__ring--a {
    stroke: #f42f25;
}

.pl__ring--b {
    animation-name: ringB;
    stroke: #f49725;
}

.pl__ring--c {
    animation-name: ringC;
    stroke: #255ff4;
}

.pl__ring--d {
    animation-name: ringD;
    stroke: #f42582;
}

/* Animations */
@keyframes ringA {

    from,
    4% {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -330;
    }

    12% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -335;
    }

    32% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -595;
    }

    40%,
    54% {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -660;
    }

    62% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -665;
    }

    82% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -925;
    }

    90%,
    to {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -990;
    }
}

@keyframes ringB {

    from,
    12% {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -110;
    }

    20% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -115;
    }

    40% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -195;
    }

    48%,
    62% {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    70% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    90% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -305;
    }

    98%,
    to {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -330;
    }
}

@keyframes ringC {
    from {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: 0;
    }

    8% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -5;
    }

    28% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -175;
    }

    36%,
    58% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    66% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    86% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -395;
    }

    94%,
    to {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -440;
    }
}

@keyframes ringD {

    from,
    8% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: 0;
    }

    16% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -5;
    }

    36% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -175;
    }

    44%,
    50% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    58% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    78% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -395;
    }

    86%,
    to {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -440;
    }
}
</style>