<template>
  <div>
    <div>
      <!-- <el-table  :data="storeList" style="width: 100%" v-if="isReloadData"> -->
      <el-table :data="
        storeList.filter(
          (data) =>
            !search ||
            data.storeName.toLowerCase().includes(search.toLowerCase())
        )
      " fit stripe mix-height="100" style="width: 100%">
        <el-table-column label="店铺ID" min-width="50px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.storeId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" width="180" fixed="left">
          <template slot-scope="storeList">
            <el-popover trigger="hover" placement="top">
              <p>电话: {{ storeList.row.contactPhone }}</p>
              <p>地址: {{ storeList.row.storeAddress }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ storeList.row.storeName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="85px" fixed="left">
          <template slot-scope="storeList">
            <el-switch v-model="storeList.row.storeStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949" @change="storesStateChaged(storeList.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="营业时间" min-width="80px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.businessHours }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区域" min-width="80px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.area }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商圈" min-width="80px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.businessDistrict }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="80px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="80px" fixed="left">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.modifiedTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width="300px" fixed="right">
          <template slot="header" slot-scope="storeList">
            <el-col :span="14">
              <el-input v-model="search" size="mini" v-if="storeList" placeholder="输入关键字搜索" />
            </el-col>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
              @click="store = {}, showAdd = true">添加</el-button>
          </template>
          <template slot-scope="storeList">
            <el-button size="mini" @click="handleEdit(storeList.$index, storeList.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete( storeList.row)">删除</el-button>
            <el-button size="mini" @click="handleLookManager( storeList.row)">店长</el-button>
            <el-button size="mini" @click="handleLookStaff( storeList.row)">店员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog title="新增店铺" :visible.sync="showAdd">
        <el-form ref="form" :model="store" label-width="80px" size="mini">
          <el-form-item label="店铺名称">
            <el-col :span="10">
              <el-input type="textarea" maxlength="32" show-word-limit v-model="store.storeName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="电话">
            <el-col :span="10">
              <el-input type="text" maxlength="18" show-word-limit v-model="store.contactPhone"></el-input></el-col>
          </el-form-item>
          <el-form-item label="区域">
            <el-col :span="10">
              <el-input type="textarea" maxlength="32" show-word-limit v-model="store.area"></el-input></el-col>
          </el-form-item>
          <el-form-item label="商圈">
            <el-col :span="10">
              <el-input type="textarea" maxlength="250" show-word-limit
                v-model="store.businessDistrict"></el-input></el-col>
          </el-form-item>
          <el-form-item label="地址">
            <el-col :span="10">
              <el-input type="textarea" maxlength="250" show-word-limit v-model="store.storeAddress"></el-input></el-col>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-col :span="10">
              <el-input type="text" maxlength="10" placeholder="HH:mm-HH:mm" show-word-limit
                v-model="store.businessHours"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false, store = {}">取 消</el-button>
          <el-button type="primary" @click="addItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="更新店铺" :visible.sync="showUpd">
        <el-form ref="form" :model="store" label-width="80px" size="mini">
          <el-form-item label="店铺名称">
            <el-col :span="10">
              <el-input type="textarea" maxlength="32" show-word-limit v-model="store.storeName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="电话">
            <el-col :span="10">
              <el-input type="text" maxlength="18" show-word-limit v-model="store.contactPhone"></el-input></el-col>
          </el-form-item>
          <el-form-item label="区域">
            <el-col :span="10">
              <el-input type="textarea" maxlength="32" show-word-limit v-model="store.area"></el-input></el-col>
          </el-form-item>
          <el-form-item label="商圈">
            <el-col :span="10">
              <el-input type="textarea" maxlength="250" show-word-limit
                v-model="store.businessDistrict"></el-input></el-col>
          </el-form-item>
          <el-form-item label="地址">
            <el-col :span="10">
              <el-input type="textarea" maxlength="250" show-word-limit v-model="store.storeAddress"></el-input></el-col>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-col :span="10">
              <el-input type="text" maxlength="10" placeholder="HH:mm-HH:mm" show-word-limit
                v-model="store.businessHours"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpd = false, store = {}">取 消</el-button>
          <el-button type="primary" @click="updItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="staffTitle" :visible.sync="showAdd">

      </el-dialog>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import axios from '../../utils/request'
export default {
  data () {
    return {
      search: '',
      storeList: [],
      showAdd: false,
      store: {},
      showUpd: false,
      staffsList: [],
      staffTitle: '详情'
    }
  },
  created () {
    this.getStoreList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
    },
    getStoreList () {
      axios({
        method: 'get',
        url: '/admin/store'
      }).then(jsondata => {
        this.storeList = jsondata.data
        console.log('获取的店铺列表:', this.storeList)
      })
    },
    addItem () {
      console.log('addItem即将添加的店铺:', this.store)
      axios({
        method: 'post',
        url: '/admin/store',
        data: Qs.stringify(this.store)
      }).then(jsondata => {
        console.log('添加结果:', jsondata)
        if (jsondata.code === '200') {
          this.store = {}
          this.getStoreList()
          this.noti('添加')
          this.showAdd = false
        }
      })
    },
    handleEdit (index, row) {
      this.store = row
      this.showUpd = true
    },
    updItem () {
      console.log('updItem即将更新的店铺:', this.store)
      axios({
        method: 'put',
        url: '/admin/store',
        data: Qs.stringify(this.store)
      }).then(jsondata => {
        console.log('更新结果:', jsondata)
        if (jsondata.code === '200') {
          this.store = {}
          this.getStoreList()
          this.noti('更新')
          this.showUpd = false
        }
      })
    },
    storesStateChaged (row) {
      console.log('状态更新:', row)
      this.store = row
      this.updItem()
    },
    handleDelete (row) {
      axios({
        method: 'delete',
        url: `/admin/store/` + row.storeId
      }).then(jsondata => {
        console.log('删除结果:', jsondata)
        if (jsondata.code === '200') {
          this.getStoreList()
          this.noti('删除')
        }
      })
    },
    handleLookManager (row) {
      this.staffTitle = row.storeName + '店长'
      console.log('加载店长', row.storeId)
      axios({
        method: 'get',
        url: `/admin/staff/store/` + row.storeId
      }).then(jsondata => {
        console.log('获取店长结果:' + jsondata)
        if (jsondata.code === '200') {
          this.staffsList = jsondata.data
        }
      })
    },
    handleLookStaff (row) {
      console.log('加载店员', row.storeId)
    }
  }
}
</script>

<style></style>
