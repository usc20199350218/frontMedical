<template>
  <div>
    <div>
      <el-tabs v-model="activeStoreNum" type="card" @tab-click="chooseStore">
        <el-tab-pane v-for="(store, sindex ) in storeList" :key="sindex" :label="store.storeName">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>

      <el-table :data="
        applyBatchList.filter(
          (data) =>
            !search ||
            data.positionName.toLowerCase().includes(search.toLowerCase())
        )
      " fit stripe mix-height="100" style="width: 100%">
        <el-table-column label="药品详情ID" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugDetailId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品名" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处方" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span v-if="applyBatchList.row.isRx == '0'">非处方药</span>
            <span v-if="applyBatchList.row.isRx == '1'">处方药</span>
          </template>
        </el-table-column>
        <el-table-column label="品类" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.drugSpecification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请数量" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalCreated }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用数量" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalSold }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计结余" min-width="80px" fixed="left">
          <template slot-scope="applyBatchList">
            <span style="margin-left: 10px">{{ applyBatchList.row.totalBalance }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" width="220px" fixed="right">
          <template slot="header" slot-scope="applyBatchList">
            <el-col :span="14">
              <el-input v-model="search" size="mini" v-if="applyBatchList" placeholder="输入关键字搜索" />
            </el-col>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
              @click="position = {}">添加</el-button>
          </template>
          <template slot-scope="applyBatchList">
            <!-- <el-button size="mini" @click="handlePass(applyBatchList.$index, applyBatchList.row)">通过</el-button>
                        <el-button size="mini" @click="handleLook(applyBatchList.$index, applyBatchList.row)">详情</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleReturn(applyBatchList.$index, applyBatchList.row)">退回</el-button> -->
            <el-button size="mini" @click="handleClick(applyBatchList.row, 'pass')">通过</el-button>
            <el-button size="mini" @click="handleLook(applyBatchList.$index, applyBatchList.row)">详情</el-button>
            <el-button size="mini" type="danger" @click="handleClick(applyBatchList.row, 'fail')">退回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="添加备注" :visible.sync="remarkShow">
        <el-form ref="form"  label-width="100px" size="mini">
          <el-form-item label="备注">
            <el-col>
              <el-input type="text" maxlength="999" placeholder="备注" show-word-limit v-model="remarkText"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="remarkShow = false,this.activeApplyIdList =[], remarkText = ''">取 消</el-button>
          <el-button type="primary" @click="handleFail() ">确 定</el-button>
        </div>
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
      search: '',
      applyBatchList: [],
      storeList: [],
      activeStoreId: '',
      activeStoreNum: 0,
      remarkShow: false,
      remarkText: ''
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
      console.log('this.storeList[this.activeStoreNum]:', this.storeList[this.activeStoreNum])
      this.activeStoreId = this.storeList[this.activeStoreNum].storeId
      console.log('activeStoreId:', this.activeStoreId)
      this.getApplyBatchList()
    },
    handlePass (index, row) { },
    handleClick (row, status) {
      console.log(status, row)
      if (status === 'fail') {
        this.activeApplyIdList = row.applyIdList
        this.remarkShow = true
      } else {
        axios.put('/admin/store_batch/fast', { 'applyIdList': row.applyIdList, 'status': status })
      }
    },
    handleFail () {
      axios.put('/admin/store_batch/fast', { 'applyIdList': this.activeApplyIdList, 'status': 'fail', 'remarkText': this.remarkText })
        .then(jsondata => {
          if (jsondata.code === '200') {
            this.remarkShow = false
            this.remarkText = ''
            this.activeApplyIdList = []
          }
        })
    },
    handleLook (index, row) {
      console.log('查看详情', row)
    },
    handleReturn (index, row) {
      console.log('退回', row)
    }
  }
}
</script>

<style></style>
