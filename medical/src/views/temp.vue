<template>
    <div>
        <el-table :data="
            positionList.filter(
                (data) =>
                    !search ||
                    data.positionName.toLowerCase().includes(search.toLowerCase())
            )
        " fit stripe mix-height="100" style="width: 100%">
            <el-table-column label="用户ID" min-width="80px" fixed="left">
                <template slot-scope="positionList">
                    <span style="margin-left: 10px">{{ positionList.row.userId }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户状态" width="85px">
                <template slot-scope="positionList">
                    <el-switch v-model="positionList.row.userStatus" :active-value="1" :inactive-value="0"
                        active-color="#13ce66" inactive-color="#ff4949" @change="usersStateChaged(positionList.row)">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column align="left" width="220px" fixed="right">
                <template slot="header" slot-scope="positionList">
                    <el-col :span="14">
                        <el-input v-model="search" size="mini" v-if="positionList" placeholder="输入关键字搜索" />
                    </el-col>
                    <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
                        @click="position = {}">添加</el-button>
                </template>
                <!-- <template slot-scope="positionList">
            <el-button size="mini" @click="handleEdit(positionList.$index, positionList.row)">编辑</el-button>
<el-button size="mini" type="danger"  @click="handleDelete(positionList.$index, positionList.row)">删除</el-button>
          </template> -->
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
// import Qs from 'qs'
import axios from '../../utils/request'
export default {
  data () {
    return {
      search: '',
      positionList: []
    }
  },
  created () {
    this.getPositionList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
    },
    getPositionList () {
      axios({
        method: 'get',
        url: '/admin/position'
      }).then(jsondata => {
        this.positionList = jsondata.data
        console.log('获取到的职位list:', this.positionList)
      })
    },
    usersStateChaged (row) {

    }
  }
}
</script>

<style></style>
