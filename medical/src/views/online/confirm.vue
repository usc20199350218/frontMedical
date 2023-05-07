<template>
    <div>
        <el-row style="display: flex;justify-content: center;">
            <el-col :span="20">
                <div>
                    <div style="background-color: antiquewhite;">
                        <span style="float: left;">选择地址</span>
                        <el-link>新增地址</el-link>
                    </div>
                    <div class="address" style="background-color: aqua;clear: both; ">
                        <el-radio v-model="delivery" label="自取"
                            style="padding-left: 5vh;display: inline-block" :disabled="startPay">自取</el-radio>
                        <el-radio v-model="delivery" v-for="item in 12" :key="item" :label="item + item"
                            style=" display: inline-block" :disabled="startPay">
                            {{ item }}|{{ item }}|{{ item }}
                        </el-radio>
                    </div>
                    <div class="main" style="background-color: blueviolet;">
                        <el-row>
                            <el-col :span="18" style="background-color: brown;">
                                <el-table :data="drugDetailList.filter(
                                        (data) =>
                                            !search ||
                                            data.drugName.toLowerCase().includes(search.toLowerCase())
                                    )
                                    " fit stripe mix-height="100" style="width: 100%">
                                    <el-table-column label="图片" min-width="125px">
                                        <template slot-scope="drugDetailList">
                                            <img :src="drugDetailList.row.val.drugDetailPath" width="100px" alt="图片">
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="品名" min-width="150px">
                                        <template slot-scope="drugDetailList">
                                            <el-popover trigger="hover" placement="top">
                                                <p>编码: {{ drugDetailList.row.val.drugNumber }}</p>
                                                <span style="margin-left: 10px">{{ drugDetailList.row.val.createTime
                                                }}</span>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="medium">{{ drugDetailList.row.val.drugName }}</el-tag>
                                                </div>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="品牌" min-width="125px">
                                        <template slot-scope="drugDetailList">
                                            <span style="margin-left: 10px">{{ drugDetailList.row.val.brandName }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="规格" min-width="125px">
                                        <template slot-scope="drugDetailList">
                                            <span style="margin-left: 10px">{{ drugDetailList.row.val.drugSpecification
                                            }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="售价" min-width="60px">
                                        <template slot-scope="drugDetailList">
                                            <span style="margin-left: 10px">{{ drugDetailList.row.val.drugRetailPrice
                                            }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="数量">
                                        <template slot-scope="drugDetailList">
                                            <!-- <span v-if="drugDetailList.row.val.number !== ''">{{
                                                drugDetailList.row.val.number
                                            }}</span>
                                            <span v-if="drugDetailList.row.val.number == ''">0</span> -->
                                            <el-input-number v-model="drugDetailList.row.val.number"
                                                controls-position="right" @change="handleChange" :min="1"
                                                style="width: 85px;" :max="50" :disabled="startPay"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <!-- <el-table-column align="left" width="220px" fixed="right">
                                        <template slot="header" slot-scope="drugDetailList">
                                            <el-col :span="14" v-if="drugDetailList">
                                                操作
                                            </el-col>
                                        </template>
                                        <template slot-scope="drugDetailList">
                                            <el-button size="mini" v-if="drugDetailList"
                                                @click="cHandleAdd(row)">编辑</el-button>
                                            <el-button size="mini" v-if="drugDetailList"
                                                @click="cHandleReduce(row)">删除</el-button>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                            </el-col>
                            <el-col :span="6" style="background-color: crimson;">
                                <div>
                                    <span style="font-size: 10vh;">
                                        {{ totalPrice }}
                                    </span>
                                </div>
                                <div>
                                    <el-button @click="back()">返回</el-button>
                                    <!-- <el-button @click="calculate()">计算</el-button> -->
                                    <el-button style="float: right;" @click="settlement()">提交订单</el-button>
                                    <el-button v-show="showOver" @click="checkOrder()">完成支付</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="payMode">

        </div>
    </div>
</template>

<script>
import Qs from 'qs'
import mystore from '../../store'
import axios from '../../utils/request'
export default {
  data () {
    return {
      userId: mystore.state.user.userId,
      storeId: '',
      delivery: '自取',
      drugDetailList: [],
      search: '',
      totalPrice: 0,
      remark: '',
      address: '自取',
      showOver: false,
      orderNum: '',
      startPay: false

    }
  },
  created () {
    this.drugDetailList = this.$route.query.drugDetailList
    this.storeId = this.$route.query.storeId
    console.log('进入确认页面')
    console.log('storeId:', this.storeId)
    console.log('drugDetailList:', this.$route.query.drugDetailList)
    console.log('-----')
    this.calculate()
  },
  methods: {
    checkOrder () {
      // 检查订单状态，然后进入详情页
      if (this.orderNum !== '') {
        console.log('检查订单是否支付')
        axios({
          method: 'get',
          url: `/api/online/examine/` + this.orderNum
        }).then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.$router.push('/online/index')
          }
        })
      }
    },
    settlement () {
      console.log('delivery:', this.delivery)
      this.startPay = true
      var condition = false
      if (condition) {
        return
      }
      const drugDetailIdList = []
      for (var i = 0; i < this.drugDetailList.length; i++) {
        for (var z = 0; z < this.drugDetailList[i].val.number; z++) {
          drugDetailIdList.push(this.drugDetailList[i].val.drugDetailId)
        }
      }
      console.log('添加的drugDetailIdList:', drugDetailIdList)
      const order = {
        userId: this.userId,
        storeId: this.storeId,
        totalPrice: this.totalPrice,
        drugDetailIdList: drugDetailIdList,
        remark: this.remark,
        address: this.delivery
      }
      axios({
        method: 'post',
        url: '/api/online/order',
        data: Qs.stringify(order)
      })
      // .then((resp) => {
      //   console.log('结算：', resp)
      //   const divForm = document.querySelector('.payMode')
      //   console.log('divForm:', divForm)
      //   if (divForm.length) {
      //     console.log('divForm.length:', divForm.length)
      //     document.body.removeChild(divForm[0])
      //   }
      //   divForm.innerHTML = resp.data.body
      //   console.log('document:', document)
      //   const form = document.forms[0]
      //   console.log('form', form)
      //   if (form) {
      //     form.setAttribute('target', '_blank')
      //     form.submit()
      //     //   setTimeout(this.start(), 10000)
      //   } else {
      //     console.error('文档中未找到表单元素。')
      //   }
      // })
        .then((resp) => {
          // 检查创建状态，调用支付宝
          console.log('resp:', resp)
          if (resp.code === '200') {
            this.orderNum = resp.data.merchantOrderNo
            this.openAlipay(resp.data.totalAmount, this.orderNum)
          }
        })
    },
    openAlipay (amount, orderNum) {
      console.log('准备支付宝二维码')
      this.showOver = true
      const alipayDTO = {
        totalAmount: amount,
        merchantOrderNo: orderNum,
        storeId: this.storeId,
        userId: this.userId
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
          } else {
            console.error('文档中未找到表单元素。')
          }
        })
    },
    handleChange (value) {
      console.log(value)
      this.calculate()
      console.log('list:', this.drugDetailList)
    },
    back () {
      console.log('back')
    },
    calculate () {
      console.log('length:', this.drugDetailList.length)
      this.totalPrice = 0
      console.log('开始计算')
      for (var i = 0; i < this.drugDetailList.length; i++) {
        console.log(this.drugDetailList[i])
        this.totalPrice += this.drugDetailList[i].val.number * this.drugDetailList[i].val.drugRetailPrice
      }
      console.log('结束计算')
    }

  }
}
</script>

<style></style>
