<template>
  <div>
    <el-row :span="24">
      <el-col :span="4.5">
        <el-date-picker v-model="chooseDate" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="searchStart()"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="17">
        <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select">
          <el-select v-model="storeId" slot="prepend" placeholder="选择店铺" @change="searchStart()" style="width: 150px;">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="store in storeList" :key="store.storeId" :label="store.storeName" :value="store.storeId">
            </el-option>
          </el-select>
          <el-select v-model="orderType" slot="prepend" placeholder="选择类型" @change="searchStart()"
            style="padding-left: 30px; width: 150px;">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="type in orderTypeList" :key="type" :label="type" :value="type">
            </el-option>
          </el-select>
          <el-select v-model="payment" slot="prepend" placeholder="选择支付方式" @change="searchStart()"
            style="padding-left: 30px; width: 150px;">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="item in paymentList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select v-model="payStatus" slot="prepend" placeholder="选择状态" @change="searchStart()"
            style="padding-left: 30px; width: 150px;">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="item in payStatusList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select v-model="searchMethod" slot="prepend" placeholder="请选择" style="padding-left: 30px;  width: 8vw;">
            <el-option label="药品名称" value="药品名称"></el-option>
            <el-option label="药品编号" value="药品编号"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchStart()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <div>
      <el-table ref="multipleTable" :data="orderList" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNum">
        </el-table-column>
        <el-table-column label="金额(元)" prop="amount">
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 'OFFLINE'">线上</span>
            <span v-else-if="scope.row.orderType == 'ONLINE'">线下</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentMethod == 'CASH'">现金</span>
            <span v-else-if="scope.row.paymentMethod == 'ALIPAY'">支付宝</span>
            <span v-else-if="scope.row.paymentMethod == 'WECHATPAY'">现金</span>
            <span v-else>error</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTime" label="支付时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'CREATED'">创建</span>
            <span v-else-if="scope.row.status == 'SUCCESS'">成功</span>
            <span v-else-if="scope.row.status == 'ING'">支付中</span>
            <span v-else-if="scope.row.status == 'GIVE_UP'">放弃</span>
            <span v-else>error</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import mystore from '../../store'
import axios from '../../utils/request'
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick (picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      chooseDate: '',
      userId: mystore.state.user.userId,
      storeList: [],
      storeId: '',
      orderType: '',
      orderTypeList: [],
      searchText: '',
      searchMethod: '药品名称',
      orderList: [],
      multipleSelection: [],
      payStatus: '',
      payStatusList: [],
      payment: '',
      paymentList: [],
      paymentMethodMap: {},
      pageInfo: { current: 0, size: 10 }

    }
  },
  created () {
    this.getPaymentList()
    this.getStoreList()
    this.getOrderTypeList()
    this.getPayStatusList()

    this.searchStart()
  },
  methods: {
    handleSelectionChange (val) {
      console.log('multipleSelection1:', this.multipleSelection)
      this.multipleSelection = val
      console.log('val:', val)
      console.log('multipleSelection2:', this.multipleSelection)
    },
    searchStart () {
      console.log('搜索', this.payStatus, this.chooseDate[0], this.chooseDate[1], 1)
      axios.get(`/admin/order/user/` + this.userId, {
        params: {
          orderType: this.orderType,
          storeId: this.storeId,
          searchMethod: this.searchMethod,
          searchText: this.searchText,
          payStatus: this.payStatus,
          payment: this.payment,
          startDate: this.chooseDate[0],
          endDate: this.chooseDate[1],
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        console.log('搜索:', jsondata)
        this.orderList = jsondata.data.records
        this.pageInfo = jsondata.data
      })
    },

    getPayStatusList () {
      axios.get('/api/common/list/pay_status').then((jsondata) => {
        console.log('payStatusList:', jsondata)
        this.payStatusList = jsondata.data
      })
    },
    getStoreList () {
      axios.get(`/admin/store/user/` + this.userId).then((jsondata) => {
        console.log('店铺列表:', jsondata)
        this.storeList = jsondata.data
      })
    },
    getOrderTypeList () {
      axios.get('/api/common/order_type').then((jsondata) => {
        console.log('订单类型:', jsondata)
        this.orderTypeList = jsondata.data
      })
    },
    getPaymentList () {
      axios.get('/api/common/list/pay/method').then((jsondata) => {
        console.log('支付方式:', jsondata)
        this.paymentList = jsondata.data
      })
    },
    handleSizeChange (val) {
      this.pageInfo.size = val
      this.searchStart()
    },
    handleCurrentChange (val) {
      this.pageInfo.current = val
      this.searchStart()
    }
  }
}
</script>

<style></style>
