<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalUsers }}</div>
            <div class="trend">
              <span :class="{ 'up': stats.userGrowth > 0, 'down': stats.userGrowth < 0 }">
                {{ stats.userGrowth > 0 ? '+' : '' }}{{ stats.userGrowth }}%
              </span>
              较上月
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总课程数</span>
              <el-icon><VideoPlay /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalCourses }}</div>
            <div class="trend">
              <span :class="{ 'up': stats.courseGrowth > 0, 'down': stats.courseGrowth < 0 }">
                {{ stats.courseGrowth > 0 ? '+' : '' }}{{ stats.courseGrowth }}%
              </span>
              较上月
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
              <el-icon><ShoppingCart /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalOrders }}</div>
            <div class="trend">
              <span :class="{ 'up': stats.orderGrowth > 0, 'down': stats.orderGrowth < 0 }">
                {{ stats.orderGrowth > 0 ? '+' : '' }}{{ stats.orderGrowth }}%
              </span>
              较上月
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总收入</span>
              <el-icon><Money /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">¥{{ stats.totalIncome }}</div>
            <div class="trend">
              <span :class="{ 'up': stats.incomeGrowth > 0, 'down': stats.incomeGrowth < 0 }">
                {{ stats.incomeGrowth > 0 ? '+' : '' }}{{ stats.incomeGrowth }}%
              </span>
              较上月
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>收入趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder">收入趋势图表</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder">用户分布图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="table-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新订单</span>
              <el-button type="primary" link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="title" label="课程名称" />
            <el-table-column prop="price" label="金额" width="100">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新用户</span>
              <el-button type="primary" link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="{ row }">
                <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
                  {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, VideoPlay, ShoppingCart, Money } from '@element-plus/icons-vue'
import { getDashboardStats } from '@/api/admin'

// 统计数据
const stats = ref({
  totalUsers: 0,
  userGrowth: 0,
  totalCourses: 0,
  courseGrowth: 0,
  totalOrders: 0,
  orderGrowth: 0,
  totalIncome: 0,
  incomeGrowth: 0
})

// 最新订单
const latestOrders = ref([
  {
    orderNo: '202403150001',
    title: 'Vue.js 高级特性实战',
    price: 299,
    createTime: '2024-03-15 10:00:00'
  },
  {
    orderNo: '202403150002',
    title: 'React Hooks 完全指南',
    price: 199,
    createTime: '2024-03-15 11:00:00'
  }
])

// 最新用户
const latestUsers = ref([
  {
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    createTime: '2024-03-15 10:00:00'
  },
  {
    username: 'admin1',
    email: 'admin1@example.com',
    role: 'admin',
    createTime: '2024-03-15 11:00:00'
  }
])

// 加载统计数据
const loadStats = async () => {
  try {
    // 临时使用模拟数据
    stats.value = {
      totalUsers: 1000,
      totalCourses: 50,
      totalOrders: 2000,
      totalRevenue: 50000,
      todayNewUsers: 10,
      todayNewOrders: 20,
      todayRevenue: 1000
    }
    
    // TODO: 实现真实 API 调用
    // const { data } = await getDashboardStats()
    // stats.value = data
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-content {
    text-align: center;
    padding: 20px 0;

    .number {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 10px;
    }

    .trend {
      font-size: 14px;
      color: #909399;

      .up {
        color: #67C23A;
      }

      .down {
        color: #F56C6C;
      }
    }
  }
}

.chart-row {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
}

.chart-placeholder {
  color: #909399;
  font-size: 14px;
}

.table-row {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 