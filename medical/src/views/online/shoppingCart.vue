<template>
  <div>
    <el-row style="height: 100vh;">
      <el-col :span="12" style="background-color: aqua;">

      </el-col>
      <el-col :span="12" style="background-color: blanchedalmond;">

      </el-col>
    </el-row>

    <div class="left">

    </div>
  </div>
</template>

<script>
// import Qs from 'qs'
import mystore from '../../store'
// import axios from '../../utils/request'
export default {
  data () {
    return {
      storeId: '',
      userId: mystore.state.user.userId,
      showStoreList: ''
    }
  },
  created () {
    this.storeId = this.$route.query.storeId
    // 判断是从那边打开
    if (typeof this.storeId !== 'undefined' && this.storeId) {
      console.log('店铺进入')
    } else {
      console.log('外部进入')
    }
  },
  methods: {

  }
}
</script>

<style></style>
