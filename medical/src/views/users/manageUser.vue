<template>
  <div>
    <div>
      <el-input v-model="searchText" class="input-with-select" placeholder="请输入内容">
        <el-select slot="prepend" v-model="userGender" placeholder="请选择性别" style="width: 150px;"
                   @change="getUsersList()">
          <el-option v-for="item in ['男女', '男', '女', '未知']" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-select slot="prepend" v-model="userStatus" placeholder="请选择状态"
                   style="padding-left: 30px; width: 150px;"
                   @change="getUsersList()">
          <el-option key="" value="">全部</el-option>
          <el-option :value="1" label="有效"></el-option>
          <el-option :value="0" label="无效"></el-option>
        </el-select>
        <el-select slot="prepend" v-model="userVip" placeholder="请选择vip" style="padding-left: 30px; width: 150px;"
                   @change="getUsersList()">
          <el-option key="" value="">全部</el-option>
          <el-option :value="1" label="Vip"></el-option>
          <el-option :value="0" label="无"></el-option>
        </el-select>
        <el-select slot="prepend" v-model="roleId" placeholder="请选择角色" style="padding-left: 30px; width: 150px;"
                   @change="getUsersList()">
          <el-option key="" value="">全部</el-option>
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName"
                     :value="item.roleId"></el-option>
        </el-select>
        <el-select slot="prepend" v-model="searchMethod" placeholder="请选择搜索方式"
                   style="padding-left: 30px; width: 150px;"
                   @change="getUsersList()">
          <el-option label="用户名称" value="userName"></el-option>
          <el-option label="姓名" value="userRealName"></el-option>
          <el-option label="手机号" value="userPhone"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getUsersList()">搜索</el-button>
        <el-button slot="append" icon="el-icon-switch-button" @click="clean()">重置</el-button>
      </el-input>
    </div>

    <el-table :data="usersList.filter(
      (data) =>
        !search ||
        data.userName.toLowerCase().includes(search.toLowerCase())
    )
      " fit mix-height="100" stripe style="width: 100%">
      <el-table-column fixed="left" label="用户ID" min-width="80px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="头像" min-width="150px">
        <template slot-scope="usersList">
          <img v-if="usersList.row.userAvatarUrl !== ''" :src="usersList.row.userAvatarUrl" alt="头像" width="100px"/>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="姓名" min-width="150px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userRealName }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="用户名" min-width="150px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" min-width="125px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" min-width="125px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userBirthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="60px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.userGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="85px">
        <template slot-scope="usersList">
          <el-switch v-model="usersList.row.userStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     inactive-color="#ff4949" @change="usersStateChaged(usersList.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="用户Vip" width="80px">
        <template slot-scope="usersList">
          <span v-if="usersList.row.userVip == 1">是</span>
          <span v-if="usersList.row.userVip == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" width="80px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户创建日期" width="180px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{ usersList.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户更新日期" width="180px">
        <template slot-scope="usersList">
          <span style="margin-left: 10px">{{
              usersList.row.modifiedTime
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed="right" min-width="320px">
        <template slot="header" slot-scope="usersList">
          <el-col :span="14">
            <el-input v-if="usersList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>
          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowdialog">添加
          </el-button>
        </template>
        <template slot-scope="usersList">
          <el-button size="mini" @click="handleReset(usersList.$index, usersList.row)">重置密码</el-button>
          <el-button size="mini" @click="handleEdit(usersList.$index, usersList.row)">编辑</el-button>
          <el-button v-if="usersList.row.userStatus === 1" size="mini" type="warning"
                     @click="handleOffLine(usersList.$index, usersList.row)">封禁
          </el-button>
          <el-button v-if="usersList.row.userStatus === 0" size="mini" type="primary"
                     @click="handleOnLine(usersList.$index, usersList.row)">解禁
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(usersList.$index, usersList.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div>
      <el-dialog title="新用户" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="user" label-width="80px" size="mini">
          <el-form-item label="用户名">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入用户名" show-word-limit
                v-model="user.userName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="密码">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入密码" show-word-limit
                v-model="user.userPassword"></el-input></el-col>
          </el-form-item>
          <el-form-item label="手机号">
            <el-col>
              <el-input type="text" maxlength="11" placeholder="请输入手机号" show-word-limit
                v-model="user.userPhone"></el-input></el-col>
          </el-form-item>
          <el-form-item label="昵称">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入昵称" show-word-limit
                v-model="user.userNickName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入真实姓名" show-word-limit
                v-model="user.userRealName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="头像上传">
            <el-col>
              <el-upload class="upload-demo" action="http://localhost:8088/api/upload?module=userpath"
                :on-preview="handlePreview" :on-remove="handleRemove" :file="fileList" :on-success="filesuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件且不超过500kb
                </div>
              </el-upload>
            </el-col>
            <el-input type="text" placeholder="头像路径，copy" v-model="user.userAvatarUrl"></el-input>
          </el-form-item>
          <el-form-item label="生日" align="left">
            <el-date-picker v-model="user.userBirthday" type="date" placeholder="创建日期" align="right" style="width: 30%"
              value-format="yyyy-MM-dd" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别">
            <el-col>
              <el-select v-model="user.userGender" placeholder="请选择用户性别">
                <el-option v-for="item in ['男', '女', '未知']" :key="item.value" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-col>
              <el-select v-model="user.userStatus" placeholder="请选择用户状态">
                <el-option label="有效" :value="1"></el-option>
                <el-option label="无效" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="用户Vip">
            <el-col>
              <el-select v-model="user.userVip" placeholder="请选择vip">
                <el-option label="Vip" :value="1"></el-option>
                <el-option label="无" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-col>
              <el-select v-model="user.roleId" placeholder="请选择">
                <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="addItem">确 定</el-button>
        </div>
      </el-dialog>
    </div> -->

    <!-- <div>
      <el-dialog title="修改数据" :visible.sync="dialogFormVisibles">
        <el-form ref="form" :model="user" label-width="80px" size="mini">
          <el-form-item label="用户名">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入用户名" show-word-limit
                v-model="user.userName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="手机号">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入密码" show-word-limit
                v-model="user.userPhone"></el-input></el-col>
          </el-form-item>
          <el-form-item label="昵称">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入昵称" show-word-limit
                v-model="user.userNickName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入真实姓名" show-word-limit
                v-model="user.userRealName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="头像上传">
            <el-col>
              <el-upload class="upload-demo" action="http://localhost:8088/api/upload?module=userpath"
                :on-preview="handlePreview" :on-remove="handleRemove" :file="fileList" :on-success="filesuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件且不超过500kb
                </div>
              </el-upload>
              <el-input type="text" placeholder="头像路径，copy" v-model="user.userAvatarUrl"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="生日" align="left">
            <el-date-picker v-model="user.userBirthday" type="date" placeholder="创建日期" align="right" style="width: 30%"
              value-format="yyyy-MM-dd" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别">
            <el-col>
              <el-select v-model="user.userGender" placeholder="请选择用户性别">
                <el-option v-for="item in ['男', '女', '未知']" :key="item.value" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-col>
              <el-select v-model="user.userStatus" placeholder="请选择状态">
                <el-option label="有效" :value="1"></el-option>
                <el-option label="无效" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="用户Vip">
            <el-col>
              <el-select v-model="user.userVip" placeholder="请选择Vip">
                <el-option label="Vip" :value="1"></el-option>
                <el-option label="无" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-col>
              <el-select v-model="user.roleId" placeholder="请选择">
                <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div> -->

    <div class="block">
      <el-pagination :current-page="pageInfo.current" :page-size="pageInfo.size"
                     :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :total="pageInfo.total"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <div>
      <el-dialog :title="showTitle" :visible.sync="showEdit">
        <el-form ref="form" :model="user" label-width="80px" size="mini">
          <el-form-item label="用户名">
            <!-- <el-col> -->
            <el-input v-model="user.userName" maxlength="20" placeholder="请输入用户名" show-word-limit
                      type="text"></el-input>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="手机号">
            <!-- <el-col> -->
            <el-input v-model="user.userPhone" maxlength="11" placeholder="请输入手机号" show-word-limit
                      type="text"></el-input>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="昵称">
            <!-- <el-col> -->
            <el-input v-model="user.userNickName" maxlength="20" placeholder="请输入昵称" show-word-limit
                      type="text"></el-input>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="真实姓名">
            <!-- <el-col> -->
            <el-input v-model="user.userRealName" maxlength="20" placeholder="请输入真实姓名" show-word-limit
                      type="text"></el-input>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="头像上传">
            <!-- <el-col> -->
            <el-upload :file="fileList" :on-preview="handlePreview"
                       :on-remove="handleRemove" :on-success="filesuccess"
                       action="http://localhost:8088/api/upload?module=userpath" class="upload-demo"
                       list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件且不超过500kb
              </div>
            </el-upload>
            <!-- </el-col> -->
            <el-input v-model="user.userAvatarUrl" placeholder="头像路径，copy" type="text"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="user.userBirthday" :picker-options="pickerOptions" placeholder="创建日期"
                            type="date"
                            value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别">
            <!-- <el-col> -->
            <el-select v-model="user.userGender" placeholder="请选择用户性别">
              <el-option v-for="item in ['男', '女', '未知']" :key="item.value" :label="item" :value="item">
              </el-option>
            </el-select>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="用户状态">
            <!-- <el-col> -->
            <el-select v-model="user.userStatus" placeholder="请选择用户状态">
              <el-option :value="1" label="有效"></el-option>
              <el-option :value="0" label="无效"></el-option>
            </el-select>
            <!-- </el-col> -->
          </el-form-item>

          <el-form-item label="用户Vip">
            <!-- <el-col :span="5"> -->
            <!-- <el-col> -->
            <el-select v-model="user.userVip" placeholder="请选择vip">
              <el-option :value="1" label="Vip"></el-option>
              <el-option :value="0" label="无"></el-option>
            </el-select>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="用户类型">
            <!-- <el-col> -->
            <el-select v-model="user.roleId" placeholder="请选择">
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
              </el-option>
            </el-select>
            <!-- </el-col> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEdit = false, getUsersList(), user = {}">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
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
      showTitle: '详情',
      showEdit: false,
      pageInfo: {current: 0, size: 5},
      currentPage: 4,
      search: '',
      isReloadData: true,
      dialogFormVisible: false,
      dialogFormVisibles: false,
      usersList: [],
      fileList: '',
      user: {
        userName: '',
        userPassword: '',
        userProvince: '',
        userWxId: '',
        userWxNickname: ''
      },
      roleList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '明天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '后天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一月后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      searchText: '',
      searchMethod: 'userRealName',
      roleId: '',
      userVip: '',
      userGender: '男女',
      userStatus: ''
    }
  },

  created () {
    // 先获取全部用户
    this.getRoleList()
    this.getUsersList()
  },
  methods: {
    handleReset (index, row) {
      axios.put(`/admin/user/reset/` + row.userId).then((jsondata) => {
        console.log('重置密码', jsondata)
        if (jsondata.code === '200') {
          this.noti('重置密码')
        }
        this.getUsersList()
      })
    },
    clean () {
      this.searchText = ''
      this.searchMethod = 'userRealName'
      this.roleId = ''
      this.userVip = ''
      this.userGender = '男女'
      this.userStatus = ''
      this.getUsersList()
    },
    save () {
      // 通过配置文件设置密码
      console.log('user:', this.user)
      axios.post('/admin/user/save', Qs.stringify(this.user)).then((jsondata) => {
        console.log('save:', jsondata)
        if (jsondata.code === '200') {
          this.noti('save')
          this.showEdit = false
          this.user = {}
          this.fileList = []
        }
      })
    },
    updItem () {
      console.log(this.user)
      axios({
        method: 'put',
        url: '/admin/user',
        data: Qs.stringify(this.user)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(2)
            this.noti('提交')
          }
        })
        .then(console.error())
    },
    addItem () {
      axios({
        method: 'post',
        url: '/admin/user',
        data: Qs.stringify(this.user)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(1)
            this.noti('提交')
          }
        })
        .then(console.error())
    },
    closedialog (val) {
      this.user = {}
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
      // this.dialogFormVisible = true
      this.showEdit = true
      this.getRoleList()
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 文件上传成功时的钩子
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    filesuccess (response, file, fileList) {
      console.log(response)
      if (response.data !== null) {
        this.noti('上传')
      }
      this.user.userAvatarUrl = response.data

      // console.log(file)
      // console.log(fileList)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    getRoleList () {
      axios({
        method: 'get',
        url: '/admin/role/'
      })
        .then((jsondata) => {
          console.log('获取到的全部角色为：', jsondata.data)
          this.roleList = jsondata.data
        })
        .then(console.error())
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getUsersList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getUsersList()
    },
    showAddUsers () {
      alert('add')
    },
    usersStateChaged (item) {
      console.log('change', item)
      if (item.userStatus === 0) {
        console.log('change to 0')
        this.handleOffLine(0, item)
      }
      if (item.userStatus === 1) {
        console.log('change to 1')
        this.handleOnLine(0, item)
      }
    },
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '操作成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
      // location.reload()
      // this.getUsersList()
    },
    getUsersList () {
      // 获取用户分页列表
      axios({
        method: 'get',
        // url: '/admin/user/findpage',
        url: '/admin/user/page',
        params: {
          searchText: this.searchText,
          searchMethod: this.searchMethod,
          roleId: this.roleId,
          userVip: this.userVip,
          userGender: this.userGender,
          userStatus: this.userStatus,
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        this.usersList = jsondata.data.records
        console.log('userList:', jsondata.data.records)
        this.pageInfo = jsondata.data
        // console.log(jsondata.data[0].usersDetail)
      })
    },
    handleEdit (index, row) {
      this.fileList = []
      // console.log(index, row)
      console.log(index)
      console.log(row)
      // this.$router.push('/users/edit')
      // let objData = JSON.stringify(row)
      // this.$router.push({
      //   path: '/users/edit',
      //   query: { allData: encodeURIComponent(objData) }
      // })
      this.user = row
      this.getRoleList()
      // this.dialogFormVisibles = true
      this.showEdit = true
    },
    handleDelete (index, row) {
      axios({
        method: 'delete',
        url: `/admin/user/` + row.userId
      })
        .then((jsondata) => {
          console.log('删除', jsondata.data)
          if (jsondata.code === '200') {
            this.noti('删除')
            this.getUsersList()
          }
        })
        .then(console.error())
    },
    handleOffLine (index, row) {
      // axios({
      //   method: 'put',
      //   url: '/admin/user/offline',
      //   params: { userId: row.userId }
      // })
      axios.put('/admin/user/OffLine/' + row.userId)
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            // alert('下架成功')
            this.noti('封禁')
          }
        })
        .then(console.error())
    },
    handleOnLine (index, row) {
      // axios({
      //   method: 'put',
      //   url: '/admin/user/online',
      //   data: Qs.stringify({ userId: row.userId })
      // })
      axios.put('/admin/user/OnLine/' + row.userId)
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            // alert('上架成功')
            this.noti('解封')
          }
        })
        .then(console.error())
    }
  }
}
</script>

<style></style>
