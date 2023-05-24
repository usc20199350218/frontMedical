<template>
  <div>
    <el-button style="float: left;" @click="handleAdd()">新增</el-button>
    <el-table :data="addressList" style="width: 100%">
      <el-table-column label="姓名" prop="userName">
      </el-table-column>
      <el-table-column label="地址" prop="addressContent">
      </el-table-column>
      <el-table-column label="默认">
        <template slot-scope="addressList">
          <el-switch v-model="addressList.row.isDefault" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     inactive-color="#ff4949" @change="isDefaultChaged(addressList.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="userPhone">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-dialog :before-close="handleClose" :title="showTitle" :visible.sync="showEdit" width="30%">
        <el-form ref="form" :model="address" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="address.userName">
            </el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="address.addressContent">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="address.userPhone">
            </el-input>
          </el-form-item>
          <el-form-item label="是否默认">
            <el-switch v-model="address.isDefault" :active-value="1" :inactive-value="0" active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import mystore from '../../store'
import axios from '../../utils/request'

export default {
  // 只能查看自己的地址
  data () {
    return {
      userId: mystore.state.user.userId,
      addressList: [],
      showEdit: false,
      address: {},
      showTitle: '详情'
    }
  },
  created () {
    this.getAddressList()
  },
  methods: {
    isDefaultChaged (val) {
      console.log('默认', val)
      axios.post('/api/address/save', Qs.stringify(val)).then((jsondata) => {
        console.log('默认json-data', jsondata)
        this.getAddressList()
      })
    },
    close () {
      this.address = {}
      this.showEdit = false
    },
    save () {
      axios.post('/api/address/save', Qs.stringify(this.address)).then((jsondata) => {
        console.log('save:', jsondata)
        if (jsondata.code === '200') {
          this.showEdit = false
          this.address = {}
          this.getAddressList()
        }
      })
    },
    handleAdd () {
      this.address.userId = this.userId
      console.log('新增')
      this.showTitle = '新增'
      this.showEdit = true
    },
    handleEdit (val) {
      console.log('edit', val)
      this.address = val
      this.showEdit = true
    },
    handleDel (val) {
      axios.delete('/api/address/' + val.addressId).then((jsondata) => {
        console.log('del:', jsondata)
        if (jsondata.code === '200') {
          this.getAddressList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    getAddressList () {
      axios.get('/api/address/' + this.userId).then((jsondata) => {
        console.log('json-data', jsondata)
        this.addressList = jsondata.data
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.address = {}
        })
        .catch(_ => {
        })
    }

  }
}
</script>

<style></style>
