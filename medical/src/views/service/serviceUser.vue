<template>
  <div>
    <!-- 服务表的设置可以同类于体检表，记录体检信息 -->
    <!-- 当前页面设计的意义在于提供一个服务前的用户查询功能，
        查询之后跳转到服务详情，可以查看编辑，使用限制输入来限制用户是否可以编辑，
        编辑之后要按保存按钮才能更新，如果不保存则默认丢失，
        关于表的设计，首先是用户表提供基础信息，
        然后是服务表作为这里的主表，
        然后关联一张明细条目表，提供依据，
        之后是另外一张明细详情表，map的风格(记录明细详情id、明细条目id、服务id、用户id、是否最新、更新时间、详情) -->
    <div>
      <el-input v-model="userValue" class="input-with-select" placeholder="请输入内容">
        <el-select slot="prepend" v-model="userField" placeholder="请选择" style="width: 150px;">
          <el-option label="用户真实姓名" value="realName"></el-option>
          <el-option label="用户电话" value="phone"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchUser()"> 搜索</el-button>
      </el-input>
    </div>
    <div>
      <el-table :data="userList" style="width: 100%">
        <el-table-column label="用户Id">
          <template slot-scope="userList">
            <span style="margin-left: 10px">{{ userList.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="userList">
            <el-popover placement="top" trigger="hover">
              <p>姓名: {{ userList.row.userRealName }}</p>
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
            <span v-if="userList.row.userVip === '0'">非vip</span>
            <span v-if="userList.row.userVip !== '0'" style="margin-left: 10px">{{ userList.row.userVip
            }}级</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="userList">
            <el-button size="mini" @click="enterList(userList.row)">查看</el-button>
            <!-- <el-button size="mini" @click="enter(userList.row)">最新</el-button> -->
            <el-button size="mini" @click="enter(userList.row)">新建</el-button>
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
  </div>
</template>

<script>
import axios from '../../utils/request'

export default {
  data () {
    return {
      userValue: '',
      userField: 'realName',
      chooseUserStart: true,
      userLabel: '',
      userList: [],
      search: '',
      pageInfo: {current: 0, size: 5}
    }
  },
  created () {
    this.searchUser()
  },
  methods: {
    enterList (val) {
      console.log('查看历史数据', val)
      this.$router.push({path: '/service/choose', query: {userId: val.userId, userRealName: val.userRealName}})
    },
    enter (val) {
      console.log('新增', val)
      this.$router.push({path: '/service/detail', query: {userId: val.userId}})
    },
    searchUser () {
      axios({
        method: 'get',
        url: '/admin/user/search',
        params: {
          searchType: this.userField,
          searchText: this.userValue,
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        this.userList = jsondata.data.records
        this.pageInfo = jsondata.data
        console.log('jsondata', jsondata)
        if (this.userList.length !== 0) {
          this.showSelectUser = true
        } else {
          this.$message({
            showClose: true,
            message: '搜索结果为空',
            type: 'error'
          })
        }
      })
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.searchUser()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.searchUser()
    }
  }
}
</script>

<style></style>
