<template>
  <div>
    <button @click="pay">支付</button>
    <p>Code:</p>
    <div :v-html="innerHtml"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      innerHtml: ''
    }
  },
  created () {
    this.innerHtml = this.$route.params.code
  },
  methods: {
    pay () {
      axios.post('/api/pay', {
        // 传递支付信息，如订单号、支付金额等
        outTradeNo: '20220413001',
        totalAmount: 1.00,
        subject: '测试订单',
        body: '这是一个测试订单',
        returnUrl: 'http://xjhwx6.natappfree.cc',
        notifyUrl: 'http://xjhwx6.natappfree.cc/api/alipay/notify'
      }).then(response => {
        // 支付请求提交成功后跳转到支付宝支付页面
        window.location.href = response.data
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
