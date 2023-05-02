<template>
  <div>
    <div>
      <div>
        <p>Count: {{ count }}</p>
        <button @click="increment">Increment</button>
      </div>
      <!-- <div>
        <img v-if="showImg" src="https://www.itheima.com/images/logo.png"> -->
        <!-- <img v-if="showImg" src="http://localhost:8088/api/alipay/pay?money=${money}"> -->
      <!-- </div> -->
      <!-- <img :src="getImgUrl()" v-if="showImg" alt="fail"> -->
      <!-- <span>{{ val1 }}-{{ val2 }}-{{ val3 }}-{{ val4 }}-{{ list }} </span> -->
      <!-- <el-button @click="showImgF()">开关</el-button> -->
      <!-- <a href="http://localhost:8088/api/alipay/pay">支付/a> -->
      <!-- <a href="../pay/index">W3School</a> -->
    </div>
    <!-- <div class="top">
      <div class="left">
        get
        <el-button @click="get1()">默认按钮</el-button>
        <el-button @click="get2()">默认按钮</el-button>
        <el-button @click="get3()">默认按钮</el-button>
        <el-button @click="get4()">默认按钮</el-button>
        <el-button @click="get5()">默认按钮</el-button>
        <el-button @click="get6()">默认按钮</el-button>
      </div>
      <div class="right">
        post
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        del
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
      </div>
      <div class="right">
        put
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button>默认按钮</el-button>
      </div>
    </div> -->
  </div>
</template>
<script>
import Qs from 'qs'
// import mystore from '../store'
import axios from '../utils/request'
export default {
  data () {
    return {
      money: 12,
      showImg: false,
      val1: 1,
      val2: true,
      val3: 1.3,
      val4: 'val4',
      list: [{
        val1: 1,
        val2: true,
        val3: 1.3,
        val4: 'val4'
      }, {
        val1: 1,
        val2: true,
        val3: 1.3,
        val4: 'val4'
      }, {
        val1: 1,
        val2: true,
        val3: 1.3,
        val4: 'val4'
      }],
      img: 19
    }
  },
  computed: {
    count () {
      // const carts = this.$store.getters.getUser.shoppingCarts
      var s = 'k'
      // console.log(carts)
      // if (this.$store.getters.getUser.shoppingCarts.size > 0) {
      //   carts.forEach((value, key) => {
      //     s += key + '|' + value
      //   })
      // }
      return s
    }
  },
  methods: {
    increment () {
      // this.$store.dispatch('asyncAddShoppingCarts', 1)
    },
    getImgUrl () { return 'http://localhost:8088/api/alipay/pay?money=' + this.img },
    showImgF () {
      this.showImg = !this.showImg
    },
    get1 () {
      console.log('get1')
      console.log(this.val1)
      axios({
        method: 'get',
        url: '/admin/mode/get1',
        params: {
          val1: this.var1
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    get2 () {
      console.log('get2')
      console.log(this.val2)
      axios({
        method: 'get',
        url: '/admin/mode/get2',
        params: {
          val2: Qs.stringify(this.var2)
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    get3 () {
      console.log('get3')
      console.log(this.val3)
      axios({
        method: 'get',
        url: '/admin/mode/get3',
        params: {
          val3: this.var3
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    get4 () {
      console.log('get4')
      console.log(this.val4)
      axios({
        method: 'get',
        url: '/admin/mode/get4',
        params: {
          val4: this.var4
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    get5 () {
      console.log('get5')
      axios({
        method: 'get',
        url: '/admin/mode/get5',
        params: {
          modeEntity: this.list[0]
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    get6 () {
      console.log('get6')
      axios({
        method: 'get',
        url: '/admin/mode/get6',
        params: {
          modeEntity: this.list
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    }
  }
}
</script>
<style>
.top {
  border: 1px solid red;
  display: flex;
  height: 50vh;
  flex-direction: row;
}

.bottom {
  height: 50vh;
  display: flex;
  flex-direction: row;
  border: 1px solid green;
}

.left {
  border: 1px solid rebeccapurple;
  flex: 1;
}

.right {
  border: 1px solid yellow;
  flex: 1;
}
</style>
