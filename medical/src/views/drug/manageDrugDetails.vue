<template>
  <div>
    <el-table :data="
      drugDetailsList.filter(
        (data) =>
          !search ||
          data.drugName.toLowerCase().includes(search.toLowerCase())
      )
    " fit stripe mix-height="100" style="width: 100%">
      <el-table-column label="ID" min-width="80px" fixed="left">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugDetailId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品名" min-width="150px" fixed="left">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="125px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="125px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugSpecification }}</span>
        </template>
      </el-table-column>

      <el-table-column label="品类" min-width="60px">
        <template slot-scope="drugDetailsList">
          <span v-if="drugDetailsList.row.isRx == '0'">非处方药</span>
          <span v-if="drugDetailsList.row.isRx == '1'">处方药</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="85px">
        <template slot-scope="drugDetailsList">
          <el-switch v-model="drugDetailsList.row.drugDetailsStatus" :active-value="1" :inactive-value="0" active-color="#13ce66"
            inactive-color="#ff4949" @change="drugStateChaged(drugDetailsList.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="180px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="100px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{
            drugDetailsList.row.modifiedTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" width="220px" fixed="right">
        <template slot="header" slot-scope="drugDetailsList">
          <el-col :span="14">
            <el-input v-model="search" size="mini" v-if="drugDetailsList" placeholder="输入关键字搜索" />
          </el-col>
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
            @click="addShowdialog">添加</el-button>
        </template>
        <template slot-scope="drugDetailsList">
          <el-button size="mini" @click="handleEdit(drugDetailsList.$index, drugDetailsList.row)">编辑</el-button>
          <el-button size="mini" type="danger"
            @click="handleDelete(drugDetailsList.$index, drugDetailsList.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="新数据" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="drugDetail" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="drugDetail.drugId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugsList" :key="item.drugId" :value="item.drugId" :label="item.drugName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" min-width="150px" fixed="left">
            <el-select v-model="drugDetail.brandId" filterable placeholder="请选择品牌">
              <el-option v-for="item in brandsList" :key="item.brandId" :value="item.brandId" :label="item.brandName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drugDetail.drugDetailsStatus" placeholder="请选择状态">
                <el-option label="有效" :value="1"></el-option>
                <el-option label="无效" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="规格">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入品名" show-word-limit
                v-model="drugDetail.drugSpecification"></el-input></el-col>
          </el-form-item>

          <el-form-item label="保质期（月）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入保质期（月）" show-word-limit
                v-model="drugDetail.drugShelfLife"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="addItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="修改数据" :visible.sync="dialogFormVisibles">
        <el-form ref="form" :model="drugDetail" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="drugDetail.drugId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugsList" :key="item.drugId" :value="item.drugId" :label="item.drugName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" min-width="150px" fixed="left">
            <el-select v-model="drugDetail.brandId" filterable placeholder="请选择品牌">
              <el-option v-for="item in brandsList" :key="item.brandId" :value="item.brandId" :label="item.brandName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drugDetail.drugDetailsStatus" placeholder="请选择状态">
                <el-option label="有效" :value="1"></el-option>
                <el-option label="无效" :value="0"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="规格">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入品名" show-word-limit
                v-model="drugDetail.drugSpecification"></el-input></el-col>
          </el-form-item>

          <el-form-item label="保质期（月）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入保质期（月）" show-word-limit
                v-model="drugDetail.drugShelfLife"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
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
      pageInfo: { current: 0, size: 5 },
      search: '',
      dialogFormVisible: false,
      dialogFormVisibles: false,
      drugDetailsList: [],
      drugsList: [],
      brandsList: [],
      // drugDetail: {
      //   drugName: '',
      //   isRx: '',
      //   drugStatus: ''
      // },
      drugDetail: {
        drugId: '',
        brandId: '',
        drugDetailsStatus: '',
        drugSpecification: '',
        drugShelfLife: ''
      }
    }
  },

  created () {
    // 先获取全部用户
    this.getDrugDetailsList()
  },
  methods: {
    updItem () {
      console.log(this.drugDetail)
      axios({
        method: 'put',
        url: '/admin/drugdetail',
        data: Qs.stringify(this.drugDetail)
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
        url: '/admin/drugdetail',
        data: Qs.stringify(this.drugDetail)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.closedialog(1)
            this.noti('提交')
          }
        })
        .then(console.error())
      this.getDrugDetailsList()
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
      this.drugDetail = {
        drugName: '',
        isRx: '',
        drugStatus: ''
      }
    },
    addShowdialog () {
      this.getBrandList()
      this.getDrugList()
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getDrugDetailsList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getDrugDetailsList()
    },
    drugStateChaged (item) {
      console.log('change', item)
      let changeData = { drugDetailsStatus: item.drugDetailsStatus, drugDetailId: item.drugDetailId }
      axios({
        method: 'put',
        url: '/admin/drugdetail/status',
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
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
      this.getDrugDetailsList()
    },
    getDrugDetailsList () {
      console.log('pageInfo:>', this.pageInfo)
      // 获取药品分页列表
      axios({
        method: 'get',
        url: '/admin/drugdetail/page',
        params: { 'current': this.pageInfo.current, 'size': this.pageInfo.size }
      }).then((jsondata) => {
        this.drugDetailsList = jsondata.data.records
        console.log('drugDetailsList:', jsondata.data.records)
        this.pageInfo = jsondata.data
        // console.log(jsondata.data[0].usersDetail)
      })
    },
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.getBrandList()
      this.getDrugList()
      this.drugDetail = row
      this.dialogFormVisibles = true
    },
    handleDelete (index, row) {
      axios({
        method: 'delete',
        url: `/admin/drugdetail/` + row.drugDetailId
      })
        .then((jsondata) => {
          console.log('删除', jsondata.data)
          if (jsondata.code === '200') {
            this.noti('删除')
          }
        })
        .then(console.error())
    },
    handleOffLine (index, row) {
      axios({
        method: 'put',
        url: '/admin/drugdetail/offline',
        params: { drugId: row.drugId }
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
        url: '/admin/drugdetail/online',
        data: Qs.stringify({ drugId: row.drugId })
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            // alert('上架成功')
            this.noti('上架')
          }
        })
        .then(console.error())
    },
    getDrugList () {
      axios({
        method: 'get',
        url: '/admin/drug'
      }).then((jsondata) => {
        this.drugsList = jsondata.data
        console.log('获取到的药品信息list为:', this.drugsList)
      })
    },
    getBrandList () {
      axios({
        method: 'get',
        url: '/admin/brand'
      }).then((jsondata) => {
        this.brandsList = jsondata.data
        console.log('获取到的品牌list为:', this.brandsList)
      })
    }
  }
}
</script>

<style></style>
