<template>
    <div>
        <span>
            <el-button @click="backChoose()">选择用户</el-button>
        </span>
        <div>
            <!-- 用户信息 -->
        </div>
        <div>
            <!-- 操作 -->
        </div>
        <div>
            <!-- 明细 -->
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userId: ''
    }
  },
  created () {
    this.userId = this.$route.query.userId
  },
  methods: {
    backChoose () {
      this.$router.push('/service/choose')
    }
  }
}
</script>

<style></style>
