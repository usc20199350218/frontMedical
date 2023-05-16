<template>
  <div>
    <div>
      <el-row :span="24">
        <el-col :span="1.4">
          <el-button @click="backChoose()">选择用户</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button @click="editServiceF()" v-if="editService">编辑</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button @click="save()" v-if="!editService">保存</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button v-if="serviceId" @click="back()">退出</el-button>
        </el-col>
        <el-col :span="1.2">
          <el-button v-if="editService" @click="newService()">新建</el-button>
        </el-col>
      </el-row>
    </div>
    <hr />
    <div>
      <!-- 用户信息 -->
      <el-row>
        <el-col :span="3">
          <img :src="user.userAvatarUrl" style="width: 120px;" />
        </el-col>
        <el-col :span="21">
          <el-row>
            <el-col :span="5">
              <label>姓名：<el-input v-model="user.userRealName" style="width: 200px;" :disabled="editPermissions" /></label>
            </el-col>
            <el-col :span="5">
              <label>性别：<el-input v-model="user.userGender" style="width: 200px;" :disabled="editPermissions" /></label>
            </el-col>
            <el-col :span="5">
              <label>号码：<el-input v-model="user.userPhone" style="width: 200px;" :disabled="editPermissions" /></label>
            </el-col>
            <el-col :span="5">
              <label>生日：<el-input v-model="user.userBirthday" style="width: 200px;" :disabled="editPermissions" /></label>
            </el-col>
          </el-row>
          <hr />
          <el-row :span="21">
            <el-col :span="5">
              <label>随访：<el-input v-model="service.serviceDate" style="width: 200px;" :disabled="editPermissions" />
              </label>
            </el-col>
            <el-col :span="5">
              <label>
                结果：
                <el-select v-model="service.isNormal" placeholder="请选择" :disabled="editService" style="width: 200px;">
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="异常" value="0"></el-option>
                </el-select>
              </label>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <hr />
    <div>
      <!-- 明细 -->
      <el-table :data="serviceList" style="width: 100%">
        <el-table-column prop="serviceEntryName" label="随访项" width="180">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="180">
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.content" :disabled="editService" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from '../../utils/request'
export default {
  data () {
    return {
      // 根据serviceId是否传入判断是新增还是查看
      serviceId: '',
      userId: '',
      user: {},
      editPermissions: true,
      operateList: [1, 2, 3],
      service: {},
      examine: {
        lastDate: '2022-01-01'
      },
      activeName: '',
      myMap: '',
      editService: true,
      serviceList: [],
      userRealName: ''
    }
  },
  created () {
    this.userId = this.$route.query.userId
    this.serviceId = this.$route.query.serviceId
    this.userRealName = this.$route.query.userRealName
    this.service.userId = this.userId
    this.getUser()
    console.log(this.serviceId)
    if (typeof this.serviceId !== 'undefined' && this.serviceId) {
      // 新建
      console.log('查看')
      this.getDetail()
    } else {
      console.log('新建')
      this.editService = false
      this.service.serviceDate = this.getServiceDate()
      this.getBlank()
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/service/choose', query: { userId: this.userId, userRealName: this.userRealName } })
    },
    getServiceDate () {
      // 在Vue.js中获取当前日期
      let currentDate = new Date()

      // 将日期格式化为“yyyy-MM-dd”的字符串格式
      let formattedDate = currentDate.getFullYear() + '-' +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
        currentDate.getDate().toString().padStart(2, '0')
      return formattedDate
    },
    getBlank () {
      axios.get('/api/service/blank').then((jsondata) => {
        console.log('getBlank:', jsondata)
        this.serviceList = jsondata.data
        console.log('serviceList:', this.serviceList)
      })
    },
    save () {
      this.editService = true
      this.service.serviceList = this.serviceList
      console.log('this.service:', this.service)
      axios.post('/api/service', this.service)
        .then((jsondata) => {
          console.log('推送结果:', jsondata)
          if (jsondata.code === '200') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
        })
    },
    getDetail () {
      axios.get('/api/service/' + this.serviceId).then((jsondata) => {
        console.log('初始化数据', jsondata)
        this.service = jsondata.data
        this.serviceList = jsondata.data.serviceList
        console.log('serviceList:', this.serviceList)
      })
    },
    // getdetail () {
    //   axios.get('/api/service/last/' + this.userId, {
    //     params: {
    //       lastDate: this.examine.lastDate,
    //       activeName: this.activeName
    //     }
    //   }).then((jsondata) => {
    //     console.log('获取详情:', jsondata)
    //     this.service = jsondata.data
    //     this.myMap = jsondata.data.serviceMap
    //   })
    // },
    editServiceF () {
      this.editService = false
    },
    editUser () {
      this.editPermissions = false
    },
    backChoose () {
      this.$router.push('/service/user')
    },
    getUser () {
      if (this.userId) {
        axios.get('/admin/user/' + this.userId).then((jsondata) => {
          console.log('获取的用户信息', jsondata)
          this.user = jsondata.data
        })
      }
    }
  }
}
</script>

<style></style>
