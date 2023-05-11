<template>
  <div>
    <div>
      <el-row>
        <el-col :span="1"><el-button @click="back()">返回</el-button></el-col>
        <el-col :span="3"><span style="">{{ userRealName }}的记录</span></el-col>
      </el-row>
    </div>
    <div>
      <el-table :data="serviceList" style="width: 100%">
        <el-table-column label="Id">
          <template slot-scope="serviceList">
            <span>{{ serviceList.row.serviceId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状况">
          <template slot-scope="serviceList">
            <span v-if="serviceList.row.isNormal == '1'">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column label="最新">
          <template slot-scope="serviceList">
            <span v-if="serviceList.row.isLast === '1'">最新</span>
            <span v-else>旧数据</span>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="serviceList">
            <span>{{ serviceList.row.serviceDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="serviceList">
            <el-button size="mini" @click="enter(serviceList.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="del(serviceList.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
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
      userId: '',
      userRealName: '',
      pageInfo: { current: 0, size: 5 },
      serviceList: []
    }
  },
  created () {
    this.userId = this.$route.query.userId
    this.userRealName = this.$route.query.userRealName
    this.getServiceList()
  },
  methods: {
    del (val) {
      console.log(val)
      axios.delete('/api/service/' + val.serviceId).then((jsondata) => {
        console.log('删除', jsondata)

        this.getServiceList()
      })
    },
    enter (val) {
      console.log('查看', val.serviceId)
      this.$router.push({ path: '/service/detail',
        query: { userId: val.userId, serviceId: val.serviceId, userRealName: this.userRealName } })
    },
    back () {
      this.$router.push('/service/user')
    },
    getServiceList () {
      axios.get('/api/service/page/' + this.userId, {
        params: {
          current: this.pageInfo.current, size: this.pageInfo.size
        }
      }).then((jsondata) => {
        console.log('搜索结果', jsondata)
        this.serviceList = jsondata.data.records
        this.pageInfo = jsondata.data
      })
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getServiceList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getServiceList()
    }
  }
}
</script>

<style></style>
