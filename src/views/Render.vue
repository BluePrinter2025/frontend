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
                    <img :src="screenShotUrl" alt="模型截图" class="preview-image">
                    <el-row style="margin-top:3%;">
                        <el-col :span="12">
                            <el-text class="mx-1">建筑风格:</el-text>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-input v-model="textarea" style="width:100%;margin-top:3%;"
                                :autosize="{ minRows: 18, maxRows: 18 }" type="textarea"
                                placeholder="请用文字描述想要生成的建筑风格" />
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:7%;">
                        <el-col :offset="14" :span="10">
                            <el-button type="primary" plain style="width:125px;height:35px;"
                                @click="letsRender">渲染</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-aside>
            <el-main class="main">
                <div style="width: 100%;height: calc(100% - 40px);" ref="captureArea">
                    <div class="image-gallery" v-if="isImage">
                        <!-- 左侧大图 -->
                        <div class="main-image">
                            <el-image :src="currentImage" :preview-src-list="images" :initial-index="currentIndex"
                                fit="cover" class="large-image" />
                        </div>

                        <!-- 右侧竖向滚动小图列表 -->
                        <div class="thumbnail-scroll">
                            <div v-for="(img, index) in images" :key="index" class="thumbnail-item"
                                :class="{ 'active': currentIndex === index }" @click="switchImage(index)">
                                <el-image :src="img" fit="cover" class="thumbnail-image" />
                            </div>
                        </div>
                    </div>
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
                <el-col style="width:100%;">
                    <el-row>
                        <el-button type="success" plain @click="downloadImage" class="outputButton">导出</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" plain @click="saveProject" class="nextButton">保存方案</el-button>
                    </el-row>
                </el-col>
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
import { ElNotification } from 'element-plus'
const router = useRouter();
const projectName = ref(null);
const projectId = ref(0);
const screenShotUrl = ref(null);
const textarea = ref('');
const loader = ref(false);
const isImage = ref(false);
onMounted(() => {
    projectName.value = router.currentRoute.value.query.projectName;
    projectId.value = router.currentRoute.value.query.projectId;
    const step = router.currentRoute.value.query.step;
    console.log(step);
    if (step === '1') {
        console.log('TEST!');
        screenShotUrl.value = localStorage.getItem('screenshotData');
        console.log("url" + screenShotUrl.value);
    }
});
const letsRender = () => {
    loader.value = true;
    setTimeout(() => {
        loader.value = false;
        isImage.value = true;
    }, 2500)
};
const images = ref([
    '/pictures/test.jpg',
    '/pictures/chikawa.jpg',
    '/pictures/11.jpg',
    '/pictures/22.jpg',
    '/pictures/33.jpg',
    '/pictures/44.jpg',
])


const currentIndex = ref(0)

const currentImage = ref(images.value[0])

// 切换图片
const switchImage = (index) => {
    currentIndex.value = index
    currentImage.value = images.value[index]
}

const saveProject = () => {
    const routeData = router.resolve({
        path: "/home",
    });
    router.push(routeData.href);
    ElNotification({
        title: '保存方案成功',
        // message: 'This is a success message',
        type: 'success',
    })
};

const downloadImage = () => {
    images.value.forEach((file, index) => {
        const filename = `photo-${index + 1}.jpg`
        setTimeout(() => downloadFile(file, filename), index * 100)
    })
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
</script>

<style scoped>
.outputButton {
    margin-top: 0.2%;
    margin-right: 13%;
    width: 10%;
    font-size: 17px;
    font-weight: bold;
    position: absolute;
    right: 0;
}

.nextButton {
    margin-top: 0.2%;
    margin-right: 1%;
    width: 10%;
    font-size: 17px;
    font-weight: bold;
    position: absolute;
    right: 0;
}

.image-gallery {
    display: flex;
    gap: 20px;
    height: 600px;
    /* 根据需求调整高度 */
}

.main-image {
    flex: 1;
}

.large-image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
}

.thumbnail-scroll {
    width: 120px;
    overflow-y: auto;
    padding-right: 10px;
    overflow-x: hidden;
}

.thumbnail-item {
    width: 100%;
    height: 88px;
    margin-bottom: 10px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 4px;
    transition: all 0.3s;
}

.thumbnail-item:hover {
    border-color: var(--el-color-primary);
}

.thumbnail-item.active {
    border-color: var(--el-color-primary);
    transform: scale(0.95);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
}

/* 自定义滚动条样式 */
.thumbnail-scroll::-webkit-scrollbar {
    width: 6px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color);
    border-radius: 3px;
}

.thumbnail-scroll::-webkit-scrollbar-track {
    background-color: var(--el-fill-color-light);
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

.preview-image {
    max-width: 100%;
    margin-top: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

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