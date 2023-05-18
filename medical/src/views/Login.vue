<template>
  <div class="loginMax">
    <div class="login">
      <el-tabs v-model="activeName" stretch type="border-card">
        <el-tab-pane label="账号密码登录" name="first">
          <el-form ref="userinfo" :label-position="labelPosition" :model="userInfo" :rules="rules" label-width="70px">
            <h3>啊对对对对对</h3>
            <el-form-item label="账号" prop="userName">
              <el-input v-model="userInfo.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="userInfo.userPassword" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
              <el-button @click="userInfo = {}">重置</el-button>
            </el-form-item>
            <el-button type="text" @click="dialog = true"> 点击注册</el-button>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="手机号登录" name="second">
            <el-form
              :label-position="labelPosition"
              label-width="70px"
              :model="userInfoTwo"
              :rules="rules"
              ref="userInfoTwo"
            >
              <h3>啊对对对对对</h3>
              <el-form-item label="手机号" prop="userPhone">
                <el-input v-model="userInfoTwo.userPhone"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="verification">
                <el-col :span="15">
                  <el-input v-model="userInfoTwo.verification"></el-input>
                </el-col>
                <el-button type="primary" @click="getCode">获取验证码</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loginByPhone">登录</el-button>
                <el-button @click="userInfoTwo = {}"
                  >重置</el-button
                > </el-form-item
              ><el-button type="text" @click="dialog = true">
                点击注册
              </el-button>
            </el-form>
          </el-tab-pane> -->
      </el-tabs>
      <div class="block">
        <el-image :src="src"></el-image>
      </div>
    </div>
    <el-drawer ref="drawer" :rules="rules" :visible.sync="dialog" custom-class="demo-drawer" direction="ltr"
               label-width="70px"
               title="注册">
      <!-- <el-form
          :label-position="labelPosition"
          label-width="70px"
          :model="registerUserInfo"
          :rules="rules"
          ref="registerUserInfo"
        > -->
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item :label-width="formLabelWidth" label="用户名" prop="userName">
            <el-col :span="17">
              <el-input v-model="registerUserInfo.userName" autocomplete="off" maxlength="20"
                        show-word-limit></el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="密码" prop="userPassword">
            <el-col :span="17">
              <el-input v-model="registerUserInfo.userPassword" maxlength="20" placeholder="请输入密码" show-password
                        show-word-limit>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="确认密码" prop="userPassword">
            <el-col :span="17">
              <el-input v-model="registerUserInfo.userPassword2" maxlength="20" placeholder="请再次输入密码"
                        show-password
                        show-word-limit>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="手机号" prop="userPhone">
            <el-col :span="17">
              <el-input v-model="registerUserInfo.userPhone" maxlength="11" placeholder="请输入手机号" show-word-limit>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm()">取 消</el-button>
                <el-button type="primary" @click="registerUserClick()">确 定</el-button>

                <!-- <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? "提交中 ..." :
                  "确 定" }}</el-button> -->

              </div>
            </el-form>
          </el-form-item>
        </el-form>
      </div>
      <!-- </el-form> -->
    </el-drawer>
  </div>
</template>

<script>
import axios from '../utils/request'
import Qs from 'qs'

export default {
  data () {
    return {
      table: false,
      dialog: false,
      loading: false,
      innerDrawer: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '70px',
      timer: null,
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      activeName: 'first',
      labelPosition: 'right',
      registerUserInfo: {},
      userInfo: {},
      userInfoTwo: {},
      rules: {
        userName: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {min: 3, max: 20, message: '长度在3到20之间', trigger: 'blur'}
        ],
        userPassword: [
          {
            required:
              /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/,
            message: '请输入密码',
            trigger: 'blur'
          },
          {min: 4, max: 20, message: '长度在4到20之间', trigger: 'blur'}
        ],
        userPhone: [
          {
            required:
              /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){11}$/,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {min: 11, max: 11, message: '长度11', trigger: 'blur'}
        ],
        verification: [
          {
            required:
              /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){4}$/,
            message: '请输入密码',
            trigger: 'blur'
          },
          {min: 4, max: 4, message: '长度为4', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    registerUserClick () {
      console.log('registerUserInfo:', this.registerUserInfo)
      let registerUser =
        {
          userName: this.registerUserInfo.userName,
          userPhone: this.registerUserInfo.userPhone,
          userPassword: this.registerUserInfo.userPassword
        }
      console.log('registerUser', registerUser)
      if (this.registerUserInfo.userPassword === this.registerUserInfo.userPassword2) {
        console.log('密码匹配')
        axios.post('/admin/user/register',
          Qs.stringify(registerUser)
        ).then((jsondata) => {
          console.log('json-data', jsondata)
          if (jsondata.code === 200) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
          }
        })
      } else {
        console.log('密码不匹配')
        this.$message.error('密码不匹配')
      }
    },
    cancelForm () {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },

    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
    },
    getCode () {
      console.log('getCode')
      // axios({
      //   method: 'post',
      //   url: '/admin/user/logincode',
      //   data: this.userInfoTwo
      // }).then((jsondata) => {
      //   console.log(jsondata)
      // })
      axios({
        method: 'get',
        url: `/admin/user/code/${this.userInfoTwo.userPhone}`
      }).then(jsondata => {
        console.log(jsondata)
      })
    },
    loginByPhone () {
      console.log('Phone Login')
    },
    async login () {
      console.log(this.userInfo)
      let jsondata = await axios({
        method: 'post',
        url: '/login',
        data: Qs.stringify(this.userInfo)
      })
      console.log(jsondata)
      if (jsondata.code === '200') {
        // 把user 对象存在vuex 中
        // this.$store.commit('updateUser', jsondata.data)
        this.$store.commit('setUser', jsondata.data)
        console.log('登录:', jsondata.data)
        this.noti('登录')
        // 跳转到my
        this.$router.push('/index')
      }
    }
  }
}
</script>

<style>
.loginMax {
  width: 100%;
  height: 100%;
}

.login {
  width: 500px;
  /* height: 20px; */
  /* background-color:rgb(9, 133, 249); */
  /* border: solid 1px #dcdfe6; */
  /* border-radius: 10px; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* padding-right: 40px; */
}

.login h3 {
  text-align: center;
}

.demo-drawer__footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
