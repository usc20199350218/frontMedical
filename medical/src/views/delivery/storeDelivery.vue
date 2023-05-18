<template>
  <div>
    <div>
      <el-tabs v-model="activeStoreNum" type="card" @tab-click="chooseStore">
        <el-tab-pane v-for="(store, sindex ) in deliveryStatusList" :key="sindex" :label="store">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>

      <el-table :data="deliveryList.filter(
        (data) =>
          !search ||
          data.storeName.toLowerCase().includes(search.toLowerCase())
      )
        " fit mix-height="100" stripe style="width: 100%">
        <el-table-column fixed="left" label="配送Id" min-width="40px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.deliveryId }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="品名" min-width="80px">
          <template slot-scope="deliveryList">
            <el-popover placement="top" trigger="hover">
              <p>生产日期: {{ deliveryList.row.batchProductionDate }}</p>
              <p>保质期: {{ deliveryList.row.batchValidityPeriod }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ deliveryList.row.drugName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="品牌" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="处方" min-width="80px">
          <template slot-scope="deliveryList">
            <span v-if="deliveryList.row.isRx == '0'">非处方药</span>
            <span v-if="deliveryList.row.isRx == '1'">处方药</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="规格" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.drugSpecification }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="批次编号" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.batchNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="店内批次" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.batchNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="数量" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.deliveryNum }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="店铺" min-width="80px">
          <template slot-scope="deliveryList">
            <el-popover placement="top" trigger="hover">
              <!-- businessDistrict  area-->
              <p>区域: {{ deliveryList.row.area }}</p>
              <p>商圈: {{ deliveryList.row.businessDistrict }}</p>
              <p>电话: {{ deliveryList.row.contactPhone }}</p>
              <p>地址: {{ deliveryList.row.storeAddress }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ deliveryList.row.storeName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="电话" min-width="80px">
          <template slot-scope="deliveryList">
            <span style="margin-left: 10px">{{ deliveryList.row.contactPhone }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" width="220px">
          <template slot="header" slot-scope="deliveryList">
            <el-col :span="14">
              <el-input v-if="deliveryList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
            </el-col>
            <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                       @click="position = {}">添加
            </el-button>
          </template>
          <template slot-scope="deliveryList">
            <!-- 抢单 -->
            <el-button v-if="deliveryList.row.deliveryStatus === 'CREATED'" size="mini" type="primary"
                       @click="handleClick(deliveryList.row, 'PICKUP')">确认
            </el-button>
            <!-- 取货 -->
            <el-button v-if="deliveryList.row.deliveryStatus === 'PICKUP'" size="mini"
                       @click="handleClick(deliveryList.row, 'SHIP')">已取货
            </el-button>
            <el-button v-if="deliveryList.row.deliveryStatus === 'PICKUP'" size="mini" type="danger"
                       @click="handleClick(deliveryList.row, 'CREATED')">退回
            </el-button>
            <!-- 配送 -->
            <el-button v-if="deliveryList.row.deliveryStatus === 'SHIP'" size="mini"
                       @click="handleClick(deliveryList.row, 'ARRIVE')">到达
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination :current-page="pageInfo.current" :page-size="pageInfo.size"
                     :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :total="pageInfo.total"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import Qs from 'qs'
import mystore from '../../store'
import axios from '../../utils/request'

export default {
  data () {
    return {
      pageInfo: {current: 0, size: 5},
      search: '',
      deliveryList: [],
      deliveryStatusList: [],
      activeStoreId: '',
      activeStoreNum: 0,
      remarkShow: false,
      remarkText: '',
      activeTit: '',
      showDetail: false,
      storeBatchDetailList: [],
      searchNew: '',
      activeStoreName: '',
      activeStatus: '',
      userId: mystore.state.user.userId,
      user: mystore.state.user
    }
  },
  created () {
    this.getDeliveryStatusList()
    this.getDeliveryList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getDeliveryList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getDeliveryList()
    },
    async getDeliveryStatusList () {
      try {
        const response = await axios.get('/admin/delivery/status')
        this.deliveryStatusList = response.data
        console.log('jsondata', response)
        if (this.deliveryStatusList !== '') {
          console.log('获取配送状态list:', this.deliveryStatusList)
          // 执行获取当前状态对应数据方法
          await this.getDeliveryList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getDeliveryList () {
      try {
        //
        this.activeStatus = this.deliveryStatusList[this.activeStoreNum]
        console.log('此时查询的activeStoreNum为:', this.activeStoreNum)
        console.log('此时查询的activeStatus为:', this.activeStatus)
        this.activeStoreName = this.deliveryStatusList[this.activeStoreNum].storeName
        const jsondata = await axios.get('/admin/delivery/list',
          {
            params: {
              'userId': this.userId,
              'status': this.activeStatus,
              'current': this.pageInfo.current,
              'size': this.pageInfo.size
            }
          })
        console.log('jsondata:', jsondata)
        this.deliveryList = jsondata.data.records
        this.pageInfo = jsondata.data
        console.log('获取到的当前店铺请求的list:', this.deliveryList)
      } catch (error) {
        console.log(error)
      }
    },
    chooseStore () {
      console.log('activeStoreNum:', this.activeStoreNum)
      // 更新当前店铺的id
      console.log('activeStoreNum:', this.activeStoreNum)
      this.activeStoreName = this.deliveryStatusList[this.activeStoreNum].storeName
      console.log('this.deliveryStatusList[this.activeStoreNum]:', this.deliveryStatusList[this.activeStoreNum])
      this.activeStoreId = this.deliveryStatusList[this.activeStoreNum].storeId
      console.log('activeStoreId:', this.activeStoreId)
      this.getDeliveryList()
    },
    handleClick (row, status) {
      console.log('操作配送:', status, row)
      // 前端修改状态，然后后端对退回操作进行userId重置
      // this.activeDrugDetailId = row.drugDetailId
      console.log('row:', row)
      axios({
        method: 'put',
        url: '/admin/delivery',
        params: {
          deliveryId: row.deliveryId,
          deliveryStatus: status,
          userId: this.userId
        }
      }).then(
        jsondata => {
          console.log('click:', jsondata)
          this.getDeliveryList()
        }
      )
    },
    handleFail () {
      axios.put('/admin/store_batch/fast', {
        'applyIdList': this.activeApplyIdList, 'status': 'fail', 'remarkText': this.remarkText
      })
        .then(jsondata => {
          if (jsondata.code === '200') {
            this.remarkShow = false
            this.remarkText = ''
            this.activeDrugDetailId = ''
            this.activeApplyIdList = []
          }
        })
    },
    handleLook (index, row) {
      console.log('查看详情', row)
      // 获取当前店铺批次请求详情数据
      // put 版本可以传数组
      // axios.put('/admin/store_batch/list',
      // { 'applyIdList': row.applyIdList })
      // .then(jsondata => {
      // console.log(jsondata)
      // this.storeBatchDetailList = jsondata.data
      // })
      // 使用临时查询的方法

      axios({
        method: 'get',
        url: '/admin/store_batch/apply/details/external',
        params: {
          'storeId': this.deliveryStatusList[this.activeStoreNum].storeId,
          'drugDetailId': row.drugDetailId
        }
      }).then(jsondata => {
        this.storeBatchDetailList = jsondata.data
        console.log('获取的详情为:', this.storeBatchDetailList)
      })
      // 开启弹窗
      this.activeTit = this.activeStoreName + '_' + row.drugName
      this.showDetail = true
    },
    handleReturn (index, row) {
      console.log('退回', row)
    },
    detailClick (row, status) {
      console.log('row.storeBatchId:', row.storeBatchId)
      console.log('status:', status)
      axios({
        method: 'put',
        url: '/admin/store_batch/apply/change',
        params: {'storeBatchId': row.storeBatchId, 'storeBatchStatus': status}
      })
        .then(jsondata => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.noti('操作')
          }
        })
    }
  }
}
</script>

<style></style>
