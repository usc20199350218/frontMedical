<template>
    <div class="all">
        <div class="tit">
            <label>
                订单：
                {{ this.result.orderNum }}
            </label>

        </div>
        <div class="replenish">
            <el-row :gutter="20">
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <div class="userTit">
                            <span>用户信息:</span>
                        </div>
                        <div class="userDetail">
                            <div class="userDetailLeft">姓名:</div>
                            <div class="userDetailRight">{{ user.userRealName }}</div>
                        </div>
                        <div class="userDetail">
                            <div class="userDetailLeft">手机号:</div>
                            <div class="userDetailRight">{{ user.userPhone }}</div>
                        </div>
                        <div class="userDetail">
                            <div class="userDetailLeft">生日:</div>
                            <div class="userDetailRight">{{ user.userBirthday }}</div>
                        </div>
                        <div class="userDetail">
                            <div class="userDetailLeft">vip:</div>
                            <div class="userDetailRight">
                                <span v-if="user.userVip===1">是</span>
                                <span v-if="user.userVip===0">否</span>
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
                        <el-input class="input-with-select"><el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                </el-col>
            </el-row>

        </div>
        <div class="activity">
            {{ this.result.orderNum }}
        </div>
        <div class="pay">
            <div class="payChoose">
                <el-radio-group v-model="payment">
                    <el-radio-button v-for="item in paymentList" :label="item" :key="item"></el-radio-button>
                </el-radio-group>
            </div>
            <div class="payBtn">
                <el-button type="primary" @click="clear()">清零</el-button>
                <el-button type="primary" @click="finish()">结算</el-button>
            </div>

        </div>
    </div>
</template>

<script>
import axios from '../../utils/request'
import Index from '../Index.vue'
export default {
  components: { Index },
  data () {
    return {
      resultList: this.$route.query.resultList,
      result: this.$route.query.result,
      //   resultList: [],
      //   result: { amount: 30, orderNum: '20230409202115957651' },
      paymentList: ['现金', '支付宝', '微信', '其他'],
      radio: '',
      payment: '现金',
      order: {},
      searchType1: 'realName',
      searchText1: '',
      user: {
        userName: '宇文'
      }
    }
  },
  created () {
    // this.searchType1 = 'realName'
  },
  methods: {
    searchUser () {
      if (this.searchText1 !== '') {
        axios({
          method: 'get',
          url: '/admin/user/search',
          params: {
            searchType: this.searchType1,
            searchText: this.searchText1
          }
        }).then((jsondata) => {
          this.user = jsondata.data
          console.log('jsondata', jsondata)
        })
      } else {
        alert('不能为空')
      }
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
      console.log('开始结算')
      console.log('this.user.userId:', this.user.userId)
      console.log('this.payment:', this.payment)
      console.log('this.result.orderId:', this.result.orderId)
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
      })
    }
  }
}
</script>

<style>
.userDetail{
    display: flex;
    flex-direction: row;
    height: 50px;
}
.userDetailLeft{
    flex:1;
}
.userDetailRight{
    flex:1;
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
