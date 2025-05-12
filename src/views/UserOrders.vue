<template>
  <div class="user-orders">
    <h1>我的订单</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部订单" name="all">
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="title" label="课程名称" />
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'pending'" 
                type="primary" 
                link
                @click="handlePay(row)"
              >
                去支付
              </el-button>
              <el-button 
                v-if="row.status === 'paid'" 
                type="success" 
                link
                @click="handleView(row)"
              >
                查看课程
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="待支付" name="pending">
        <el-table :data="pendingOrders" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="title" label="课程名称" />
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click="handlePay(row)">
                去支付
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已支付" name="paid">
        <el-table :data="paidOrders" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="title" label="课程名称" />
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="success" link @click="handleView(row)">
                查看课程
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('all')

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: '202403150001',
    title: 'Vue.js 高级特性实战',
    price: 299,
    status: 'paid',
    createTime: '2024-03-15 10:00:00',
    payTime: '2024-03-15 10:05:00'
  },
  {
    id: 2,
    orderNo: '202403150002',
    title: 'React Hooks 完全指南',
    price: 199,
    status: 'pending',
    createTime: '2024-03-15 11:00:00'
  },
  {
    id: 3,
    orderNo: '202403150003',
    title: 'Node.js 性能优化实战',
    price: 399,
    status: 'paid',
    createTime: '2024-03-15 12:00:00',
    payTime: '2024-03-15 12:10:00'
  }
])

// 根据状态筛选订单
const pendingOrders = computed(() => 
  orders.value.filter(order => order.status === 'pending')
)

const paidOrders = computed(() => 
  orders.value.filter(order => order.status === 'paid')
)

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'info'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消'
  }
  return texts[status] || status
}

// 处理支付
const handlePay = (order) => {
  ElMessage.success('跳转到支付页面...')
  // TODO: 实现支付逻辑
}

// 查看课程
const handleView = (order) => {
  router.push(`/courses/${order.id}`)
}
</script>

<style scoped>
.user-orders {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-orders h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

:deep(.el-tabs__nav) {
  margin-bottom: 20px;
}

:deep(.el-table) {
  margin-top: 20px;
}
</style> 