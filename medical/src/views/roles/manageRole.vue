<template>
  <div class="manageRole">
    <el-table :data="
      roleList.filter(
        (data) =>
          !search || data.roleName.toLowerCase().includes(search.toLowerCase())
      )
    " :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" fit stripe style="width: 100%">
      <el-table-column label="角色Id" prop="roleId"></el-table-column>
      <el-table-column label="角色名" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="modifiedTime"></el-table-column>
      <el-table-column align="left">
        <template slot="header" slot-scope="roleList">
          <el-col :span="14">
            <el-input v-if="roleList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>
          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowdialog">添加
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog :visible.sync="dialogFormVisible" title="新数据">
        <el-form ref="form" label-width="80px" size="mini">
          <el-form-item label="角色名">
            <el-input v-model="roleName" maxlength="20" placeholder="请输入角色名" show-word-limit type="text">
            </el-input>
          </el-form-item>
          <el-form-item label="赋权">
            <el-tree
              ref="action_tree"
              :data="rightList"
              :default-checked-keys=this.default_checked_keys
              :default-expanded-keys=default_checked_keys
              :props=defaultProps
              default-expand-all
              node-key="rightId"
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="addItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog :visible.sync="dialogFormVisibles" title="修改数据">
        <el-form ref="form" :model="role" label-width="80px" size="mini">
          <el-form-item label="角色名称">
            <el-col :span="10">
              <el-input v-model="role.roleName" maxlength="20" show-word-limit type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree ref="action_tree" :data="rightList" :default-checked-keys="this.default_checked_keys" :default-expanded-keys="default_checked_keys" :props="defaultProps"
                     default-expand-all node-key="rightId"
                     show-checkbox>
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
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
      roleList: [],
      dialogFormVisible: false,
      dialogFormVisibles: false,
      roleName: '',
      value: [1, 4],
      rightList: [],
      roleRight: {},
      tbRightList: {},
      default_checked_keys: [],
      defaultProps: {
        children: 'rightList',
        label: 'rightText'
      },
      role: {}
    }
  },
  created () {
    this.getRoleList()
  },

  methods: {
    updItem () {
      // this.temp = this.$refs.tree.getCheckedNodes()
      // this.roleRight.rightList = this.$refs.tree.getCheckedNodes()
      // Qs.stringify(this.roleRight)
      // console.log(this.roleRight)
      // 点击确定后,就需要把勾选的rightid传给后端,注意根和儿子都要传到后端
      // 这里会有一个半选和全选的坑
      // 1获取选择的儿子节点
      let childrenNodes = this.$refs.action_tree.getCheckedKeys()
      console.log('选中的儿子节点:' + childrenNodes)

      let rootChildrenNodes = this.$refs.action_tree.getHalfCheckedKeys()
      console.log('选中的根节点:' + rootChildrenNodes)
      // 儿子节点和父节点一起合并
      let allNodes = [...childrenNodes, ...rootChildrenNodes]
      console.log('选中的所有节点:' + allNodes)
      axios({
        method: 'post',
        url: '/admin/role/rrupdate',
        data: {
          roleId: this.role.roleId,
          roleName: this.role.roleName,
          rightIds: allNodes
        }
      }).then((jsondata) => {
        console.log(jsondata)
      })
    },
    getAllRightTreeList () {
      axios({
        method: 'post',
        url: '/admin/right/selecttree'
      }).then((jsondata2) => {
        console.log('全部权限：', jsondata2)
        this.rightAllList = jsondata2.data
        this.default_checked_keys = jsondata2.data
      })
    },
    getRightDTO (role) {
      axios({
        method: 'post',
        url: '/admin/right/selecttreeId',
        data: Qs.stringify(role)
      }).then((jsondata) => {
        console.log('角色对应权限：', jsondata)
        this.rightList = jsondata.data
      })
    },
    closedialog (val) {
      this.roleName = ''

      if (val === 1) {
        this.dialogFormVisible = false
      }
      if (val === 2) {
        this.dialogFormVisibles = false
      } else {
        this.dialogFormVisible = false
        this.dialogFormVisibles = false
      }
    },
    addShowdialog () {
      this.dialogFormVisible = true
      this.getAllRight()
    },
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
      this.roleRight.rightList = this.$refs.tree.getCheckedNodes()
    },
    addItem () {
      // this.temp = this.$refs.tree.getCheckedNodes()
      // this.roleRight.rightList = this.$refs.tree.getCheckedNodes()
      // Qs.stringify(this.roleRight)
      // console.log(this.roleRight)
      // 点击确定后,就需要把勾选的rightid传给后端,注意根和儿子都要传到后端
      // 这里会有一个半选和全选的坑
      // 1获取选择的儿子节点
      let childrenNodes = this.$refs.action_tree.getCheckedKeys()
      console.log('选中的儿子节点:' + childrenNodes)

      let rootChildrenNodes = this.$refs.action_tree.getHalfCheckedKeys()
      console.log('选中的根节点:' + rootChildrenNodes)
      // 儿子节点和父节点一起合并
      let allNodes = [...childrenNodes, ...rootChildrenNodes]
      console.log('选中的所有节点:' + allNodes)
      axios({
        method: 'post',
        url: '/admin/role/addjson',
        data: {
          roleName: this.roleName,
          rightIds: allNodes
        }
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          this.noti('更新')
          this.closedialog(1)
          this.getRoleList()
        }
      })
    },

    getAllRight () {
      axios({
        method: 'get',
        url: '/admin/right/tree'
      }).then((jsondata2) => {
        console.log(jsondata2)
        this.rightList = jsondata2.data
        this.default_checked_keys = jsondata2.data
      })
    },

    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
    },
    getRoleList () {
      axios({
        method: 'get',
        url: '/admin/role'
      }).then((jsondata) => {
        console.log(jsondata)
        this.roleList = jsondata.data
      })
    },

    handleEdit (index, row) {
      // console.log(index, row)
      console.log(index)
      console.log(row)
      // this.$router.push('/movie/edit')
      let objData = JSON.stringify(row)
      this.$router.push({
        path: '/role/edit',
        query: {allData: encodeURIComponent(objData)}
      })
      // this.role = row
      // console.log(row)
      // this.getRightDTO(row.roleId)
      // this.getAllRightTreeList()
      // this.dialogFormVisibles = true
    }
  }
}
</script>

<style></style>
