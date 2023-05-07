<template>
  <div class="container">
    <div class="shop">
      <el-tabs v-model="activeStoreNum" type="card" @tab-click="chooseStore">
        <el-tab-pane v-for="(store, sindex ) in storeList" :key="sindex" :label="store.storeName">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="operate">
      <div class="chooseDrug">
        <div class="leftTop">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model="inputText" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="药品名称" value="drugName"></el-option>
                <el-option label="编号" value="drugNumber"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="getSearchList()"></el-button>
            </el-input>
          </div>
          <div>
            <el-table
              :data="resultList.filter(data => !search || data.drugName.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">
              <el-table-column label="店NO" prop="storeBatchId" width="60px">
              </el-table-column>
              <el-table-column label="名称" prop="drugName">
              </el-table-column>
              <el-table-column label="品牌" prop="brandName">
              </el-table-column>
              <el-table-column label="批次编号" prop="batchNumber">
              </el-table-column>
              <el-table-column label="生产日期" prop="batchProductionDate">
              </el-table-column>
              <el-table-column label="零售价" prop="drugRetailPrice">
              </el-table-column>
              <el-table-column label="剩余库存" prop="storeBatchExistingQuantity">
              </el-table-column>

              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search" size="mini" v-if="scope" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="leftBottom">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
              layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="order">
        <div class="orderDetail">
          <el-table :ref="orderList"
            :data="orderList.filter(data => !search || data.drugName.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%" :key="menuKey">
            <el-table-column label="店NO" prop="storeBatchId" width="60px">
            </el-table-column>
            <el-table-column label="名称" prop="drugName">
            </el-table-column>
            <el-table-column label="零售价" prop="drugRetailPrice">
            </el-table-column>
            <el-table-column label="数量" prop="purchaseQuantity">
            </el-table-column>
            <!-- <el-table-column label="数量" min-width="80px">
              <template slot-scope="orderList">
                <el-input-number size="mini" v-model="orderList.row.purchaseQuantity" @change="handleChange" :min="0"
                  label="描述文字"></el-input-number>
              </template>
            </el-table-column> -->
            <!-- <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number> -->
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="mini" v-if="scope" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="handleOrderAdd(scope.$index, scope.row)"
                  icon="el-icon-circle-plus-outline" />
                <el-button size="mini" @click="handleOrderRemove(scope.$index, scope.row)"
                  icon="el-icon-remove-outline" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="orderOperate">
          <span>{{ amount }}</span>
          <el-button type="warning" @click="clearOrder()">重置</el-button>
          <el-button type="primary" @click="generateOrder()">结算</el-button>
        </div>
      </div>
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
      pageInfo: { current: 0, size: 10 },
      activeStoreId: '',
      activeStoreNum: 0,
      storeList: [],
      inputText: '',
      select: 'drugName',
      resultList: [],
      search: '',
      orderList: [],
      menuKey: 1,
      previousTab: 1,
      ordersIdList: [],
      amount: 0,
      userId: mystore.state.user.userId
    }
  },
  created () {
    this.getStoreList()
    this.previousTab = this.activeStoreNum
  },

  methods: {
    handleChange (value) {
      console.log(value)
    },
    generateOrder () {
      console.log('this.orderList:', this.orderList)
      //   const tableData = this.orderList
      //   axios.post('/admin/offline', tableData)
      //     .then(response => {
      //       console.log(response)
      //     })
      //     .catch(error => {
      //       console.error(error)
      //     })

      // axios({
      //   method: 'post',
      //   url: '/admin/offline',
      //   data: { offlineSaleVOList: this.orderList }
      // }).then(response => {
      //   console.log(response)
      // })
      //   .catch(error => {
      //     console.error(error)
      //   })

      // const order = this.orderList.map(item => ({
      //   batchId: item.batchId,
      //   batchNumber: item.batchNumber,
      //   batchProductionDate: item.batchProductionDate,
      //   brandId: item.brandId,
      //   brandName: item.brandName,
      //   drugDetailId: item.drugDetailId,
      //   drugId: item.drugId,
      //   drugName: item.drugName,
      //   drugRetailPrice: item.drugRetailPrice,
      //   drugSpecification: item.drugSpecification,
      //   purchaseQuantity: item.purchaseQuantity,
      //   storeBatchExistingQuantity: item.storeBatchExistingQuantity,
      //   storeBatchId: item.storeBatchId
      // }))
      // axios({
      //   url: '/admin/offline/corder',
      //   method: 'post',
      //   data: { order }
      // }).then(response => {
      //   console.log(response.data)
      // }).catch(error => {
      //   console.error(error)
      // })

      const orderVo = {
        userId: this.userId,
        storeBatchId: this.ordersIdList,
        storeId: this.storeList[this.activeStoreNum].storeId
      }
      axios({
        url: '/admin/offline/corder',
        method: 'post',
        data: Qs.stringify(orderVo)
      }).then((jsondata) => {
        console.log('下单:', jsondata)
        if (jsondata.code === '200') {
          // 成功之后跳转到详情页面，准备支付
          this.$router.push({
            path: '/store/offline/order/details',
            query: {
              resultList: this.orderList,
              result: jsondata.data
            }
          })
        }
      })
    },
    clearOrder () {
      this.orderList = []
      this.ordersIdList = []
      this.amount = 0
    },
    handleOrderAdd (index, row) {
      console.log('handleOrderAdd')
      console.log('index:', index)
      console.log('row:', row)
      console.log('添加')
      this.orderList[index].purchaseQuantity++
      console.log(' row.purchaseQuantity:', row.purchaseQuantity)
      console.log('操作完成:', this.orderList)
      ++this.menuKey
      // 添加
      this.ordersIdList.push(row.storeBatchId)
      console.log('添加this.ordersIdList:', this.ordersIdList)
      this.amount = this.amount + row.drugRetailPrice
      // this.amount = parseFloat((this.amount + row.drugRetailPrice).toFixed(2))
      console.log('this.amount:', this.amount)
    },
    handleOrderRemove (index, row) {
      console.log('删除')
      this.ordersIdList.splice(this.ordersIdList.indexOf(row.storeBatchId), 1)
      console.log('添加this.ordersIdList:', this.ordersIdList)
      this.amount = this.amount - row.drugRetailPrice
      // this.amount = parseFloat((this.amount + row.drugRetailPrice).toFixed(2))
      console.log('this.amount:', this.amount)
      if (this.orderList[index].purchaseQuantity === 1) {
        console.log('当前剩余1件,执行删除')
        this.orderList.splice(index, 1)
      } else {
        this.orderList[index].purchaseQuantity = row.purchaseQuantity - 1
      }
      ++this.menuKey
    },
    handleAdd (index, row) {
      console.log('index:', index)
      console.log('row:', row)
      if (!this.orderList.includes(row)) {
        row.purchaseQuantity = 1
        this.orderList.push(row)
        console.log('this.orderList:', this.orderList)
        this.ordersIdList.push(row.storeBatchId)
        console.log('添加this.ordersIdList:', this.ordersIdList)
        this.amount = this.amount + row.drugRetailPrice
        // this.amount = parseFloat((this.amount + row.drugRetailPrice).toFixed(2))
        console.log('this.amount:', this.amount)
      } else {
        this.$message('已经添加')
      }
    },
    getSearchList () {
      console.log('this.activeStoreId:', this.activeStoreId)
      console.log('this.select:', this.select)
      console.log('this.inputText:', this.inputText)
      axios({
        method: 'get',
        url: '/admin/offline',
        params: {
          'mode': this.select,
          'input': this.inputText,
          'storeId': this.activeStoreId,
          'current': this.pageInfo.current,
          'size': this.pageInfo.size
        }
      }).then((jsondata) => {
        console.log('搜索结果:', jsondata)
        this.resultList = jsondata.data.records
        this.pageInfo = jsondata.data
      })
    },
    chooseStore () {
      if (this.previousTab !== this.activeStoreNum) {
        console.log('有变化,订单清空')
        this.orderList = []
        this.orderIdList = []
        this.amount = 0
      } else {
        console.log('没有变化')
      }
      this.previousTab = this.activeStoreNum
      console.log('activeStoreNum:', this.activeStoreNum)
      // 更新当前店铺的id
      console.log('activeStoreNum:', this.activeStoreNum)
      console.log('this.storeList[this.activeStoreNum]:', this.storeList[this.activeStoreNum])
      this.activeStoreId = this.storeList[this.activeStoreNum].storeId
      console.log('activeStoreId:', this.activeStoreId)
      //   this.getStoreBatchList()
      this.getSearchList()
    },
    async getStoreList () {
      try {
        await axios.get('/admin/store').then(jsondata => {
          this.storeList = jsondata.data
          this.activeStoreId = this.storeList[this.activeStoreNum].storeId
          this.previousTab = this.activeStoreNum
          console.log('获取店铺list:', jsondata)
        })
      } catch (error) {
        console.log(error)
      }
      this.getSearchList()
    }, // 分页调整
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getSearchList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getSearchList()
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.shop {
  flex: 1;
}

.operate {
  flex: 19;
  display: flex;
}

.container {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.chooseDrug {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.leftTop {
  flex: 19;
  background-color: lightblue;
}

.leftBottom {
  flex: 1;
  background-color: chocolate;
}

.order {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.orderDetail {
  flex: 19;
  background-color: lightgreen;
}

.orderOperate {
  flex: 1;
  background-color: lightyellow;
}
</style>
