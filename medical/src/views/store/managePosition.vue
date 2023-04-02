<template>
    <div>
        <div>
            <el-table :data="
                positionList.filter(
                    (data) =>
                        !search ||
                        data.positionName.toLowerCase().includes(search.toLowerCase())
                )
            " fit stripe mix-height="100" style="width: 100%">
                <el-table-column label="职位ID" min-width="80px" fixed="left">
                    <template slot-scope="positionList">
                        <span style="margin-left: 10px">{{ positionList.row.positionId }}</span>
                    </template>
                </el-table-column>

                <!-- <el-table-column label="用户状态" width="85px">
                <template slot-scope="positionList">
                    <el-switch v-model="positionList.row.userStatus" :active-value="1" :inactive-value="0"
                        active-color="#13ce66" inactive-color="#ff4949" @change="usersStateChaged(positionList.row)">
                    </el-switch>
                </template>
            </el-table-column> -->
                <el-table-column label="职位名称" min-width="80px" fixed="left">
                    <template slot-scope="positionList">
                        <el-popover trigger="hover" placement="top">
                            <p>职责: {{  positionList.row.responsibility }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ positionList.row.positionName }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="标准薪水" min-width="80px" fixed="left">
                    <template slot-scope="positionList">
                        <span style="margin-left: 10px">{{ positionList.row.salary }}</span>

                    </template>
                </el-table-column>
                <el-table-column label="创建时间" min-width="80px" fixed="left">
                    <template slot-scope="positionList">
                        <span style="margin-left: 10px">{{ positionList.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" min-width="80px" fixed="left">
                    <template slot-scope="positionList">
                        <span style="margin-left: 10px">{{ positionList.row.modifiedTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" width="220px" fixed="right">
                    <template slot="header" slot-scope="positionList">
                        <el-col :span="14">
                            <el-input v-model="search" size="mini" v-if="positionList" placeholder="输入关键字搜索" />
                        </el-col>
                        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
                            @click="position = {}, showAdd = true">添加</el-button>
                    </template>
                    <template slot-scope="positionList">
                        <el-button size="mini" @click="handleEdit(positionList.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(positionList.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog title="新增职位" :visible.sync="showAdd">
                <el-form ref="form" :model="position" label-width="80px" size="mini">
                    <el-form-item label="职位名称">
                        <el-col :span="10">
                            <el-input type="textarea" maxlength="32" show-word-limit
                                v-model="position.positionName"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="标准薪水">
                        <el-col :span="10">
                            <el-input type="text" maxlength="10" show-word-limit
                                v-model="position.salary"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="职责">
                        <el-col :span="10">
                            <el-input type="textarea" maxlength="32" show-word-limit
                                v-model="position.responsibility"></el-input></el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAdd = false, position = {}">取 消</el-button>
                    <el-button type="primary" @click="addItem()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="新增职位" :visible.sync="showUpd">
                <el-form ref="form" :model="position" label-width="80px" size="mini">
                    <el-form-item label="职位名称">
                        <el-col :span="10">
                            <el-input type="textarea" maxlength="32" show-word-limit
                                v-model="position.positionName"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="标准薪水">
                        <el-col :span="10">
                            <el-input type="text" maxlength="10" show-word-limit
                                v-model="position.salary"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="职责">
                        <el-col :span="10">
                            <el-input type="textarea" maxlength="32" show-word-limit
                                v-model="position.responsibility"></el-input></el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAdd = false, position = {}">取 消</el-button>
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
      positionList: [],
      showAdd: false,
      position: {},
      showUpd: false
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
    handleEdit (row) {
      console.log('即将编辑:', row)
      this.position = row
      this.showUpd = true
    },
    handleDelete (row) {
      console.log('即将删除:', row)
      axios({
        method: 'delete',
        url: `/admin/position/` + row.positionId
      }).then(jsondata => {
        console.log('删除结果', jsondata)
        if (jsondata.code === '200') {
          this.getPositionList()
          this.noti('删除')
        }
      })
    },
    addItem () {
      console.log('addItem即将添加的店铺:', this.position)
      axios({
        method: 'post',
        url: '/admin/position',
        data: Qs.stringify(this.position)
      }).then(jsondata => {
        console.log('添加结果:', jsondata)
        if (jsondata.code === '200') {
          this.position = {}
          this.getPositionList()
          this.noti('添加')
          this.showAdd = false
        }
      })
    },
    updItem () {
      console.log('addItem即将修改的店铺:', this.position)
      axios({
        method: 'put',
        url: '/admin/position',
        data: Qs.stringify(this.position)
      }).then(jsondata => {
        console.log('修改结果:', jsondata)
        if (jsondata.code === '200') {
          this.position = {}
          this.getPositionList()
          this.noti('修改')
          this.showUpd = false
        }
      })
    }
  }
}
</script>

<style></style>
