<template>
  <el-container class="all">
    <el-aside class="aside">
      <h2 style="margin-left:20px;margin-top:30px;">ArchSynth</h2>
      <div style="text-align: center;">
        <button @click="newProject1" class="new-project-button"> 新建项目
        </button>
      </div>
    </el-aside>
    <el-container class="right">
      <el-header class="header">
        <el-button v-if="login" type="primary" plain size="large" style="margin-left: auto;"
          @click="loginButton">登录</el-button>
        <el-icon size="30px" v-else style="margin-left: auto;">
          <UserFilled />
        </el-icon>
      </el-header>
      <el-main class="main">
        <el-input v-model="searchText" placeholder="搜索项目..." class="search-input" clearable />

        <el-row :gutter="20" class="project-grid">
          <el-col v-for="(item, index) in filteredProjects" :key="index" :xs="24" :sm="12" :md="8" class="project-col">
            <el-card class="project-card" shadow="hover" @click="handleCardClick(item)">
              <el-image :src="item.image" fit="cover" class="card-image" />
              <div class="card-content">
                <h3 class="card-title">{{ item.name }}</h3>
                <div class="card-footer">
                  <span class="card-time">{{ item.time }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="newProjectVisible" title="新建方案" width="500">
    <el-input v-model="projectName" style="width: 460px;height:40px;" placeholder="方案名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="newProjectVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProject" class="confirm-button">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { getAllProject, createNewProject } from '../api/api';
const router = useRouter();
const newProjectVisible = ref(false);
const projectName = ref('');
const isLoggin = localStorage.getItem("isLoggin");
const url = ref('');
const step = ref(0); //选用第几步骤
const login = ref(true);
// const projects = ref([]);

const totalProjects = ref(0);


const projects = ref([
  {
    id: 1,
    name: '智慧城市设计方案',
    time: '2024-01-15',
    image: 'https://picsum.photos/300/200?random=1',
  },
  {
    id: 2,
    name: '商业综合体方案',
    time: '2024-02-20',
    image: 'https://picsum.photos/300/200?random=2',
  },
  {
    id: 3,
    name: '生态公园规划',
    time: '2024-03-05',
    image: 'https://picsum.photos/300/200?random=3',
  },
  {
    id: 4,
    name: '智能办公楼方案',
    time: '2024-04-10',
    image: 'https://picsum.photos/300/200?random=4',
  },
  {
    id: 5,
    name: '历史建筑改造',
    time: '2024-05-15',
    image: 'https://picsum.photos/300/200?random=5',
  },
  {
    id: 6,
    name: '未来社区规划',
    time: '2024-06-20',
    image: 'https://picsum.photos/300/200?random=6',
  }
]);


const handleCardClick = (item) => {
  const id = item.id;
  // url.value = router.resolve({
  //   path: "/project",
  //   query: {
  //     projectName: item.name,
  //     projectId: id,
  //   },
  // });
  // window.open(url.value.href, "_blank");
};

const formatTime = (time) => {
  const now = new Date()
  const target = new Date(time)
  const diffDays = Math.floor((now - target) / 86400000)
  return `${diffDays}天前`
}

/* 搜索功能 */
const searchText = ref('')
const filteredProjects = computed(() => {
  if (!searchText.value.trim()) return [...projects.value]

  const keyword = searchText.value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

  return projects.value.filter(item => {
    try {

      const nameMatch = (item.name || '')
        .toLowerCase()
        .normalize('NFD')
        .includes(keyword)

      return nameMatch
    } catch (e) {
      console.error('项目过滤出错:', e)
      return false
    }
  })
})

const newProject1 = () => {
  projectName.value = '';
  newProjectVisible.value = true;
  step.value = 1; //步骤一
}

const submitProject = async () => {
  // const response = await createNewProject(step.value,projectName.value);
  // console.log(response);
  // const id=response.data.projectId;
  // console.log(id);
  const id = 1;
  newProjectVisible.value = false;
  if (step.value === 1) {
    url.value = router.resolve({
      path: "/project",
      query: {
        projectName: projectName.value,
        projectId: id,
      },
    });
    window.open(url.value.href, "_blank");
  } else if (step.value === 2) {
    url.value = router.resolve({
      path: "/render",
      query: {
        projectName: projectName.value,
        projectId: id,
      },
    });
    window.open(url.value.href, "_blank");
  }
}
const loginButton = () => {
  router.push({
    path: "/login",
  });
}
onMounted(() => {
  const isLoggin = localStorage.getItem("isLoggin");
  if (isLoggin === 'true') {
    login.value = false;
  }
  // fetchData();
})
const fetchData = async () => {
  const response = await getAllProject();
  const result = response.data.projects;
  console.log(result);
  const processedArray = result.map(item => {
    item.author = '你';
    item.time = formatTime(item.time);
    item.tags = [item.type];
    return item;
  });
  projects.value = processedArray;
  totalProjects.value = projects.value.length;
}
</script>
<style scoped>
.project-grid {
  margin: -10px;
}

.project-col {
  padding: 5px;
}

.project-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 200px;
  border-radius: 4px 4px 0 0;
}

.card-content {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.card-title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  text-align: center;
}

.card-time {
  font-size: 12px;
  color: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .project-col {
    width: 100%;
  }

  .card-image {
    height: 150px;
  }
}

/* 新增样式 */
.project-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 12px;
  transition: box-shadow 0.3s;
}

.project-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-content {
  min-height: 80px;
  /* 统一高度 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .project-item {
    margin-bottom: 10px;
  }
}

.project-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.search-input {
  margin-bottom: 30px;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.search-input {
  margin-bottom: 20px;
}

.title-cell {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.sub-id {
  font-size: 12px;
  color: #909399;
}

.el-tag {
  margin-right: 5px;
}

.footer {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.showing-info {
  font-size: 14px;
  color: #606266;
}


.all {
  height: 100vh;
  display: flex;
}

.aside {
  width: 15%;
  height: 100%;
  background-color: white;
}

.right {
  width: 85%;
  height: 100%;
  background-color: white;
}

.header {
  width: 100%;
  height: 10%;
  background-color: white;
  display: flex;
  align-items: center;
}

.main {
  background-color: rgb(244, 245, 246);
  height: 90%;
  width: 100%;
  border-radius: 40px 0 0 0;
}

.confirm-button {
  background-color: #cbf1f5;
  border: none;
  color: #000;
}

.new-project-button {
  width: 80%;
  margin-top: 7%;
  background-color: #cbf1f5;
  padding: 1.3em 3em;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  /* background-color: #fff; */
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

.new-project-button:hover {
  background-color: #71c9ce;
  box-shadow: 0px 15px 20px #a6e3e9;
  color: #fff;
  transform: translateY(-7px);
}

.new-project-button:active {
  transform: translateY(-1px);
}
</style>