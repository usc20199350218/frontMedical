<template>
  <div>
    <div>
      <!-- <el-table  :data="storeList" style="width: 100%" v-if="isReloadData"> -->
      <el-table :data="storeList.filter(
        (data) =>
          !search ||
          data.storeName.toLowerCase().includes(search.toLowerCase())
      )
        " fit mix-height="100" stripe style="width: 100%">
        <el-table-column fixed="left" label="店铺ID" min-width="50px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.storeId }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="店铺照片" min-width="50px">
          <template slot-scope="storeList">
            <!-- <span style="margin-left: 10px">{{ storeList.row.storeId }}</span> -->
            <img :src="storeList.row.storePath" alt="图片" height="100px" />
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="店铺名称" width="180">
          <template slot-scope="storeList">
            <el-popover placement="top" trigger="hover">
              <p>电话: {{ storeList.row.contactPhone }}</p>
              <p>地址: {{ storeList.row.storeAddress }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ storeList.row.storeName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="状态" width="85px">
          <template slot-scope="storeList">
            <el-switch v-model="storeList.row.storeStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949" @change="storesStateChaged(storeList.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="营业时间" min-width="80px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.businessHours }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="区域" min-width="80px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.area }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="商圈" min-width="80px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.businessDistrict }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="创建时间" min-width="80px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="更新时间" min-width="80px">
          <template slot-scope="storeList">
            <span style="margin-left: 10px">{{ storeList.row.modifiedTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" fixed="right" width="300px">
          <template slot="header" slot-scope="storeList">
            <el-col :span="14">
              <el-input v-if="storeList" v-model="search" placeholder="输入关键字搜索" size="mini" />
            </el-col>
            <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
              @click="store = {}, showAdd = true">添加
            </el-button>
          </template>
          <template slot-scope="storeList">
            <el-button size="mini" @click="handleEdit(storeList.$index, storeList.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(storeList.row)">删除</el-button>
            <el-button size="mini" @click="handleLookManager(storeList.row)">店长</el-button>
            <el-button size="mini" @click="handleLookStaff(storeList.row)">店员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog :visible.sync="showAdd" title="新增店铺">
        <el-form ref="form" :model="store" label-width="80px" size="mini">
          <el-form-item label="店铺名称">
            <el-col :span="10">
              <el-input v-model="store.storeName" maxlength="32" show-word-limit></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="照片上传">
            <!-- <el-col> -->
            <el-upload :file="fileList" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="filesuccess"
              action="http://localhost:8088/api/upload?module=storepath" class="upload-demo" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件且不超过500kb
              </div>
            </el-upload>
            <el-input v-model="store.storePath" placeholder="照片路径，copy" type="text"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-col :span="10">
              <el-input v-model="store.contactPhone" maxlength="18" show-word-limit type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="区域">
            <el-col :span="10">
              <el-input v-model="store.area" maxlength="32" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="商圈">
            <el-col :span="10">
              <el-input v-model="store.businessDistrict" maxlength="250" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="地址">
            <el-col :span="10">
              <el-input v-model="store.storeAddress" maxlength="250" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-col :span="10">
              <el-input v-model="store.businessHours" maxlength="10" placeholder="HH:mm-HH:mm" show-word-limit
                type="text"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false, store = {}">取 消</el-button>
          <el-button type="primary" @click="addItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :visible.sync="showUpd" title="更新店铺">
        <el-form ref="form" :model="store" label-width="80px" size="mini">
          <el-form-item label="店铺名称">
            <el-col :span="10">
              <el-input v-model="store.storeName" maxlength="32" show-word-limit></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="照片上传">
            <!-- <el-col> -->
            <el-upload :file="fileList" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="filesuccess"
              action="http://localhost:8088/api/upload?module=storepath" class="upload-demo" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件且不超过500kb
              </div>
            </el-upload>
            <el-input v-model="store.storePath" placeholder="照片路径，copy" type="text"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-col :span="10">
              <el-input v-model="store.contactPhone" maxlength="18" show-word-limit type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="区域">
            <el-col :span="10">
              <el-input v-model="store.area" maxlength="32" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="商圈">
            <el-col :span="10">
              <el-input v-model="store.businessDistrict" maxlength="250" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="地址">
            <el-col :span="10">
              <el-input v-model="store.storeAddress" maxlength="250" show-word-limit type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-col :span="10">
              <el-input v-model="store.businessHours" maxlength="10" placeholder="HH:mm-HH:mm" show-word-limit
                type="text"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpd = false, store = {}">取 消</el-button>
          <el-button type="primary" @click="updItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- <div>
      <el-dialog :title="staffTitle" :visible.sync="showAdd">

      </el-dialog>
    </div> -->
    <div>
      <el-dialog :title="staffTitle" :visible.sync="showStaffs">
        <el-table :data="staffsList" style="width: 100%">
          <el-table-column label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.userAvatarUrl" style="width: 100px;" />
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="180">
            <template slot-scope="scope">
              <el-popover placement="top" trigger="hover">
                <p>姓名: {{ scope.row.userName }}</p>
                <p>住址: {{ scope.row.userRealName }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userRealName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="薪水" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.actualSalary }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <span> {{ scope.row.userPhone }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作"> -->
            <!-- <template slot-scope="scope"> -->
              <!-- <el-button size="mini" @click="handleEditStaff(scope.$index, scope.row)">编辑</el-button> -->
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            <!-- </template> -->
          <!-- </el-table-column> -->
        </el-table>
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
      staffTitle: '详情',
      showStaffs: false,
      fileList: '',
      showUpdStaff: false
    }
  },
  created () {
    this.getStoreList()
  },
  methods: {
    handleEditStaff (index, row) {
      this.showUpdStaff = true
    },
    filesuccess (response, file, fileList) {
      console.log(response)
      if (response.data !== null) {
        this.noti('上传')
      }
      this.store.storePath = response.data

      // console.log(file)
      // console.log(fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
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
        url: `/admin/staff/店长/` + row.storeId
      }).then(jsondata => {
        console.log('获取店长结果:', jsondata)
        if (jsondata.code === '200') {
          this.staffsList = jsondata.data
          this.showStaffs = true
        }
      })
    },
    handleLookStaff (row) {
      this.staffTitle = row.storeName + '店员'
      console.log('加载店员', row.storeId)
      axios({
        method: 'get',
        url: `/admin/staff/店员/` + row.storeId
      }).then(jsondata => {
        console.log('获取店员结果:', jsondata)
        if (jsondata.code === '200') {
          this.staffsList = jsondata.data
          this.showStaffs = true
        }
      })
    }
  }
}
</script>

<style></style>
