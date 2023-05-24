<template>
  <div>
    <el-table :data="
            brandsList.filter(
                (data) =>
                    !search ||
                    data.drugName.toLowerCase().includes(search.toLowerCase())
            )
        " fit mix-height="100" stripe style="width: 100%">
      <el-table-column fixed="left" label="ID" min-width="80px">
        <template slot-scope="brandsList">
          <span style="margin-left: 10px">{{ brandsList.row.brandId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="品牌名称" min-width="150px">
        <template slot-scope="brandsList">
          <span style="margin-left: 10px">{{ brandsList.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="代理人" min-width="150px">
        <template slot-scope="brandsList">
          <span style="margin-left: 10px">{{ brandsList.row.userRealName }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="号码" min-width="150px">
        <template slot-scope="brandsList">
          <span style="margin-left: 10px">{{ brandsList.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="180px">
        <template slot-scope="brandsList">
          <span style="margin-left: 10px">{{ brandsList.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="180px">
        <template slot-scope="brandsList">
                    <span style="margin-left: 10px">{{
                        brandsList.row.modifiedTime
                    }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed="right" width="220px">
        <template slot="header" slot-scope="brandsList">
          <el-col :span="14">
            <el-input v-if="brandsList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>
          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowdialog">添加
          </el-button>
        </template>
        <template slot-scope="brandsList">
          <el-button size="mini" @click="handleEdit(brandsList.$index, brandsList.row)">编辑</el-button>
          <el-button size="mini" type="danger"
                     @click="handleDelete(brandsList.$index, brandsList.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog :visible.sync="dialogFormVisible" title="新数据">
        <el-form ref="form" :model="brand" label-width="80px" size="mini">
          <el-form-item label="品牌名称">
            <el-input v-model="brand.brandName"></el-input>
          </el-form-item>
          <el-form-item fixed="left" label="代理人" min-width="150px">
            <el-select v-model="brand.userId" filterable placeholder="请选择代理人">
              <el-option v-for="item in usersList" :key="item.brandId" :label="item.userRealName" :value="item.userId">
                {{ item.userRealName }}-{{ item.userPhone }}
              </el-option>
            </el-select>
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
        <el-form ref="form" :model="brand" label-width="80px" size="mini">
          <div>{{ brand }}</div>
          <el-form-item label="品牌名称">
            <el-input v-model="brand.brandName"></el-input>
          </el-form-item>
          <el-form-item fixed="left" label="代理人" min-width="150px">
            <el-select v-model="brand.userId" filterable placeholder="请选择代理人">
              <el-option v-for="item in usersList" :key="item.brandId" :label="item.userRealName" :value="item.userId">
                {{ item.userRealName }}-{{ item.userPhone }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="block">
      <el-pagination :current-page="pageInfo.current" :page-size="pageInfo.size"
                     :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :total="pageInfo.total"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import axios from '../../utils/request'

export default {
  data () {
    return {
      pageInfo: {current: 0, size: 5},
      search: '',
      dialogFormVisible: false,
      dialogFormVisibles: false,
      brandsList: [],
      brand: {
        brandName: '',
        userId: ''
      },
      usersList: []
    }
  },

  created () {
    // 先获取全部
    this.getBrandsList()
  },
  methods: {
    updItem () {
      console.log('准备更新的数据：' + this.brand.brandId)
      axios({
        method: 'put',
        url: '/admin/brand',
        data: Qs.stringify(this.brand)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(2)
            this.noti('提交')
          }
        })
        .then(console.error())
      this.getBrandsList()
    },
    addItem () {
      axios({
        method: 'post',
        url: '/admin/brand',
        data: Qs.stringify(this.brand)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(1)
            this.noti('提交')
          }
        })
        .then(console.error())
      this.getBrandsList()
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
      this.brand = {
        brandName: '',
        userId: ''
      }
    },
    addShowdialog () {
      this.getUserList()
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getBrandsList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getBrandsList()
    },
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '操作成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
      this.getBrandsList()
    },
    getBrandsList () {
      console.log('pageInfo:>' + this.pageInfo)
      // 获取药品分页列表
      axios({
        method: 'get',
        url: '/admin/brand/page',
        params: {'current': this.pageInfo.current, 'size': this.pageInfo.size}
      }).then((jsondata) => {
        this.brandsList = jsondata.data.records
        console.log('brandsList:', jsondata.data.records)
        this.pageInfo = jsondata.data
        // console.log(jsondata.data[0].usersDetail)
      })
    },
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.brand.brandId = row.brandId
      this.brand.brandName = row.brandName
      this.brand.userId = row.userId
      this.getUserList()
      this.dialogFormVisibles = true
    },
    handleDelete (index, row) {
      axios({
        method: 'delete',
        url: `/admin/brand/` + row.brandId
      })
        .then((jsondata) => {
          console.log('删除' + jsondata.data)
          if (jsondata.code === '200') {
            this.noti('删除')
          }
        })
        .then(console.error())
    },
    getUserList () {
      axios({
        method: 'get',
        url: '/admin/user/supplier'
      }).then((jsondata) => {
        this.usersList = jsondata.data
        console.log('用户list:' + jsondata.data)
      })
    }
  }
}
</script>

<style></style>
