<template>
  <div>
    <el-row :span="24">
      <el-col :span="12">
        <el-input placeholder="请输入内容" v-model="userValue" class="input-with-select">
          <el-select v-model="userField" slot="prepend" placeholder="请选择" style="padding-left: 30px;  width: 8vw;">
            <el-option label="用户真实姓名" value="realName"></el-option>
            <el-option label="用户电话" value="phone"></el-option>
          </el-select>
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-button style="width:100%" @click="searchUser()">
          <span v-if="chooseUserStart">搜索</span>用户{{ userLabel }}
        </el-button>
      </el-col>
      <el-col :span="1">
        <el-button @click="clearUser()">重置</el-button>
      </el-col>
    </el-row>
    <el-row :span="24">
      <el-col :span="5">
        <el-date-picker v-model="chooseDate" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="searchStart()"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="18">
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
            <el-option label="订单编号" value="订单编号"></el-option>
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
            <span v-if="scope.row.orderType == 'OFFLINE'">线下</span>
            <span v-else-if="scope.row.orderType == 'ONLINE'">在线</span>
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
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'CREATED'">创建</span>
            <span v-else-if="scope.row.status == 'SUCCESS'">成功</span>
            <span v-else-if="scope.row.status == 'ING'">支付中</span>
            <span v-else-if="scope.row.status == 'GIVE_UP'">放弃</span>
            <span v-else-if="scope.row.status == 'REFUNDING'">退款中</span>
            <span v-else-if="scope.row.status == 'REFUND'">退款</span>
            <span v-else>error</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status !== 'REFUND' && scope.row.status !== 'REFUNDING'"
              @click="refund(scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change=" handleSizeChange " @current-change=" handleCurrentChange "
          :current-page=" pageInfo.current " :page-sizes=" [5, 10, 20, 30, 100, 1000, 10000] " :page-size=" pageInfo.size "
          layout="total, sizes, prev, pager, next, jumper" :total=" pageInfo.total ">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="选择用户" :visible.sync=" showSelectUser " :before-close=" handleClose ">
      <el-table :data=" userList " style="width: 100%">
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
            <span v-if=" userList.row.userVip == '0' ">非vip</span>
            <span v-if=" userList.row.userVip != '0' " style="margin-left: 10px">{{ userList.row.userVip
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
        <el-pagination @size-change=" handleSizeChange " @current-change=" handleCurrentChange "
          :current-page=" pageInfo.current " :page-sizes=" [5, 10, 20, 30, 100, 1000, 10000] " :page-size=" pageInfo.size "
          layout="total, sizes, prev, pager, next, jumper" :total=" pageInfo.total ">
        </el-pagination>
      </div>
    </el-dialog>

    <div>
      <el-dialog :title=" showTitle " :visible.sync=" showDetail ">
        <el-table :data=" orderDetailList ">
          <el-table-column label="药品名称">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
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
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      chooseUserStart: true,
      chooseDate: '',
      userList: [],
      buttonText: '选择用户',
      userId: mystore.state.user.userId,
      storeList: [],
      storeId: '',
      orderType: '',
      orderTypeList: [],
      searchText: '',
      searchMethod: '订单编号',
      orderList: [],
      multipleSelection: [],
      payStatus: '',
      payStatusList: [],
      payment: '',
      paymentList: [],
      paymentMethodMap: {},
      pageInfo: { current: 0, size: 10 },
      pageInfoInternal: { current: 0, size: 10 },
      userField: 'realName',
      userValue: '',
      showSelectUser: false,
      userLabel: '',
      shooseUser: '',
      showTitle: '',
      showDetail: false,
      orderDetailList: []
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
    refund (row) {
      console.log('退款:', row)
      axios.put(`/admin/order/refund/` + row.orderId).then((jsondata) => {
        console.log('jsondata:', jsondata)
        this.searchStart()
      })
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
    clearUser () {
      this.userLabel = ''
      this.chooseUserStart = true
      this.searchStart()
      this.shooseUser = ''
    },
    handleChoose (index, row) {
      this.shooseUser = row
      this.chooseUserStart = false
      this.userLabel = '姓名:' + row.userRealName + ',手机:' + row.userPhone
      this.showSelectUser = false
      this.searchStart()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    searchUser () {
      axios.get('/admin/user/search', {
        params: {
          searchType: this.userField,
          searchText: this.userValue,
          current: this.pageInfoInternal.current,
          size: this.pageInfoInternal.size
        }
      }).then((jsondata) => {
        this.userList = jsondata.data.records
        console.log('搜索用户:', jsondata)
        this.showSelectUser = true
      })
    },
    handleSelectionChange (val) {
      console.log('multipleSelection1:', this.multipleSelection)
      this.multipleSelection = val
      console.log('val:', val)
      console.log('multipleSelection2:', this.multipleSelection)
    },
    searchStart () {
      // console.log('搜索', this.payStatus, this.chooseDate[0], this.chooseDate[1], 1)
      let id = 0
      if (this.shooseUser !== '') {
        id = this.shooseUser.userId
      }
      console.log('id:', id)
      axios.get(`/admin/order/user/` + id, {
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
