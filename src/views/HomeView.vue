<template>
  <el-container class="all">
    <el-aside class="aside">
      <h2 style="margin-left:20px;">BluePrinter</h2>
      <div style="text-align: center;">
        <button class="custom-button" @click="newProject1">
          新建步骤一
        </button>
        <button class="custom-button button2" @click="newProject2">
          新建步骤二
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
        <el-input v-model="searchText" placeholder="Search in all projects..." class="search-input" clearable />

        <el-table :data="filteredProjects" style="width: 100%"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
          <el-table-column prop="name" label="标题" width="450">
            <template #default="{ row }">
              <div class="title-cell">
                <span class="main-title">{{ row.name }}</span>
                <span class="sub-id">ID: {{ row.id }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="author" label="作者" width="300" />

          <el-table-column label="创建时间" width="300">
            <template #default="{ row }">
              {{ row.time }}
            </template>
          </el-table-column>

          <el-table-column label="Tag" width="173">
            <template #default="{ row }">
              <el-tag v-for="(tag, index) in row.tags" :key="index" size="small">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="newProjectVisible" title="新建方案" width="500">
    <el-input v-model="projectName" style="width: 460px;height:40px;" placeholder="方案名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="newProjectVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProject">
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
const projects = ref([]);

const totalProjects = ref(0);

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

      const authorMatch = (item.author || '')
        .toLowerCase()
        .normalize('NFD')
        .includes(keyword)


      const tagsMatch = (item.tags || [])
        .some(tag =>
          String(tag)
            .toLowerCase()
            .normalize('NFD')
            .includes(keyword)
        )

      return nameMatch || authorMatch || tagsMatch
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

const newProject2 = () => {
  projectName.value = '';
  newProjectVisible.value = true;
  step.value = 2; //步骤一
}

const submitProject = async () => {
  const response = await createNewProject(step.value,projectName.value);
  console.log(response);
  const id=response.data.projectId;
  console.log(id);
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
  fetchData();
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

/* 新建按钮 */
.custom-button {
  background-color: #5bb0ff;
  color: white;
  border: none;
  width: 85%;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 4%;
}

.custom-button:hover {
  background-color: #2877c1;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.button2 {
  background-color: #62e744;
  margin-top: 4%;
}

.button2:hover {
  background-color: #61cd2a;
}
</style>