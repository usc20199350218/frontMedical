<template>
  <div class="all">
    <div class="tit">
      <label>
        订单：
        {{ this.result.orderNum }}
      </label>
      <!-- <button @click="dialogVisible = true">{{ buttonText }}</button> -->
    </div>
    <div class="replenish">
      <el-row :gutter="24">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <div class="userTit">
              <span>用户信息:</span>
            </div>
            <div class="detail">
              <div class="detailLeft">姓名:</div>
              <div class="detailRight">{{ user.userRealName }}</div>
            </div>
            <div class="detail">
              <div class="detailLeft">手机号:</div>
              <div class="detailRight">{{ user.userPhone }}</div>
            </div>
            <div class="detail">
              <div class="detailLeft">性别:</div>
              <div class="detailRight">{{ user.userGender }}</div>
            </div>
            <div class="detail">
              <div class="detailLeft">生日:</div>
              <div class="detailRight">{{ user.userBirthday }}</div>
            </div>
            <div class="detail">
              <div class="detailLeft">vip:</div>
              <div class="detailRight">
                <span v-if="user.userVip === 1">是</span>
                <span v-if="user.userVip === 0">否</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="searchText1" class="input-with-select">
              <el-select v-model="searchType1" slot="prepend" placeholder="请选择">
                <el-option label="用户真实姓名" value="realName"></el-option>
                <el-option label="用户电话" value="phone"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
            </el-input>
            <el-table :ref="orderList" :data="orderList" style="width: 100%">
              <el-table-column label="店NO" prop="storeBatchId" width="60px">
              </el-table-column>
              <el-table-column label="批次" prop="batchNumber">
              </el-table-column>
              <el-table-column label="名称" prop="drugName">
              </el-table-column>
              <el-table-column label="规格" prop="drugSpecification">
              </el-table-column>
              <el-table-column label="零售价" prop="drugRetailPrice">
              </el-table-column>
              <el-table-column label="数量" prop="purchaseQuantity">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple6" style="background-color: antiquewhite;">

            <div class="grid-content bg-purple">
              <div class="userTit">
                <span>订单支付情况:</span>
              </div>

              <div class="detail">
                <div class="detailLeft">金额:</div>
                <div class="detailRight">{{ result.amount }}</div>
              </div>
              <div class="detail">
                <div class="detailLeft">方式:</div>
                <div class="detailRight">{{ payment }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="activity">
      this.result.orderNum+
      {{ this.result.orderNum }}
      <br />
      | this.orderList+ {{ this.orderList }}
      <br />|this.result+ {{ this.result }}
    </div>
    <div class="pay">
      <div class="payChoose">
        <el-radio-group v-model="payment">
          <el-radio-button v-for="item in paymentList" :label="item" :key="item"
            :disabled="chosePayMent"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="payBtn">
        <el-button type="primary" @click="clear()">取消</el-button>
        <el-button type="primary" @click="finish()">结算</el-button>
        <!-- <el-button type="primary" @click="settlement()">结算</el-button> -->
        <!-- <el-button type="primary" @click="openAlipay()">支付宝结算</el-button> -->
        <!-- <el-button type="primary" @click="start()">支付宝前结算</el-button> -->
        <el-button type="primary" @click="end()">支付完成</el-button>
        <el-button type="primary" @click="chosePayMent = false">解锁支付方式</el-button>
      </div>

    </div>
    <el-dialog title="选择用户" :visible.sync="showSelectUser" :before-close="handleClose">
      <el-table :data="userList" style="width: 100%">
        <el-table-column label="用户Id">
          <template slot-scope="userList">
            <span style="margin-left: 10px">{{ userList.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="userList">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ userList.row.name }}</p>
              <p>生日: {{ userList.row.userBirthday }}</p>
              <p>昵称: {{ userList.row.userNickName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ userList.row.userRealName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="userList">
            <span style="margin-left: 10px">{{ userList.row.userPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="userList">
            <span style="margin-left: 10px">{{ userList.row.userGender }}</span>
          </template>
        </el-table-column>
        <el-table-column label="vip">
          <template slot-scope="userList">
            <span v-if="userList.row.userVip == '0'">非vip</span>
            <span v-if="userList.row.userVip != '0'" style="margin-left: 10px">{{ userList.row.userVip
            }}级</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="userList">
            <el-button size="mini" @click="handleChoose(userList.$index, userList.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
        </el-pagination>
      </div>
    </el-dialog>

    <button @click="showSelectUser = true">显示弹窗</button>
    <el-dialog title="支付" :visible.sync="showPayQrCode" :before-close="handleClose">
      <!-- <img :src="getImgUrl()" v-if="showImg" alt="fail"> -->
      <img :src="getImgUrl()" v-if="showImg" alt="fail">
      <!-- <div v-if="showModal" class="modal">
            <div class="modal-content" v-html="modalContent"></div>
            <button @click="showModal = false">关闭弹窗</button>
        </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPayQrCode = false">取 消</el-button>
        <el-button type="primary" @click="showPayQrCode = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" @open="startCountDown" @close="closeFunction">
      <button v-bind:disabled="isDisabled" v-on:click="disableButton">{{ buttonText }}</button>
    </el-dialog>
    <div class="payMode">

    </div>
  </div>
</template>

<!--
    1.通过下单页面传过来订单id，订单详情list
    2.查找用户，弹窗选择用户,只有一个选择按钮
    3.选择支付方式
    4.如果是非现金，开启支付弹窗，二维码展示（带刷新按钮，也不能解决刷新问题）
    5.现金支付，开启弹窗，二维码不展示
    6.支付成功之后等待通知，进行修改

    关于状态的部分，在进入这个vue时已经建好了订单、订单详情，此时是关联购买用户（用于生成购买记录），选择支付方式，
    点击结算，更新购买用户、支付方式
    如果是支付宝则获取支付宝二维码，通知之后根据订单信息更新状态，

-->
<script>
// import store from '../../store'
import Qs from 'qs'
import axios from '../../utils/request'
import Index from '../Index.vue'
export default {
  components: { Index },
  data () {
    return {
      chosePayMent: false,
      isDisabled: true,
      buttonText: 'Please wait 5 seconds',
      dialogVisible: false,
      countDown: 5,
      pageInfo: { current: 0, size: 5 },
      userList: [],
      showModal: false,
      modalContent: '<h1>这是一个HTML弹窗</h1><p>这是一些HTML内容</p><img :src="getImgUrl()" alt="支付二维码"></img>',
      orderList: this.$route.query.resultList,
      result: this.$route.query.result,
      //   resultList: [],
      // result: { amount: 30, orderNum: '20230409202115957651' },
      paymentList: ['现金', '支付宝', '微信', '其他'],
      radio: '',
      payment: '现金',
      order: {},
      searchType1: 'realName',
      searchText1: '',
      user: {
        userName: '宇文'
      },
      money: 0,
      showImg: false,
      showSelectUser: false,
      showPayQrCode: false,
      timer: null,
      startPay: false,
      paySuccess: false
    }
  },
  created () {
    // this.searchType1 = 'realName'
  },
  methods: {
    settlement () {

    },
    examine () {
      console.log('开始检查')
      axios({
        method: 'get',
        url: `/admin/order/examine/` + this.result.orderId
      }).then((jsondata) => {
        console.log(jsondata)
        console.log(jsondata.data)
        this.paySuccess = jsondata.data
        console.log('this.paySuccess:', this.paySuccess)
        return jsondata.data
      })
    },
    end () {
      if (this.startPay) {
        console.log('examine:', this.examine())
        console.log('payment:', this.payment)
        this.examine()

        if (this.paySuccess) {
          console.log('清理开始')
          clearInterval(this.timer)
          this.timer = null
          console.log(this.timer)
          this.$router.push({ path: '/store/offline' })
        } else {
          console.log('清理失败')
        }
      } else {
        this.$message({
          message: '还未支付,请支付，取消支付请点击取消按钮',
          type: 'warning'
        })
      }
    },
    start () {
      this.timer = setInterval(() => {
        console.log('检查中---')
        this.examine()
        if (this.paySuccess) {
          console.log('检查正常')
          clearInterval(this.timer)
        }
      }, 10000)
    },
    openAlipay () {
      // this.intervalId = setInterval(this.examine(), 1000)
      // axios.post('/api/alipay/pay')

      const alipayDTO = {
        totalAmount: this.result.amount,
        merchantOrderNo: this.result.orderNum,
        storeId: 1,
        userId: this.user.userId
      }
      console.log('alipayDTO:', alipayDTO)
      axios({
        method: 'post',
        url: '/api/alipay/last',
        data: Qs.stringify(alipayDTO)
      })
        // .then((jsondata) => {
        // console.log('jsondata:', jsondata)
        // })

        // axios
        //   .post(
        //     '/api/alipay/pay'
        //   )

        .then((resp) => {
          console.log('resp:', resp)
          const divForm = document.querySelector('.payMode')
          console.log('divForm:', divForm)
          if (divForm.length) {
            console.log('divForm.length:', divForm.length)
            document.body.removeChild(divForm[0])
          }
          divForm.innerHTML = resp.data.body
          console.log('document:', document)
          const form = document.forms[0]
          console.log('form', form)
          if (form) {
            form.setAttribute('target', '_blank')
            form.submit()
            // setTimeout(this.start(), 10000)
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    },
    closeFunction () {
      this.countDown = 0
      console.log('close')
    },
    startCountDown () {
      const interval = setInterval(() => {
        this.countDown--
        this.buttonText = `Please wait ${this.countDown} seconds`
        if (this.countDown === 0) {
          clearInterval(interval)
          this.isDisabled = false
          this.buttonText = 'Click me'
        }
      }, 1000)
    },
    disableButton () {
      if (!this.isDisabled) {
        this.isDisabled = true
        this.buttonText = 'Please wait 10 seconds'
        let countDown = 10
        const interval = setInterval(() => {
          countDown--
          this.buttonText = `Please wait ${countDown} seconds`
          if (countDown === 0) {
            clearInterval(interval)
            this.isDisabled = false
            this.buttonText = 'Click me'
          }
        }, 1000)
      }
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.searchUser()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.searchUser()
    },
    getImgUrl () { return 'http://localhost:8088/api/alipay/pay?money=' + this.result.amount },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleChoose (index, row) {
      this.user = row
      this.showSelectUser = false
    },
    searchUser () {
      //   if (this.searchText1 !== '') {
      axios({
        method: 'get',
        url: '/admin/user/search',
        params: {
          searchType: this.searchType1,
          searchText: this.searchText1,
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        this.userList = jsondata.data.records
        this.pageInfo = jsondata.data
        console.log('jsondata', jsondata)
        if (this.userList.length !== 0) {
          this.showSelectUser = true
        } else {
          this.$message({
            showClose: true,
            message: '搜索结果为空',
            type: 'error'
          })
        }
      })
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: '搜索不能为空',
      //       type: 'error'
      //     })
      //   }
    },
    clear () {
      axios({
        method: 'put',
        url: `/admin/order/cancel/` + this.result.orderId
      }).then((jsondata) => {
        console.log('取消订单jsondata:', jsondata)
      })
    },
    finish () {
      /**
         * 此时点击结算按钮
         * 如果需要输入用户则有值，如果没有后端处理
         * 根据选择的支付方式，动态的展示结果（支付宝则开始获取二维码地址）
         *
         */
      this.chosePayMent = true
      console.log('开始结算')
      console.log('this.user.userId:', this.user.userId)
      console.log('this.payment:', this.payment)
      console.log('this.result.orderId:', this.result.orderId)
      this.startPay = true
      this.money = this.result.amount
      // this.showImg()
      // 支付中，先将订单状态进行修改
      axios({
        method: 'put',
        url: '/admin/order/offline',
        params: {
          'userId': this.user.userId,
          'payment': this.payment,
          'orderId': this.result.orderId
        }
      }).then((jsondata) => {
        console.log('提交jsondata:', jsondata)
        // this.showPayQrCode = true
        if (this.payment === '支付宝' && jsondata != null && jsondata.code === '200') {
          console.log('支付宝，开始获取二维码')
          // this.showImg = true
          this.openAlipay()
        }
      })
    }
  },
  beforeDestroy () {
    // js提供的clearInterval方法用来清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style>
.detail {
  display: flex;
  flex-direction: row;
  height: 50px;
}

.detailLeft {
  flex: 1;
}

.detailRight {
  flex: 1;
}

.all {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.tit {
  flex: 1;
  background-color: aliceblue;
  text-align: center;
}

.replenish {
  flex: 7;
  /* display: flex; */
  flex-direction: row;
  /* background-color: chocolate; */
  height: 40vh;
}

.activity {
  flex: 7;
  background-color: antiquewhite;
}

.pay {
  flex: 2;
  display: flex;
  flex-direction: row;
}

.payChoose {
  background-color: aqua;
  flex: 1;
}

.payBtn {
  flex: 1;
  background-color: blueviolet;
}
</style>
