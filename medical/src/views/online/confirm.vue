<template>
  <div>
    <el-row style="display: flex;justify-content: center;">
      <el-col :span="20">
        <div>
          <!-- <div>
            <el-button style="float: left;">选择地址</el-button>
          </div>
          <div>
            <el-input v-model="addressText"></el-input>
          </div> -->
          <el-row>
            <el-col :span="2">
              <el-button style="float: left;" @click="showAddList()">选择地址</el-button>
            </el-col>
            <el-col :span="12">
              <el-input v-model="addressText" :disabled="true"></el-input>
            </el-col>
          </el-row>
          <!-- <div class="address" style=" clear: both; ">
            <el-radio v-model="delivery" label="自取" style="padding-left: 5vh;display: inline-block"
              :disabled="startPay">自取</el-radio>
            <el-radio v-model="delivery" v-for="item in 12" :key="item" :label="item + item"
              style=" display: inline-block" :disabled="startPay">
              {{ item }}
            </el-radio>
          </div> -->
          <div class="main">
            <el-row>
              <el-col :span="18">
                <el-table :data="drugDetailList.filter(
                  (data) =>
                    !search ||
                    data.drugName.toLowerCase().includes(search.toLowerCase())
                )
                  " fit mix-height="100" stripe style="width: 100%">
                  <el-table-column label="图片" min-width="125px">
                    <template slot-scope="drugDetailList">
                      <img :src="drugDetailList.row.val.drugDetailPath" alt="图片" width="100px">
                    </template>
                  </el-table-column>
                  <el-table-column label="品名" min-width="150px">
                    <template slot-scope="drugDetailList">
                      <el-popover placement="top" trigger="hover">
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
                      <el-input-number v-model="drugDetailList.row.val.number" :disabled="startPay"
                                       :max="50" :min="1" controls-position="right" style="width: 85px;"
                                       @change="handleChange"></el-input-number>
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
              <el-col :span="6">
                <!-- <div>
                  <span style="font-size: 10vh;">
                    {{ totalPrice }}
                  </span>
                </div>
                <div>
                  <el-button @click="back()">返回</el-button>
                  <el-button style="float: right;" @click="settlement()">提交订单</el-button>
                  <el-button v-show="showOver" @click="checkOrder()">完成支付</el-button>
                </div> -->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                总金额
                <span style="font-size: 10vh;">
                  {{ totalPrice }}
                </span>元
              </el-col>
              <el-col :offset="8" :span="4">
                <div>
                  <el-button @click="back()">返回</el-button>
                  <el-button @click="settlement()">提交订单</el-button>
                  <el-button v-show="showOver" @click="checkOrder()">完成支付</el-button>
                </div>
              </el-col>
            </el-row>
            <!-- <div>
              总金额
              <span style="font-size: 10vh;">
                {{ totalPrice }}
              </span>元
            </div>
            <div>
              <el-button @click="back()">返回</el-button>
              <el-button @click="settlement()">提交订单</el-button>
              <el-button v-show="showOver" @click="checkOrder()">完成支付</el-button>
            </div> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="payMode">

    </div>
    <div>
      <el-dialog :before-close="handleCloseAddressList" :visible.sync="showAddressList" title="选择地址" width="50%">
        <el-table :data="addressList" style="width: 100%">
          <el-table-column label="姓名" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="380">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.addressContent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleChoose(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
      addressText: '',
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
      startPay: false,
      addressList: [],
      addressId: '',
      showAddressList: false

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
    // this.getAddressList()
  },
  methods: {
    handleChoose (val) {
      console.log('choose:', val)
      this.addressId = val.addressId
      this.addressText = '姓名：' + val.userName + '|手机号：' + val.userPhone + '|地址：' + val.addressContent
      this.showAddressList = false
    },
    showAddList () {
      this.getAddressList()
      this.showAddressList = true
    },
    handleCloseAddressList (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    getAddressList () {
      axios.get('/api/address/' + this.userId).then((jsondata) => {
        console.log('address:', jsondata)
        this.addressList = jsondata.data
      })
    },
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
            // this.$router.push('/online/index')
            this.$router.push({
              path: '/online/index',
              query: {storeId: this.storeId, storeName: this.storeName}
            })
          }
        })
      }
    },
    settlement () {
      // 检查地址是否选择
      if (this.addressId === '') {
        alert('请选择选择地址')
        return
      }

      // console.log('delivery:', this.delivery)
      this.startPay = true
      // var condition = false
      // if (condition) {
      // }
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
        // address: this.delivery,
        addressId: this.addressId
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
      this.$router.go(-1)
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
