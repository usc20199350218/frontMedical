<template>
  <div class="editRole">
    <el-form ref="form" :model="role" label-width="80px" size="mini">
      <el-form-item label="角色名称">
        <el-col :span="10">
          <el-input v-model="role.roleName" maxlength="20" show-word-limit type="text"></el-input>
        </el-col>
        <!-- <el-button @click="showNode">showNode</el-button> -->
        <!-- {{default_checked_keys}} -->

        <!-- {{ defaultProps.children }} -->
      </el-form-item>
      <!-- <el-form-item label="菜单权限">
        <el-tree
          ref="action_tree"
          :data="rightList"
          show-checkbox
          default-expand-all
          node-key="rightId"
          :default-expanded-keys="default_checked_keys"
          :default-checked-keys="this.default_checked_keys"
          :props="defaultProps"
        >
        </el-tree>
      </el-form-item> -->
      <el-form-item label="菜单权限">
        <!-- <el-tree ref="action_tree" :data="rightList" :default-checked-keys="rightzjList" :props="defaultProps"
          default-expand-all :default-expanded-keys="default_checked_keys" node-key="rightId" show-checkbox>
         -->
        <el-tree ref="action_tree" :data="rightList" :default-checked-keys="rightzjList" :props="defaultProps"
          default-expand-all node-key="rightId" show-checkbox>
        </el-tree>
      </el-form-item>
      <el-button @click="chang">修改</el-button>
    </el-form>
  </div>
</template>

<script>
import Qs from 'qs'
import axios from '../../utils/request'

export default {
  data () {
    return {
      rightzjList: [],
      role: {},
      rightList: [],
      default_checked_keys: [],
      defaultProps: {
        children: 'rightList',
        label: 'rightText'
      },
      linshilists: []
    }
  },
  created () {
    this.initRole()
    this.getAllRightTreeList()
  },
  methods: {
    showNode () { console.log('123') },
    initRole () {
      if (this.$route.query.allData) {
        let formObj = decodeURIComponent(this.$route.query.allData)
        console.log(formObj)
        this.role = JSON.parse(formObj)
        this.getRightDTO(this.role)
      }
    },
    // getRightDTO (role) {
    //   axios({
    //     method: 'post',
    //     url: '/admin/right/selecttreeId',
    //     data: Qs.stringify(role)
    //   }).then((jsondata) => {
    //     console.log('角色对应权限：', jsondata)
    //     this.rightList = jsondata.data
    //   })
    // },
    // getAllRightTreeList () {
    //   axios({
    //     method: 'post',
    //     url: '/admin/right/selecttree'
    //   }).then((jsondata2) => {
    //     console.log('全部权限：', jsondata2)
    //     this.rightAllList = jsondata2.data
    //     this.default_checked_keys = jsondata2.data
    //   })
    // },
    getRightDTO (role) {
      this.rightzjList = []
      axios({
        method: 'post',
        url: '/admin/right/selectroletree',
        data: Qs.stringify(role)
      }).then((jsondata) => {
        console.log('角色对应权限：', jsondata)
        // 角色对应权限：
        // this.default_checked_keys = jsondata.data
        // for (var i = 0; i < this.default_checked_keys.length; i++) {
        //   this.rightzjList.push(this.default_checked_keys[i].rightId)
        //   if (this.default_checked_keys[i].rightList.length !== 0) {
        //     this.linshilists = this.default_checked_keys[i].rightList
        //     for (var x = 0; x < this.linshilists.length; x++) {
        //       this.rightzjList.push(this.linshilists.rightId)
        //     }
        //   }
        // }
        this.default_checked_keys = jsondata.data
        for (var i = 0; i < this.default_checked_keys.length; i++) {
          // this.rightzjList.push(this.default_checked_keys[i].rightId)
          if (this.default_checked_keys[i].rightList.length !== 0) {
            this.linshilists = this.default_checked_keys[i].rightList
            for (var x = 0; x < this.linshilists.length; x++) {
              console.log('添加', this.linshilists[x].rightI)
              this.rightzjList.push(this.linshilists[x].rightId)
            }
          }
        }
      })
    },
    getAllRightTreeList () {
      // axios({
      // method: 'post',
      // url: '/admin/right/selecttree'
      // })
      axios({
        method: 'get',
        url: '/admin/right/tree'
      })
        .then((jsondata2) => {
          console.log('全部权限：', jsondata2)
          this.rightList = jsondata2.data
        })
    },
    chang () {
      // this.temp = this.$refs.tree.getCheckedNodes()
      // this.roleRight.rightList = this.$refs.tree.getCheckedNodes()
      // Qs.stringify(this.roleRight)
      // console.log(this.roleRight)
      // 点击确定后,就需要把勾选的rightid传给后端,注意根和儿子都要传到后端
      // 这里会有一个半选和全选的坑
      // 1获取选择的儿子节点
      // 全选
      let childrenNodes = this.$refs.action_tree.getCheckedKeys()
      console.log('全选:' + childrenNodes)
      // 半选中的
      let rootChildrenNodes = this.$refs.action_tree.getHalfCheckedKeys()
      console.log('半选:' + rootChildrenNodes)
      // 儿子节点和父节点一起合并
      let allNodes = [...childrenNodes, ...rootChildrenNodes]
      console.log('选中的所有节点:' + allNodes)
      let data = {
        roleId: this.role.roleId,
        roleName: this.role.roleName,
        rightIds: [...childrenNodes, ...rootChildrenNodes]
      }
      axios({
        method: 'post',
        url: '/admin/role/update',
        data: Qs.stringify(data)
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push('/role/manage')
        }
      })
    }
  }
}
</script>

<style></style>
