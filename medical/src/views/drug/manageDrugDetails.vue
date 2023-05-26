<template>
  <div>
    <el-table :data="drugDetailsList.filter(
      (data) =>
        !search ||
        data.drugName.toLowerCase().includes(search.toLowerCase())
    )
      " fit mix-height="100" stripe style="width: 100%">
      <el-table-column fixed="left" label="ID" min-width="80px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugDetailId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="品名" min-width="150px">
        <template slot-scope="drugDetailsList">
          <el-popover placement="top" trigger="hover">
            <p>编码: {{ drugDetailsList.row.drugNumber }}</p>
            <span style="margin-left: 10px">{{ drugDetailsList.row.createTime }}</span>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ drugDetailsList.row.drugName }}</el-tag>
            </div>
          </el-popover>
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
      <el-table-column label="品类" min-width="125px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="125px">
        <template slot-scope="drugDetailsList">
          <!-- <span style="margin-left: 10px">{{ drugDetailsList.row.drugDetailPath }}</span> -->
          <img :src="drugDetailsList.row.drugDetailPath" alt="图片" width="100px">
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="60px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugUnitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="60px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{ drugDetailsList.row.drugRetailPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处方" min-width="60px">
        <template slot-scope="drugDetailsList">
          <span v-if="drugDetailsList.row.isRx === 0">非处方药</span>
          <span v-if="drugDetailsList.row.isRx === 1">处方药</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="85px">
        <template slot-scope="drugDetailsList">
          <el-switch v-model="drugDetailsList.row.drugDetailsStatus" :active-value="1" :inactive-value="0"
                     active-color="#13ce66" inactive-color="#ff4949" @change="drugStateChaged(drugDetailsList.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="100px">
        <template slot-scope="drugDetailsList">
          <span style="margin-left: 10px">{{
              drugDetailsList.row.modifiedTime
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed="right" width="220px">
        <template slot="header" slot-scope="drugDetailsList">
          <el-col :span="14">
            <el-input v-if="drugDetailsList" v-model="search" placeholder="输入关键字搜索" size="mini"/>
          </el-col>
          <el-button icon="el-icon-circle-plus-outline" round size="mini" type="primary"
                     @click="addShowdialog">添加
          </el-button>
        </template>
        <template slot-scope="drugDetailsList">
          <el-button size="mini" @click="handleEdit(drugDetailsList.$index, drugDetailsList.row)">编辑</el-button>
          <el-button size="mini" type="danger"
                     @click="handleDelete(drugDetailsList.$index, drugDetailsList.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog :visible.sync="dialogFormVisible" title="新数据">
        <el-form ref="form" :model="drugDetail" label-width="100px" size="mini">
          <el-form-item fixed="left" label="药品" min-width="150px">
            <el-select v-model="drugDetail.drugId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugsList" :key="item.drugId" :label="item.drugName" :value="item.drugId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item fixed="left" label="品牌" min-width="150px">
            <el-select v-model="drugDetail.brandId" filterable placeholder="请选择品牌">
              <el-option v-for="item in brandsList" :key="item.brandId" :label="item.brandName" :value="item.brandId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="left" label="图片上传">
            <el-col>
              运行正常
              <el-upload :file="fileList" :limit="1"
                         :on-preview="handlePreview" :on-remove="handleRemove" :on-success="filesuccess"
                         action="http://localhost:8088/api/upload?module=drugpath"
                         class="upload-demo" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件且不超过500kb
                </div>
              </el-upload>
            </el-col>
            <el-col>
              <el-input v-model="drugDetail.drugDetailPath" placeholder="电影路径，直接输路径，cpoy用" type="text">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drugDetail.drugDetailsStatus" placeholder="请选择状态">
                <el-option :value="1" label="有效"></el-option>
                <el-option :value="0" label="无效"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="规格">
            <el-col>
              <el-input v-model="drugDetail.drugSpecification" maxlength="20" placeholder="请输入品名" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="编码">
            <el-col>
              <el-input v-model="drugDetail.drugNumber" maxlength="20" placeholder="请输入编码" show-word-limit
                        type="text">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="单价">
            <el-col>
              <el-input v-model="drugDetail.drugUnitPrice" maxlength="20" placeholder="请输入单价" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="零售价">
            <el-col>
              <el-input v-model="drugDetail.drugRetailPrice" maxlength="20" placeholder="请输入零售价" show-word-limit
                        type="text"></el-input>
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
        <el-form ref="form" :model="drugDetail" label-width="100px" size="mini">
          <el-form-item fixed="left" label="药品" min-width="150px">
            <el-select v-model="drugDetail.drugId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugsList" :key="item.drugId" :label="item.drugName" :value="item.drugId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item fixed="left" label="品牌" min-width="150px">
            <el-select v-model="drugDetail.brandId" filterable placeholder="请选择品牌">
              <el-option v-for="item in brandsList" :key="item.brandId" :label="item.brandName" :value="item.brandId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="left" label="图片上传">
            <el-col>
              运行正常
              <el-upload :file="fileList" :limit="1"
                         :on-preview="handlePreview" :on-remove="handleRemove" :on-success="filesuccess"
                         action="http://localhost:8088/api/upload?module=drugpath"
                         class="upload-demo" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件且不超过500kb
                </div>
              </el-upload>
            </el-col>
            <el-col>
              <el-input v-model="drugDetail.drugDetailPath" placeholder="图片路径，直接输路径，cpoy用" type="text">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="状态">
            <el-col>
              <el-select v-model="drugDetail.drugDetailsStatus" placeholder="请选择状态">
                <el-option :value="1" label="有效"></el-option>
                <el-option :value="0" label="无效"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="规格">
            <el-col>
              <el-input v-model="drugDetail.drugSpecification" maxlength="20" placeholder="请输入品名" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>

          <!-- <el-form-item label="保质期（月）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入保质期（月）" show-word-limit
                v-model="drugDetail.drugShelfLife"></el-input></el-col>
          </el-form-item> -->
          <el-form-item label="编码">
            <el-col>
              <el-input v-model="drugDetail.drugNumber" maxlength="20" placeholder="请输入编码" show-word-limit
                        type="text">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="单价">
            <el-col>
              <el-input v-model="drugDetail.drugUnitPrice" maxlength="20" placeholder="请输入单价" show-word-limit
                        type="text"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="零售价">
            <el-col>
              <el-input v-model="drugDetail.drugRetailPrice" maxlength="20" placeholder="请输入零售价" show-word-limit
                        type="text"></el-input>
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
      pageInfo: {current: 0, size: 10},
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
        drugShelfLife: '',
        drugDetailPath: ''
      },
      fileList: ''
    }
  },

  created () {
    this.getDrugDetailsList()
  },
  methods: {
    filesuccess (response, file, fileList) {
      console.log(response)
      if (response.data !== null) {
        this.noti('上传')
      }
      this.drugDetail.drugDetailPath = response.data
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
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
            this.fileList = ''
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
            this.fileList = ''
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
      this.fileList = ''
      this.drugDetail = {}
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
      let changeData = {drugDetailsStatus: item.drugDetailsStatus, drugDetailId: item.drugDetailId}
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
        message: h('i', {style: 'color: teal'}, action + '成功')
      })
      this.getDrugDetailsList()
    },
    getDrugDetailsList () {
      console.log('pageInfo:>', this.pageInfo)
      // 获取药品分页列表
      axios({
        method: 'get',
        url: '/admin/drugdetail/page',
        params: {'current': this.pageInfo.current, 'size': this.pageInfo.size}
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
      this.fileList = row.drugDetailPath
      this.drugDetail = row
      this.fileList = this.drugDetail.drugDetailPath
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
        url: '/admin/drugdetail/online',
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
