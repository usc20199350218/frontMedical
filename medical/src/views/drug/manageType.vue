<template>
    <div>
        <div>
            <el-table :data="
                typeList.filter(
                    (data) =>
                        !search ||
                        data.positionName.toLowerCase().includes(search.toLowerCase())
                )
            " fit stripe mix-height="100" style="width: 100%">
                <el-table-column label="品类ID" min-width="80px" fixed="left">
                    <template slot-scope="typeList">
                        <span style="margin-left: 10px">{{ typeList.row.typeId }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品类" min-width="80px" fixed="left">
                    <template slot-scope="typeList">
                        <span style="margin-left: 10px">{{ typeList.row.typeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="85px" fixed="left">
                    <template slot-scope="typeList">
                        <el-switch v-model="typeList.row.typeStatus" :active-value="1" :inactive-value="0"
                            active-color="#13ce66" inactive-color="#ff4949" @change="updItem(typeList.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建" min-width="80px" fixed="left">
                    <template slot-scope="typeList">
                        <span style="margin-left: 10px">{{ typeList.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新" min-width="80px" fixed="left">
                    <template slot-scope="typeList">
                        <span style="margin-left: 10px">{{ typeList.row.modifiedTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" width="220px" fixed="right">
                    <template slot="header" slot-scope="typeList">
                        <el-col :span="14">
                            <el-input v-model="search" size="mini" v-if="typeList" placeholder="输入关键字搜索" />
                        </el-col>
                        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
                            @click="showAddF()">添加</el-button>
                    </template>
                    <template slot-scope="typeList">
                        <el-button size="mini" @click="handleEdit(typeList.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(typeList.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog :title="tit" :visible.sync="showDialog">
                <el-form ref="form" :model="type" label-width="100px" size="mini">
                    <el-form-item label="品类名称）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入名称）" show-word-limit
                                v-model="type.typeName">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="状态" prop="delivery">
                        <el-switch v-model="type.typeStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false, type = {}, tit = ''">取 消</el-button>
                    <el-button type="primary" @click="clickItem()">确 定</el-button>
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
      typeList: [],
      showDialog: false,
      type: {},
      tit: ''
    }
  },
  created () {
    // 初始化数据
    this.getTypeList()
  },
  methods: {
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
    },
    // 1.获取列表
    getTypeList () {
      axios({
        method: 'get',
        url: '/admin/type'
      }).then(jsondata => {
        this.typeList = jsondata.data
        console.log('获取到的品类list:', this.typeList)
      })
    },
    // 2.新增按钮
    showAddF () {
      this.tit = '新增'
      // 清理
      this.type = {}
      // 开启弹窗
      this.showDialog = true
    },
    addItem () {
      axios.post('/admin/type', Qs.stringify(this.type)).then(jsondata => {
        console.log('新增:', jsondata)
        if (jsondata.code === '200') {
          this.showDialog = false
          this.getTypeList()
          this.noti('新增' + this.type.typeName)
          this.type = {}
        }
      })
    },
    updItem (row) {
      axios.put('/admin/type', Qs.stringify(row)).then(jsondata => {
        console.log('upd', jsondata)
        if (jsondata.code === '200') {
          this.showDialog = false
          this.getTypeList()
          this.noti('更新' + row.typeName)
          this.type = {}
        }
      })
    },
    clickItem () {
      if (this.tit === '新增') {
        console.log('触发新增')
        this.addItem()
      } else {
        console.log('触发修改')
        this.updItem(this.type)
      }
      console.log('此时:', this.type)
    },
    handleEdit (row) {
      console.log('修改:', row)
      this.type = row
      this.tit = '修改'
      this.showDialog = true
    },
    handleDelete (row) {
      axios.delete(`/admin/type/` + row.typeId).then(jsondata => {
        if (jsondata.code === '200') {
          this.getTypeList()
          this.noti('删除' + row.typeName)
        }
      })
    }
  }
}
</script>

<style></style>
