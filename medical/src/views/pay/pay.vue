<template>
  <div>
    <div class="main">
      <div class="desc" />
      <div class="content">
        <div class="box">
          <div class="left">
            <span style="color: red">*&nbsp;</span>
            <span>订单号</span>
          </div>
          <div class="right">
            <input v-model="payInfo.outTradeNo" size="small" placeholder="订单号..." />
          </div>
        </div>
        <div class="box">
          <div class="left">
            <span style="color: red">*&nbsp;</span>
            <span>商品名称</span>
          </div>
          <div class="right">
            <input v-model="payInfo.subject" size="small" placeholder="商品名称..." />
          </div>
        </div>
        <div class="box">
          <div class="left">
            <span style="color: red">*&nbsp;</span>
            <span>商品价格</span>
          </div>
          <div class="right">
            <input v-model="payInfo.totalAmount" size="small" placeholder="1-99之间" />
          </div>
        </div>
        <div class="box">
          <div class="left">
            <span style="color: red">*&nbsp;</span>
            <span>商品描述</span>
          </div>
          <div class="right">
            <input v-model="payInfo.description" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
              placeholder="请输入内容" maxlength="200" show-word-limit />
          </div>
        </div>
        <div style="margin-top: 20px; left: 85px">
          <button style="background-color: #536976; color: white" @click="submit">
            去支付
          </button>
          <button style="background-color: #536976; color: white" @click="testbtn">
            测试
          </button>
          <button style="background-color: #536976; color: white" @click="testbtn2">
            测试2(成功)
          </button>
          <button style="background-color: #536976; color: white" @click="testbtn3">
            测试3
          </button>
          <button style="background-color: #536976; color: white" @click="testbtn4">
            测试4
          </button>
          <button style="background-color: #536976; color: white" @click="testbtn5">
            测试5(成功)
          </button>
        </div>
      </div>
    </div>
    <div class="payMode">

    </div>
    <!-- <div v-if="showData">
      <data-display :data="modalContent" />
    </div> -->
    <!-- <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span></span>
      <form class="modal-content" v-if="dialogVisible" v-html="modalContent"></form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      payInfo: {
        outTradeNo: '',
        subject: '',
        totalAmount: 1,
        description: '',
        dialogVisible: false,
        modalContent: '<div>1</div>',
        showData: false
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    testbtn () {
      axios
        .get(
          // 也可以设置为自己的主机名加端口号
          'http://localhost:8087/api/juejing'
        )
        .then((resp) => {
          // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
          console.log('resp:', resp)
          const divForm = document.getElementsByTagName('div')
          console.log('divForm:', divForm)
          if (divForm.length) {
            console.log('divForm.length:', divForm.length)
            document.body.removeChild(divForm[0])
          }
          const div = document.createElement('div')
          div.innerHTML = resp.data // data就是接口返回的form 表单字符串

          console.log('div:', div)
          document.body.appendChild(div)

          console.log('document:', document)
          const form = document.forms[0]
          if (form) {
            // 新开窗口跳转
            form.setAttribute('target', '_blank')
            form.submit()
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    },
    testbtn2 () {
      axios
        .get(
          // 也可以设置为自己的主机名加端口号
          'http://localhost:8088/api/alipay/ali'
        )
        .then((resp) => {
          // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
          console.log('resp:', resp)
          const divForm = document.getElementsByTagName('div')
          console.log('divForm:', divForm)
          if (divForm.length) {
            console.log('divForm.length:', divForm.length)
            document.body.removeChild(divForm[0])
          }
          const div = document.createElement('div')
          div.innerHTML = resp.data.data.body // data就是接口返回的form 表单字符串

          console.log('div:', div)
          document.body.appendChild(div)

          console.log('document:', document)
          const form = document.forms[0]
          if (form) {
            form.setAttribute('target', '_blank')
            form.submit()
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    },
    testbtn3 () {
      axios
        .get(
          'http://localhost:8088/api/alipay/ali'
        )
        .then((resp) => {
          console.log(resp.data) // 调试语句，用于检查API响应
          const newWindow = window.open('about:blank', '_blank')
          const div = newWindow.document.createElement('div')
          div.innerHTML = resp.data.data.body
          console.log(div.innerHTML) // 调试语句，用于检查HTML代码是否正确插入到div元素中
          newWindow.document.body.appendChild(div)
          newWindow.document.close() // 关闭新窗口的文档流，确保HTML代码正确显示
        })
        .catch((error) => {
          console.log(error) // 调试语句，用于检查是否有任何错误发生
        })
    },
    async testbtn4 () {
      try {
        const response = await axios.get('http://localhost:8088/api/alipay/ali')
        console.log('response:', response)
        const data = response.data.data.body
        this.modalContent = data
        this.showData = true
        // this.$router.push({ name: 'paytest', params: { code: data } })
      } catch (error) {
        console.error(error)
      }
    },
    testbtn5 () {
      axios
        .get(
          // 也可以设置为自己的主机名加端口号
          'http://localhost:8088/api/alipay/ali'
        )
        .then((resp) => {
          // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
          console.log('resp:', resp)
          const divForm = document.querySelector('.payMode')
          console.log('divForm:', divForm)
          if (divForm.length) {
            console.log('divForm.length:', divForm.length)
            document.body.removeChild(divForm[0])
          }
          // const div = document.createElement('div')

          // const newDoc = document.implementation.createHTMLDocument()
          // const div = newDoc.createElement('div')
          divForm.innerHTML = resp.data.data.body
          // div.innerHTML = resp.data.data.body // data就是接口返回的form 表单字符串

          // console.log('div:', div)
          // document.body.appendChild(div)
          // document.body.appendChild(resp.data.data.body)
          console.log('document:', document)
          const form = document.forms[0]
          console.log('form', form)
          if (form) {
            form.setAttribute('target', '_blank')
            form.submit()
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    },
    submit () {
      axios
        .post(
          // 也可以设置为自己的主机名加端口号
          'http://localhost:8088/api/alipay/pay?outTradeNo=' +
          this.payInfo.outTradeNo +
          '&subject=' +
          this.payInfo.subject +
          '&totalAmount=' +
          this.payInfo.totalAmount +
          '&description=' +
          this.payInfo.description
          //   `api/alipay/pay?outTradeNo=` +
          //             this.payInfo.outTradeNo +
          //             `&subject=` +
          //             this.payInfo.subject +
          //             `&totalAmount=` +
          //             this.payInfo.totalAmount +
          //             `&description=` +
          //             this.payInfo.description
        )
        .then((resp) => {
          // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
          console.log('resp:', resp)
          const divForm = document.getElementsByTagName('div')
          console.log('divForm:', divForm)
          if (divForm.length) {
            console.log('divForm.length:', divForm.length)
            document.body.removeChild(divForm[0])
          }
          const div = document.createElement('div')
          div.innerHTML = resp.data.data // data就是接口返回的form 表单字符串

          console.log('div:', div)
          document.body.appendChild(div)

          console.log('document:', document)
          const form = document.forms[0]
          if (form) {
            // 新开窗口跳转
            form.setAttribute('target', '_blank')
            form.submit()
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    }
  }
}
</script>

<style></style>
