<template>
  <div>
    <el-row :span="24">
      <el-col :span="4.5">
        <el-date-picker v-model="chooseDate" :picker-options="pickerOptions" align="right" end-placeholder="结束日期" range-separator="至"
                        start-placeholder="开始日期" type="daterange" unlink-panels
                        value-format="yyyy-MM-dd"
                        @change="searchStart()">
        </el-date-picker>
      </el-col>
      <el-col :span="17">
        <el-input v-model="searchText" class="input-with-select" placeholder="请输入内容">
          <el-select slot="prepend" v-model="storeId" placeholder="选择店铺" style="width: 150px;"
                     @change="searchStart()">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="store in storeList" :key="store.storeId" :label="store.storeName" :value="store.storeId">
            </el-option>
          </el-select>
          <el-select slot="prepend" v-model="orderType" placeholder="选择类型" style="padding-left: 30px; width: 150px;"
                     @change="searchStart()">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="type in orderTypeList" :key="type" :label="type" :value="type">
            </el-option>
          </el-select>
          <el-select slot="prepend" v-model="payment" placeholder="选择支付方式" style="padding-left: 30px; width: 150px;"
                     @change="searchStart()">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="item in paymentList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select slot="prepend" v-model="payStatus" placeholder="选择状态" style="padding-left: 30px; width: 150px;"
                     @change="searchStart()">
            <el-option key="" value="">全部</el-option>
            <el-option v-for="item in payStatusList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select slot="prepend" v-model="searchMethod" placeholder="请选择"
                     style="padding-left: 30px;  width: 8vw;">
            <el-option label="药品名称" value="药品名称"></el-option>
            <el-option label="药品编号" value="药品编号"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchStart()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <div>
      <el-table ref="multipleTable" :data="orderList" style="width: 100%" tooltip-effect="dark"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNum">
        </el-table-column>
        <el-table-column label="金额(元)" prop="amount">
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 'OFFLINE'">线下</span>
            <span v-else-if="scope.row.orderType === 'ONLINE'">线上</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentMethod === 'CASH'">现金</span>
            <span v-else-if="scope.row.paymentMethod === 'ALIPAY'">支付宝</span>
            <span v-else-if="scope.row.paymentMethod === 'WECHATPAY'">现金</span>
            <span v-else>error</span>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" prop="paymentTime" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'CREATED'">创建</span>
            <span v-else-if="scope.row.status === 'SUCCESS'">成功</span>
            <span v-else-if="scope.row.status === 'ING'">支付中</span>
            <span v-else-if="scope.row.status === 'GIVE_UP'">放弃</span>
            <span v-else>error</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)">详情</el-button>
            <el-button v-if="scope.row.orderType === 'ONLINE'" @click="handleLookAll(scope.row)">收件人</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination :current-page="pageInfo.current" :page-size="pageInfo.size"
                       :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :total="pageInfo.total"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="showTitle" :visible.sync="showDetail">
        <el-table :data="orderDetailList">
          <el-table-column label="药品名称">
            <template slot-scope="scope">
              <el-popover placement="top" trigger="hover">
                <p>Id: {{ scope.row.orderDetailId }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.drugName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="价格">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.drugPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总价">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="showTitle" :visible.sync="showAll">
        <el-form ref="form" :model="order" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="order.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="order.userPhone" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="order.deliveryAddress" :disabled="true" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
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
      pageInfo: {current: 0, size: 10},
      orderDetailList: [],
      showTitle: '详情',
      showDetail: false,
      order: {},
      showAll: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }

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
    handleLookAll (val) {
      console.log('handleLookAll:', val)
      this.showTitle = 'orderNum为' + val.orderNum + '的订单'
      this.order = val
      this.showAll = true
    },
    handleLook (row) {
      this.showTitle = 'orderNum为' + row.orderNum + '的订单'
      console.log('查看订单详情', row)
      axios({
        method: 'get',
        url: `/admin/order/detail/` + row.orderId
      }).then((jsondata) => {
        console.log('订单详情', jsondata)
        if (jsondata.code === '200') {
          this.orderDetailList = jsondata.data
          this.showDetail = true
        }
      })
    },
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
