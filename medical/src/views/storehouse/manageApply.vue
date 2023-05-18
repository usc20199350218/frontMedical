<template>
  <div>
    <div>
      <el-tabs v-model="activeStoreNum" type="card" @tab-click="chooseStore">
        <el-tab-pane v-for="(store, sindex ) in storeList" :key="sindex" :label="store.storeName">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>

      <el-table :data="applyBatchList.filter(
        (data) =>
          !search ||
          data.positionName.toLowerCase().includes(search.toLowerCase())
      )
        " fit mix-height="100" stripe style="width: 100%">
        <el-table-column fixed="left" label="药品详情ID" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugDetailId }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="品名" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="品牌" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="处方" min-width="80px">
          <template slot-scope="applyBatchList">
            <span v-if="applyBatchList.row.isRx == '0'">非处方药</span>
            <span v-if="applyBatchList.row.isRx == '1'">处方药</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="品类" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="规格" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugSpecification }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="申请数量" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalCreated }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="可用数量" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalSold }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="预计结余" min-width="80px">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalBalance }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" width="220px">
          <template slot="header" slot-scope="applyBatchList">
            <el-col :span="14">
              <el-input v-if="applyBatchList" v-model="search" placeholder="输入关键字搜索" size="mini" />
            </el-col>
            <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary" @click="position = {}">添加
            </el-button>
          </template>
          <template slot-scope="applyBatchList">
            <el-button size="mini" @click="handleClick(applyBatchList.row, 'pass')">通过</el-button>
            <el-button size="mini" @click="handleLook(applyBatchList.$index, applyBatchList.row)">详情</el-button>
            <el-button size="mini" type="danger" @click="handleClick(applyBatchList.row, 'fail')">退回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog :visible.sync="remarkShow" title="添加备注">
        <el-form ref="form" label-width="100px" size="mini">
          <el-form-item label="备注">
            <el-col>
              <el-input v-model="remarkText" maxlength="999" placeholder="备注" show-word-limit type="text"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="remarkShow = false, this.activeApplyIdList = [], remarkText = ''">取 消</el-button>
          <el-button type="primary" @click="handleFail()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="activeTit" :visible.sync="showDetail">
        <el-table :data="storeBatchDetailList.filter(
          (data) =>
            !searchNew ||
            data.batchId == searchNew
        )
          " fit mix-height="100" stripe style="width: 100%">
          <el-table-column fixed="left" label="店内批次Id" min-width="80px">
            <template slot-scope="storeBatchDetailList">
              <span style="margin-left: 10px">{{ storeBatchDetailList.row.storeBatchId }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="申请数量" min-width="80px">
            <template slot-scope="storeBatchDetailList">
              <span style="margin-left: 10px">{{ storeBatchDetailList.row.totalCreated }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="可用数量" min-width="80px">
            <template slot-scope="storeBatchDetailList">
              <span style="margin-left: 10px">{{ storeBatchDetailList.row.totalSold }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="预计结余" min-width="80px">
            <template slot-scope="storeBatchDetailList">
              <span style="margin-left: 10px">{{ storeBatchDetailList.row.totalBalance }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" fixed="right" width="220px">
            <template slot="header" slot-scope="applyBatchList">
              <el-col :span="14">
                <el-input v-if="applyBatchList" v-model="search" placeholder="输入关键字搜索" size="mini" />
              </el-col>
              <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary" @click="position = {}">添加
              </el-button>
            </template>
            <template slot-scope="applyBatchList">
              <el-button size="mini" @click="detailClick(applyBatchList.row, 'pass')">通过</el-button>
              <el-button size="mini" type="danger" @click="detailClick(applyBatchList.row, 'fail')">退回</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import Qs from 'qs'
import axios from '../../utils/request'

export default {
  data () {
    return {
      refreshKey: 0,
      search: '',
      applyBatchList: [],
      storeList: [],
      activeStoreId: '',
      activeStoreNum: 0,
      remarkShow: false,
      remarkText: '',
      activeTit: '',
      showDetail: false,
      storeBatchDetailList: [],
      searchNew: '',
      activeStoreName: '',
      activeDrug: {}
    }
  },
  created () {
    this.getStoreList()
    this.getApplyBatchList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
    },
    // async getStoreList () {
    //   try {
    //     const response = await axios.get('/admin/store/apply')
    //     this.storeList = response.data
    //     console.log('jsondata', response)
    //     if (this.storeList !== '') {
    //       console.log('获取店铺list:', this.storeList)
    //       // 执行获取当前店铺对应请求方法
    //       await this.getApplyBatchList()
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    // getApplyBatchList () {
    //   this.activeStoreId = this.storeList[this.activeStoreNum].storeId
    //   console.log('此时查询的activeStoreNum为:', this.activeStoreNum)
    //   console.log('此时查询的storeId为:', this.activeStoreId)
    //   axios({
    //     method: 'get',
    //     url: `/admin/store_batch/apply/` + this.activeStoreId
    //   }).then(jsondata => {
    //     this.applyBatchList = jsondata.data
    //     console.log('获取到的当前店铺请求的list:', this.applyBatchList)
    //   })
    // },
    async getStoreList () {
      try {
        const response = await axios.get('/admin/store/apply')
        this.storeList = response.data
        console.log('jsondata', response)
        if (this.storeList !== '') {
          console.log('获取店铺list:', this.storeList)
          // 执行获取当前店铺对应请求方法
          await this.getApplyBatchList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getApplyBatchList () {
      try {
        this.activeStoreId = this.storeList[this.activeStoreNum].storeId
        console.log('此时查询的activeStoreNum为:', this.activeStoreNum)
        console.log('此时查询的storeId为:', this.activeStoreId)
        this.activeStoreName = this.storeList[this.activeStoreNum].storeName
        const jsondata = await axios.get(`/admin/store_batch/apply/${this.activeStoreId}`)
        this.applyBatchList = jsondata.data
        console.log('获取到的当前店铺请求的list:', this.applyBatchList)
      } catch (error) {
        console.log(error)
      }
    },
    chooseStore () {
      console.log('activeStoreNum:', this.activeStoreNum)
      // 更新当前店铺的id
      console.log('activeStoreNum:', this.activeStoreNum)
      this.activeStoreName = this.storeList[this.activeStoreNum].storeName
      console.log('this.storeList[this.activeStoreNum]:', this.storeList[this.activeStoreNum])
      this.activeStoreId = this.storeList[this.activeStoreNum].storeId
      console.log('activeStoreId:', this.activeStoreId)
      this.getApplyBatchList()
    },
    handleClick (row, status) {
      console.log(status, row)
      if (status === 'fail') {
        this.activeApplyIdList = row.applyIdList
        this.remarkShow = true
      } else {
        this.activeDrugDetailId = row.drugDetailId
        axios.put('/admin/store_batch/fast', {
          'applyIdList': row.applyIdList,
          'status': status,
          'drugDetailId': this.activeDrugDetailId
        }).then((jsondata) => {
          if (jsondata.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
      }
      // 刷新
      this.getApplyBatchList()
      // this.refreshKey++
      // location.reload()
    },
    handleFail () {
      axios.put('/admin/store_batch/fast', {
        'applyIdList': this.activeApplyIdList, 'status': 'fail', 'remarkText': this.remarkText
      })
        .then(jsondata => {
          if (jsondata.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
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

      // axios({
      //   method: 'get',
      //   url: '/admin/store_batch/apply/details/external',
      //   params: {
      //     'storeId': this.storeList[this.activeStoreNum].storeId,
      //     'drugDetailId': row.drugDetailId
      //   }
      // }).then(jsondata => {
      //   this.storeBatchDetailList = jsondata.data
      //   console.log('获取的详情为:', this.storeBatchDetailList)
      // })
      this.activeDrug = row
      this.getData()
      // 开启弹窗
      this.activeTit = this.activeStoreName + '_' + row.drugName
      this.showDetail = true
    },
    getData () {
      axios({
        method: 'get',
        url: '/admin/store_batch/apply/details/external',
        params: {
          'storeId': this.storeList[this.activeStoreNum].storeId,
          'drugDetailId': this.activeDrug.drugDetailId
        }
      }).then(jsondata => {
        this.storeBatchDetailList = jsondata.data
        console.log('获取的详情为:', this.storeBatchDetailList)
      })
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
        params: { 'storeBatchId': row.storeBatchId, 'storeBatchStatus': status }
      })
        .then(jsondata => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getData()
          }
        })
    }
  }
}
</script>

<style></style>
