<template>
  <div class="vip-page">
    <div class="vip-header">
      <h1>VIP会员</h1>
      <p class="subtitle">解锁更多优质课程和特权</p>
    </div>

    <div class="vip-plans">
      <div
        v-for="plan in vipPlans"
        :key="plan.id"
        class="plan-card"
        :class="{ 'is-recommended': plan.recommended }"
      >
        <div class="plan-header">
          <h2>{{ plan.name }}</h2>
          <div class="plan-price">
            <span class="price">¥{{ plan.price }}</span>
            <span class="period">/{{ plan.period }}</span>
          </div>
        </div>
        <div class="plan-features">
          <div class="feature-item" v-for="feature in plan.features" :key="feature">
            <el-icon><Check /></el-icon>
            <span>{{ feature }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          size="large"
          :class="{ 'is-recommended': plan.recommended }"
          @click="handleSubscribe(plan)"
        >
          {{ plan.recommended ? '立即开通' : '选择套餐' }}
        </el-button>
      </div>
    </div>

    <div class="vip-benefits">
      <h2>会员特权</h2>
      <div class="benefits-grid">
        <div class="benefit-item" v-for="benefit in vipBenefits" :key="benefit.title">
          <div class="benefit-icon">
            <el-icon :size="32">
              <component :is="benefit.icon" />
            </el-icon>
          </div>
          <h3>{{ benefit.title }}</h3>
          <p>{{ benefit.description }}</p>
        </div>
      </div>
    </div>

    <div class="vip-faq">
      <h2>常见问题</h2>
      <el-collapse>
        <el-collapse-item
          v-for="faq in faqs"
          :key="faq.question"
          :title="faq.question"
        >
          <p>{{ faq.answer }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Check,
  VideoPlay,
  Download,
  ChatDotRound,
  Star,
  Tickets,
  Service
} from '@element-plus/icons-vue'

const vipPlans = ref([
  {
    id: 1,
    name: '月度会员',
    price: 29,
    period: '月',
    features: [
      '无限观看所有课程',
      '无限观看直播回放',
      '专属客服支持',
      '课程资料下载'
    ]
  },
  {
    id: 2,
    name: '年度会员',
    price: 299,
    period: '年',
    recommended: true,
    features: [
      '无限观看所有课程',
      '无限观看直播回放',
      '专属客服支持',
      '课程资料下载',
      '优先参与直播互动',
      '专属学习群'
    ]
  },
  {
    id: 3,
    name: '终身会员',
    price: 999,
    period: '终身',
    features: [
      '无限观看所有课程',
      '无限观看直播回放',
      '专属客服支持',
      '课程资料下载',
      '优先参与直播互动',
      '专属学习群',
      '终身免费更新'
    ]
  }
])

const vipBenefits = ref([
  {
    icon: 'VideoPlay',
    title: '无限观看',
    description: '解锁平台所有课程和直播回放，随时随地学习'
  },
  {
    icon: 'Download',
    title: '资料下载',
    description: '下载课程配套资料，方便离线学习'
  },
  {
    icon: 'ChatDotRound',
    title: '专属客服',
    description: '享受7*24小时专属客服支持'
  },
  {
    icon: 'Star',
    title: '优先参与',
    description: '优先参与直播互动，与讲师面对面交流'
  },
  {
    icon: 'Tickets',
    title: '专属社群',
    description: '加入VIP学习群，与志同道合的伙伴共同进步'
  },
  {
    icon: 'Service',
    title: '终身更新',
    description: '终身会员可享受平台所有课程更新'
  }
])

const faqs = ref([
  {
    question: '如何开通VIP会员？',
    answer: '您可以选择任意会员套餐，点击"立即开通"按钮，完成支付即可开通会员。'
  },
  {
    question: '会员可以退款吗？',
    answer: '会员开通后不支持退款，请谨慎选择。如有特殊情况，请联系客服处理。'
  },
  {
    question: '会员到期后如何续费？',
    answer: '会员到期前7天，系统会自动提醒续费。您也可以在会员中心手动续费。'
  },
  {
    question: '会员可以同时登录多个设备吗？',
    answer: '同一账号最多支持2个设备同时在线观看，超出限制将被强制下线。'
  }
])

const handleSubscribe = (plan) => {
  // TODO: 实现订阅逻辑
  console.log('订阅套餐:', plan)
}
</script>

<style scoped>
.vip-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.vip-header {
  text-align: center;
  margin-bottom: 48px;
}

.vip-header h1 {
  font-size: 36px;
  color: #303133;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: #606266;
}

.vip-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.plan-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card.is-recommended {
  border: 2px solid #409EFF;
  position: relative;
}

.plan-card.is-recommended::before {
  content: '推荐';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #409EFF;
  color: #fff;
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
}

.plan-header {
  margin-bottom: 24px;
}

.plan-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 16px;
}

.plan-price {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
}

.plan-price .price {
  font-size: 36px;
  color: #F56C6C;
  font-weight: bold;
}

.plan-price .period {
  font-size: 16px;
  color: #909399;
}

.plan-features {
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #606266;
}

.feature-item .el-icon {
  color: #67C23A;
}

.vip-benefits {
  margin-bottom: 48px;
}

.vip-benefits h2 {
  text-align: center;
  font-size: 28px;
  color: #303133;
  margin-bottom: 32px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.benefit-item {
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  border-radius: 50%;
  color: #409EFF;
}

.benefit-item h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 8px;
}

.benefit-item p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.vip-faq {
  max-width: 800px;
  margin: 0 auto;
}

.vip-faq h2 {
  text-align: center;
  font-size: 28px;
  color: #303133;
  margin-bottom: 32px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  color: #303133;
}

:deep(.el-collapse-item__content) {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style> 