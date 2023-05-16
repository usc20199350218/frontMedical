<template>
  <div>
    <el-table :data="
      drugsList.filter(
        (data) =>
          !search ||
          data.drugName.toLowerCase().includes(search.toLowerCase())
      )
    " fit mix-height="100" stripe style="width: 100%">
      <el-table-column fixed="left" label="ID" min-width="80px">
        <template slot-scope="drugsList">
          <span style="margin-left: 10px">{{ drugsList.row.drugId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="品名" min-width="150px">
        <template slot-scope="drugsList">
          <span style="margin-left: 10px">{{ drugsList.row.drugName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类" min-width="125px">
        <template slot-scope="drugsList">
          <span style="margin-left: 10px">{{ drugsList.row.typeName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="规格" min-width="125px">
                <template slot-scope="drugsList">
                    <span style="margin-left: 10px">{{ drugsList.row.drugSpecification }}</span>
                </template>
            </el-table-column> -->
      <!-- <el-table-column label="品牌" min-width="125px">
                <template slot-scope="drugsList">
                    <span style="margin-left: 10px">{{ drugsList.row.brandName }}</span>
                </template>
            </el-table-column> -->
      <el-table-column label="处方" min-width="60px">
        <template slot-scope="drugsList">
          <span v-if="drugsList.row.isRx == '0'">非处方药</span>
          <span v-if="drugsList.row.isRx == '1'">处方药</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="85px">
        <template slot-scope="drugsList">
          <el-switch v-model="drugsList.row.drugStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     inactive-color="#ff4949" @change="drugStateChaged(drugsList.row)">
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="保质期(月)" width="100px">
                <template slot-scope="drugsList">
                    <span style="margin-left: 10px">{{ drugsList.row.drugShelfLife }}</span>
                </template>
            </el-table-column> -->
      <el-table-column label="创建日期" width="180px">
        <template slot-scope="drugsList">
          <span style="margin-left: 10px">{{ drugsList.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="180px">
        <template slot-scope="drugsList">
          <span style="margin-left: 10px">{{
            drugsList.row.modifiedTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed="right" width="220px">
        <template slot="header" slot-scope="drugsList">
          <el-col :span="14">
            <el-input v-if="drugsList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>
          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowdialog">添加
          </el-button>
        </template>
        <template slot-scope="drugsList">
          <el-button size="mini" @click="handleEdit(drugsList.$index, drugsList.row)">编辑</el-button>
          <!-- <el-button v-if="drugsList.row.drugStatus == '1'" size="mini" type="warning"
                        @click="handleOffLine(drugsList.$index, drugsList.row)">封禁</el-button>
                    <el-button v-if="drugsList.row.drugStatus == '0'" size="mini" type="primary"
                        @click="handleOnLine(drugsList.$index, drugsList.row)">解禁</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(drugsList.$index, drugsList.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog :visible.sync="dialogFormVisible" title="新数据">
        <el-form ref="form" :model="drug" label-width="80px" size="mini">
          <el-form-item label="品名">
            <el-col>
              <el-input v-model="drug.drugName" maxlength="20" placeholder="请输入品名" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="处方">
            <el-col>
              <el-select v-model="drug.isRx" default-first-option placeholder="请选择品类">
                <el-option :value="0" label="非处方药"></el-option>
                <el-option :value="1" label="处方药"></el-option>

              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item fixed="left" label="品类" min-width="150px">
            <el-select v-model="drug.typeId" filterable placeholder="请选择药品">
              <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName"
                         :value="item.typeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drug.drugStatus" placeholder="请选择状态">
                <el-option :value="1" label="有效"></el-option>
                <el-option :value="0" label="无效"></el-option>
              </el-select>
            </el-col>
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
        <el-form ref="form" :model="drug" label-width="80px" size="mini">
          <el-form-item label="品名">
            <el-col>
              <el-input v-model="drug.drugName" maxlength="20" placeholder="请输入品名" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="处方">
            <el-col>
              <el-select v-model="drug.isRx" default-first-option placeholder="请选择品类">
                <el-option :value="0" label="非处方药"></el-option>
                <el-option :value="1" label="处方药"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item fixed="left" label="品类" min-width="150px">
            <el-select v-model="drug.typeId" filterable placeholder="请选择药品">
              <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName"
                         :value="item.typeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drug.drugStatus" placeholder="请选择状态">
                <el-option :value="1" label="有效"></el-option>
                <el-option :value="0" label="无效"></el-option>
              </el-select>
            </el-col>
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
      drugsList: [],
      drug: {
        drugName: '',
        isRx: '',
        drugStatus: ''
      },
      typeList: []
    }
  },

  created () {
    // 先获取全部用户
    this.getDrugsList()
  },
  methods: {
    updItem () {
      console.log(this.drug)
      axios({
        method: 'put',
        url: '/admin/drug',
        data: Qs.stringify(this.drug)
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
        url: '/admin/drug',
        data: Qs.stringify(this.drug)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(1)
            this.noti('提交')
          }
        })
        .then(console.error())
      this.getDrugsList()
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
      this.drug = {
        drugName: '',
        isRx: '',
        drugStatus: ''
      }
    },
    addShowdialog () {
      this.getTypeList()
      this.dialogFormVisible = true
    },
    getTypeList () {
      axios.get('/admin/type').then(jsondata => {
        this.typeList = jsondata.data
      })
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getDrugsList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getDrugsList()
    },
    drugStateChaged (item) {
      console.log('change', item)
      //   if (item.drugStatus === 0) {
      //     console.log('change to 0')
      //     this.handleOffLine(0, item)
      //   }
      //   if (item.drugStatus === 1) {
      //     console.log('change to 1')
      //     this.handleOnLine(0, item)
      //   }
      let changeData = {status: item.drugStatus, drugId: item.drugId}
      axios({
        method: 'put',
        url: '/admin/drug/status',
        data: Qs.stringify(changeData)
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          // alert('下架成功')
          this.noti('状态修改操作')
        }
      })
        .then(console.error())
    },
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '操作成功',
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
      this.getDrugsList()
    },
    getDrugsList () {
      console.log('pageInfo:>' + this.pageInfo)
      // 获取药品分页列表
      axios({
        method: 'get',
        url: '/admin/drug/page',
        params: {'current': this.pageInfo.current, 'size': this.pageInfo.size}
      }).then((jsondata) => {
        this.drugsList = jsondata.data.records
        console.log('drugsList:', jsondata.data.records)
        this.pageInfo = jsondata.data
        // console.log(jsondata.data[0].usersDetail)
      })
    },
    handleEdit (index, row) {
      this.getTypeList()
      console.log(index)
      console.log(row)
      this.drug = row
      this.dialogFormVisibles = true
    },
    handleDelete (index, row) {
      axios({
        method: 'delete',
        url: `/admin/user/` + row.drugId
      })
        .then((jsondata) => {
          console.log('删除' + jsondata.data)
          if (jsondata.code === '200') {
            this.noti('删除')
          }
        })
        .then(console.error())
    },
    handleOffLine (index, row) {
      axios({
        method: 'put',
        url: '/admin/drug/offline',
        params: {drugId: row.drugId}
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            // alert('下架成功')
            this.noti('下架')
          }
        })
        .then(console.error())
    },
    handleOnLine (index, row) {
      axios({
        method: 'put',
        url: '/admin/drug/online',
        data: Qs.stringify({drugId: row.drugId})
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            // alert('上架成功')
            this.noti('上架')
          }
        })
        .then(console.error())
    }
  }
}
</script>

<style></style>
