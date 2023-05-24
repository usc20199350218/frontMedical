<template>
  <div>
    {{ user }}
    <div>
      <el-row>
        <el-col :span="3">
          <img :src="user.userAvatarUrl" style="width: 120px;"/>
        </el-col>
        <el-col :span="21">
          <el-row>
            <el-col :span="5">
              <label>姓名：
                <el-input v-model="user.userRealName" :disabled="editPermissions" style="width: 200px;"/>
              </label>
            </el-col>
            <el-col :span="5">
              <label>性别：
                <el-input v-model="user.userGender" :disabled="editPermissions" style="width: 200px;"/>
              </label>
            </el-col>
            <el-col :span="5">
              <label>号码：
                <el-input v-model="user.userPhone" :disabled="editPermissions" style="width: 200px;"/>
              </label>
            </el-col>
            <el-col :span="5">
              <label>生日：
                <el-input v-model="user.userBirthday" :disabled="editPermissions" style="width: 200px;"/>
              </label>
            </el-col>
          </el-row>
          <hr/>
          <el-row :span="21">
            <el-col :span="5">
              <label>昵称：
                <el-input v-model="user.userNickName" :disabled="editPermissions" style="width: 200px;"/>
              </label>
            </el-col>
            <el-col :span="5">
              <label>
                结果：
                <el-select v-model="service.isNormal" :disabled="editPermissions" placeholder="请选择"
                           style="width: 200px;">
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="异常" value="0"></el-option>
                </el-select>
              </label>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import mystore from '../../store'
import axios from '../../utils/request'

export default {
  data () {
    return {
      userId: mystore.state.user.userId,
      user: {},
      editPermissions: true,
      service: {},
      editService: true
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      axios.get(`/admin/user/info/` + this.userId).then((json) => {
        this.user = json.data
      })
    }
  }
}
</script>

<style>

</style>
