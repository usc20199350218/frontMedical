<template>
  <div>
    <div>
      <div style="float: left;">
        <span>
          <span>店铺:</span>
          <el-select v-model="storeId" placeholder="请选择" @change="getStaffList()">
            <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId">
            </el-option>
          </el-select>
        </span>

        <span>
          <span>职位:</span>
          <el-select v-model="positionId" placeholder="请选择" @change="getStaffList()">
            <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName"
                       :value="item.positionId">
            </el-option>
          </el-select>
        </span>
        <el-button type="" @click="storeId = '', positionId = '', getStaffList()">重置</el-button>
      </div>
      <el-table :data="
        staffList.filter(
          (data) =>
            !search ||
            data.staffName.toLowerCase().includes(search.toLowerCase())
        )" fit mix-height="100" stripe style="width: 100%">
        <el-table-column fixed="left" label="职员ID" min-width="80px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.staffId }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="姓名" min-width="80px">
          <template slot-scope="staffList">
            <el-popover placement="top" trigger="hover">
              <p>用户名：{{ staffList.row.userName }}</p>
              <p>薪水: {{ staffList.row.actualSalary }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ staffList.row.userRealName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="店铺" min-width="80px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.storeName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="职位" min-width="80px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.positionName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="电话" min-width="80px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.userPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="职员状态" width="85px">
          <template slot-scope="staffList">
            <el-switch v-model="staffList.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66"
                       inactive-color="#ff4949" @change="stateChaged(staffList.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="性别" min-width="80px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.userGender }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="创建时间" min-width="90px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="更新时间" min-width="90px">
          <template slot-scope="staffList">
            <span style="margin-left: 10px">{{ staffList.row.modifiedTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" width="220px">
          <template slot="header" slot-scope="staffList">
            <el-col :span="14">
              <el-input v-if="staffList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
            </el-col>
            <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                       @click="handleAdd()">添加
            </el-button>
          </template>
          <template slot-scope="staffList">
            <el-button size="mini" @click="handleEdit(staffList.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(staffList.row)">删除</el-button>
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
      <el-dialog :visible.sync="showAdd" title="新增职员">
        <el-form ref="form" :model="staff" label-width="80px" size="mini">
          <el-form-item label="店铺">
            <el-select v-model="staff.storeId" placeholder="请选择" @change="getStaffList()">
              <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位">
            <el-col :span="10">
              <el-select v-model="staff.positionId" placeholder="请选择" @change="getStaffList()">
                <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName"
                           :value="item.positionId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户">
            <el-col :span="10">
              <el-select v-model="staff.userId" placeholder="请选择" @change="getStaffList()">
                <el-option v-for="item in userList" :key="item.userId" :label="item.userRealName" :value="item.userId">
                  {{ item.userId }}-{{ item.userName }}-{{ item.userRealName }}-{{ item.userPhone }}
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="工资">
            <el-col :span="10">
              <el-input v-model="staff.actualSalary" maxlength="10" show-word-limit type="text">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false, staff = {}">取 消</el-button>
          <el-button type="primary" @click="addItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :visible.sync="showUpd" title="编辑职员">
        <el-form ref="form" :model="staff" label-width="80px" size="mini">
          <el-form-item label="店铺">
            <el-select v-model="staff.storeId" placeholder="请选择" @change="getStaffList()">
              <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位">
            <el-col :span="10">
              <el-select v-model="staff.positionId" placeholder="请选择" @change="getStaffList()">
                <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName"
                           :value="item.positionId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户">
            <el-col :span="10">
              <el-select v-model="staff.userId" placeholder="请选择" @change="getStaffList()">
                <el-option v-for="item in userList" :key="item.userId" :label="item.userRealName" :value="item.userId">
                  {{ item.userId }}-{{ item.userName }}-{{ item.userRealName }}-{{ item.userPhone }}
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="工资">
            <el-col :span="10">
              <el-input v-model="staff.actualSalary" maxlength="10" show-word-limit type="text">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpd = false, staff = {}">取 消</el-button>
          <el-button type="primary" @click="updItem()">确 定</el-button>
        </div>
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
      staffList: [],
      storeId: '',
      positionId: '',
      staff: {},
      pageInfo: {current: 0, size: 5},
      storeList: [],
      positionList: [],
      showAdd: false,
      showUpd: false,
      userList: []
    }
  },
  created () {
    this.getStaffList()
    this.getStoreList()
    this.getPositionList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
    },
    getStaffList () {
      axios({
        method: 'get',
        url: '/admin/staff',
        params: {
          'storeId': this.storeId,
          'positionId': this.positionId,
          'current': this.pageInfo.current,
          'size': this.pageInfo.size
        }
      }).then(jsondata => {
        this.staffList = jsondata.data.records
        this.pageInfo = jsondata.data
        console.log('获取到的职员list:', this.staffList)
      })
    },
    getStoreList () {
      axios({
        method: 'get',
        url: '/admin/store'
      }).then(jsondata => {
        this.storeList = jsondata.data
        console.log('获取到的店铺列表:', this.storeList)
      })
    },
    getPositionList () {
      axios({
        method: 'get',
        url: '/admin/position'
      }).then(jsondata => {
        this.positionList = jsondata.data
        console.log('获取到的职位列表:', this.positionList)
      })
    },
    usersStateChaged (row) {

    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getStaffList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getStaffList()
    },
    handleAdd () {
      // this.getPositionList()
      // this.getStoreList()
      this.getUserList()
      this.staff = {}
      this.showAdd = true
    },
    getUserList () {
      axios({
        method: 'get',
        url: '/admin/user/staff'
      }).then(jsondata => {
        this.userList = jsondata.data
        console.log('获取到的员工list:', this.userList)
      })
    },
    handleEdit (row) {
      console.log('即将编辑:', row)
      this.getUserList()
      this.staff = row
      this.showUpd = true
    },
    addItem () {
      console.log('addItem即将添加的职员:', this.staff)
      axios({
        method: 'post',
        url: '/admin/staff',
        data: Qs.stringify(this.staff)
      }).then(jsondata => {
        console.log('添加结果:', jsondata)
        if (jsondata.code === '200') {
          this.staff = {}
          this.getStaffList()
          this.noti('添加')
          this.showAdd = false
        }
      })
    },
    updItem () {
      console.log('addItem即将更新的职员:', this.staff)
      axios({
        method: 'put',
        url: '/admin/staff',
        data: Qs.stringify(this.staff)
      }).then(jsondata => {
        console.log('更新结果:', jsondata)
        if (jsondata.code === '200') {
          this.staff = {}
          this.getStaffList()
          this.noti('更新')
          this.showUpd = false
        }
      })
    },
    handleDelete (row) {
      console.log('即将删除:', row)
      axios({
        method: 'delete',
        url: `/admin/staff/` + row.staffId
      }).then(jsondata => {
        console.log('删除结果', jsondata)
        if (jsondata.code === '200') {
          this.getStaffList()
          this.noti('删除')
        }
      })
    }
  }
}
</script>

<style>
span + span {
  margin-left: 100px;
}
</style>
