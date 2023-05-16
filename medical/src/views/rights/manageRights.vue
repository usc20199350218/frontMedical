<template>
  <div class="manageRight">
    <el-table :data="rightList.filter(
      (data) =>
        !search ||
        data.rightText.toLowerCase().includes(search.toLowerCase())
    )
      " fit stripe style="width: 100%">
      <el-table-column label="rightId" prop="rightId"></el-table-column>
      <el-table-column label="rightText" prop="rightText"></el-table-column>
      <el-table-column label="rightType" prop="rightType"></el-table-column>
      <el-table-column label="rightUrl" prop="rightUrl"></el-table-column>
      <el-table-column label="rightParentId" prop="rightParentId">
      </el-table-column>
      <el-table-column align="left">
        <template slot="header" slot-scope="rightList">
          <el-col :span="14">
            <el-input v-if="rightList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>

          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowTag">添加
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-dialog :visible.sync="dialogFormVisible" title="新权限">
        <el-form ref="newRight" :model="newRight" :rules="rules" class="demo-newRight" label-width="100px">
          <el-form-item label="菜单标题" prop="rightText">
            <el-input v-model="newRight.rightText"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="rightType">
            <el-select v-model="newRight.rightType" placeholder="请选择菜单类型">
              <el-option :value="0" label="父菜单"></el-option>
              <el-option :value="1" label="子菜单"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="newRight.rightType == '1'" label="菜单路径" prop="rightText">
            <el-input v-model="newRight.rightUrl"></el-input>
          </el-form-item>

          <el-form-item v-if="newRight.rightType == '1'" label="父菜单" prop="rightType">
            <el-select v-model="newRight.rightParentId" placeholder="请选择父菜单">
              <el-option v-for="rightParent in rightParentList" :key="rightParent.rightId"
                         :label="rightParent.rightText"
                         :value="rightParent.rightId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是菜单" prop="delivery">
            <el-switch v-model="newRight.rightMenu"></el-switch>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="newRight.roleId">
              <el-checkbox-button v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{
                role.roleName }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(1)">取 消</el-button>
          <el-button type="primary" @click="addRight('newRight')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :visible.sync="dialogFormVisibles" title="修改权限">
        <el-form ref="newRight" :model="changeRight" :rules="rules" class="demo-newRight" label-width="100px">
          <el-form-item label="菜单标题" prop="rightText">
            <el-input v-model="changeRight.rightText"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="rightType">
            <el-select v-model="changeRight.rightType" placeholder="请选择菜单类型">
              <el-option :value="0" label="父菜单"></el-option>
              <el-option :value="1" label="子菜单"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="changeRight.rightType == '1'" label="菜单路径" prop="rightText">
            <el-input v-model="changeRight.rightUrl"></el-input>
          </el-form-item>

          <el-form-item v-if="changeRight.rightType == '1'" label="父菜单" prop="rightType">
            <el-select v-model="changeRight.rightParentId" placeholder="请选择父菜单">
              <el-option v-for="rightParent in rightParentList" :key="rightParent.rightId"
                         :label="rightParent.rightText"
                         :value="rightParent.rightId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是菜单" prop="delivery">
            <el-switch v-model="changeRight.rightMenu"></el-switch>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="changeRight.roleId">
              <el-checkbox-button v-for="role in roleList" :key="role.roleId" :label="role.roleId">
                {{ role.roleName }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(2)">取 消</el-button>
          <el-button type="primary" @click="changeRight_btn('newRight')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog :title="showTitle" :visible.sync="showEdit">
        <el-form ref="right" :model="right" :rules="rules" class="demo-newRight" label-width="100px">
          <el-form-item label="菜单标题" prop="rightText">
            <el-input v-model="right.rightText"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="rightType">
            <el-select v-model="right.rightType" placeholder="请选择菜单类型">
              <el-option :value="0" label="父菜单"></el-option>
              <el-option :value="1" label="子菜单"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="right.rightType == '1'" label="菜单路径" prop="rightText">
            <el-input v-model="right.rightUrl"></el-input>
          </el-form-item>

          <el-form-item v-if="right.rightType == '1'" label="父菜单" prop="rightType">
            <el-select v-model="right.rightParentId" placeholder="请选择父菜单">
              <el-option v-for="rightParent in rightParentList" :key="rightParent.rightId"
                         :label="rightParent.rightText"
                         :value="rightParent.rightId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是菜单" prop="delivery">
            <el-switch v-model="right.rightMenu"></el-switch>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="right.roleId">
              <el-checkbox-button v-for="role in roleList" :key="role.roleId" :label="role.roleId">
                {{ role.roleName }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="right = { roleId: [] }, showEdit = false, getAllRightList()">取 消</el-button>
          <el-button type="primary" @click="submit('right')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import axios from '../../utils/request'
import Login from '../Login.vue'

export default {
  components: {Login},
  data () {
    return {
      rightList: [],
      showTitle: '详情',
      showEdit: false,
      right: {roleId: []},

      rightParentList: [],
      search: '',
      dialogFormVisible: false,
      dialogFormVisibles: false,
      roleList: [],
      zcd: '1',
      showClose: 'false',
      closeOnClickModal: ' false',
      newRight: {
        roleId: [],
        rightText: '',
        rightType: '',
        rightUrl: '',
        rightParentId: 0,
        rightMenu: true
      },
      changeRight: {
        roleId: [],
        rightText: '',
        rightType: '',
        rightUrl: '',
        rightParentId: 0,
        rightMenu: true
      },
      rules: {
        rightText: [
          {required: true, message: '请输入菜单标题', trigger: 'blur'},
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        rightType: [
          {required: true, message: '请选择菜单类型', trigger: 'change'}
        ],
        rightUrl: [
          {
            required: true,
            message: '请输入以‘/’开头的菜单路径',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 初始化时，获取全部权限
    this.getAllRightList()
  },
  methods: {
    submit (formName) {
      console.log('right:', this.right)

      if (this.right.rightType === '0') {
        this.right.rightParentId = 0
        console.log('这是父菜单，父菜单没有父菜单，已经归零')
      }
      this.$refs[formName].validate((valid) => {
        // TODO 修改菜单
        // 表单验证成功
        if (valid) {
          axios.post('/admin/right/save', Qs.stringify(this.right)).then((jsondata) => {
            console.log('save:', jsondata)
            if (jsondata.code === '200') {
              this.showEdit = false
              const h = this.$createElement
              this.$notify({
                title: '成功',
                message: h('i', {style: 'color: teal'}, '提交成功')
              })
              this.right = {
                roleId: []
              }
              this.getAllRightList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeClose () {
      this.getAllRightList()
    },
    noti (action) {
      // 通知
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
      this.getAllRightList()
    },
    closedialog (val) {
      // 关闭弹窗
      if (val === 1) {
        this.dialogFormVisible = false
      }
      if (val === 2) {
        this.dialogFormVisibles = false
      } else {
        this.dialogFormVisible = false
        this.dialogFormVisibles = false
      }
      // 重新获取全部权限
      this.getAllRightList()
    },
    addRight (formName) {
      // 添加权限

      // 检查父菜单的父菜单
      if (this.newRight.rightType === '0') {
        this.newRight.rightParentId = 0
        console.log('这是父菜单，父菜单没有父菜单，已经归零')
      }
      this.$refs[formName].validate((valid) => {
        // 表单验证成功
        if (valid) {
          axios({
            method: 'post',
            url: '/admin/right/addjson',
            data: this.newRight
          }).then((jsondata) => {
            console.log(jsondata)
            this.addroleRight()
            if (jsondata.code === '200') {
              this.noti('添加')
              this.closedialog(1)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.newRight = {
        roleId: [],
        rightText: '',
        rightType: '',
        rightUrl: '',
        rightParentId: 0,
        rightMenu: true
      }
    },
    changeRight_btn (formName) {
      // 添加权限

      // 检查父菜单的父菜单
      if (this.changeRight.rightType === '0') {
        this.changeRight.rightParentId = 0
        console.log('这是父菜单，父菜单没有父菜单，已经归零')
      }
      this.$refs[formName].validate((valid) => {
        // TODO 修改菜单
        // 表单验证成功
        if (valid) {
          axios({
            method: 'put',
            url: '/admin/right/',
            data: this.changeRight
          }).then((jsondata) => {
            console.log(jsondata)
            this.addroleRight()
            if (jsondata.code === '200') {
              this.noti('添加')
              this.closedialog(1)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.changeRight = {
        roleId: [],
        rightText: '',
        rightType: '',
        rightUrl: '',
        rightParentId: 0,
        rightMenu: true
      }
    },
    addShowTag () {
      // 获取父菜单列表（懒加载）
      this.getParentRightList()
      this.getAllRoleList()
      // 展示添加弹窗
      // this.dialogFormVisible = true
      this.right = {
        roleId: []
      }
      this.showTitle = '新增'
      this.showEdit = true
    },
    addroleRight () {
    },
    resetForm (formName) {
      // 重置
      this.$refs[formName].resetFields()
    },
    getAllRoleList () {
      axios({
        method: 'get',
        url: '/admin/role'
      }).then((jsondata) => {
        console.log('全部角色为：', jsondata)
        this.roleList = jsondata.data
      })
    },
    getParentRightList () {
      // 获取父菜单列表
      axios({
        method: 'get',
        url: '/admin/right/parent'
      }).then((jsondata) => {
        console.log('父菜单列表为：', jsondata)
        this.rightParentList = jsondata.data
      })
    },
    handleEdit (index, row) {
      // 获取父菜单列表（懒加载）
      this.getParentRightList()
      this.getAllRoleList()

      // this.changeRight = row
      console.log('row:', row)
      this.right = row
      this.showTitle = '修改'

      // this.dialogFormVisibles = true
      this.showEdit = true
    },
    handleDelete (index, row) {
      // 删除指定菜单
      axios({
        method: 'delete',
        url: `/admin/right/` + row.rightId
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
      this.getAllRightList()
    },
    getAllRightList () {
      // 获取全部菜单权限
      axios({
        method: 'get',
        url: '/admin/right'
      }).then((jsondata) => {
        console.log(jsondata)
        this.rightList = jsondata.data
      })
    }
  }
}
</script>

<style></style>
