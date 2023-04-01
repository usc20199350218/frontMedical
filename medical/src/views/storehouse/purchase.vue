<template>
  <div>
    <el-table :data="
      batchsList.filter(
        (data) =>
          !search ||
          data.drugName.toLowerCase().includes(search.toLowerCase())
      )
    " fit stripe mix-height="100" style="width: 100%">
      <el-table-column label="药品详情ID" min-width="80px" fixed="left">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.drugDetailId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品名" min-width="150px" fixed="left">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.drugName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="125px">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类" min-width="60px">
        <template slot-scope="batchsList">
          <span v-if="batchsList.row.isRx == '0'">非处方药</span>
          <span v-if="batchsList.row.isRx == '1'">处方药</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="125px">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.drugSpecification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）" min-width="125px">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.drugUnitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="零售价（元）" min-width="125px">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.drugRetailPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="125px">
        <template slot-scope="batchsList">
          <span style="margin-left: 10px">{{ batchsList.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" width="320px" fixed="right">
        <template slot="header" slot-scope="batchsList">
          <el-col :span="14">
            <el-input v-model="search" size="mini" v-if="batchsList" placeholder="输入关键字搜索" />
          </el-col>
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
            @click="addShowdialog">添加</el-button>
        </template>
        <template slot-scope="batchsList">
          <el-button size="mini" type="primary" @click="handleLookUser(batchsList.$index, batchsList.row)">联系人</el-button>
          <el-button size="mini" type="primary" @click="handleLook(batchsList.$index, batchsList.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(batchsList.$index, batchsList.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增批次的话，可以设置选择药品id、品牌id、填写数量进行初步进货（前两者进行一个筛选），即创建 -->
    <!-- 到货之后就是通过编辑来更新，或者专门有按钮来设置，即更新 -->
    <!-- 不设置删除按钮，只设置禁用 / 取消禁用 -->
    <div>
      <el-dialog title="新数据" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="batch" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="batch.drugDetailId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                :label="item.drugName">
                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="batch.batchPurchaseQuantity"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(dialogFormVisible)">取 消</el-button>
          <el-button type="primary" @click="addItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="修改数据" :visible.sync="dialogFormVisibles">
        <el-form ref="form" :model="batch" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="batch.drugDetailId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                :label="item.drugName">
                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="batch.batchPurchaseQuantity"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(dialogFormVisibles)">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="修改数据" :visible.sync="changeAllShow">
        <el-form ref="form" :model="batch" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="batch.drugDetailId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                :label="item.drugName">
                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="batch.batchPurchaseQuantity"></el-input></el-col>
          </el-form-item>
          <el-form-item label="实际数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="batch.batchPurchaseQuantity"></el-input></el-col>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-col>
              <el-date-picker v-model="batch.batchProductionDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="批号">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="批号" show-word-limit
                v-model="batch.batchNumber"></el-input></el-col>
          </el-form-item>
          <el-form-item label="保质期">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="保质期(月)" show-word-limit
                v-model="batch.batchValidityPeriod"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(changeAllShow)">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="详情" :visible.sync="dialogFormVisibleDetails" :max-width=this.maxWidth
        :close-on-click-modal="false">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(itemStatus, index ) in batchStatusList" :key="index" :label="itemStatus"></el-tab-pane>
        </el-tabs>
        <el-table :data="
          batchDetailsList.filter(
            (data) =>
              !searchNew ||
              data.batchId == searchNew
          )
        " fit stripe mix-height="100" style="width: 100%">
          <el-table-column label="ID" width="70px" fixed="left">
            <template slot-scope="batchDetailsList">
              <span style="margin-left: 10px">{{ batchDetailsList.row.batchId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编号" max-width="130px" fixed="left">
            <template slot-scope="batchDetailsList">
              <el-popover trigger="hover" placement="top">
                <p>编号: {{ batchDetailsList.row.batchNumber }}</p>
                <p>备注: {{ batchDetailsList.row.remark }}</p>
                <div slot="reference" class="name-wrapper">
                  <span style="margin-left: 10px">{{ batchDetailsList.row.batchNumber }}</span>
                </div>
              </el-popover>
              <!-- <span style="margin-left: 10px">{{ batchDetailsList.row.batchNumber }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="进货数量" max-width="100px">
            <template slot-scope="batchDetailsList">
              <span style="margin-left: 10px">{{ batchDetailsList.row.batchPurchaseQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目前数量" max-width="100px">
            <template slot-scope="batchDetailsList">
              <span style="margin-left: 10px">{{ batchDetailsList.row.batchExistingQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产时间" width="125px">
            <template slot-scope="batchDetailsList">
              <span style="margin-left: 10px">{{ batchDetailsList.row.batchProductionDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="保质期" width="100px">
            <template slot-scope="batchDetailsList">
              <span style="margin-left: 10px">{{ batchDetailsList.row.batchValidityPeriod }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" width="270px" fixed="right">
            <template slot="header" slot-scope="batchDetailsList">
              <el-col :span="14">
                <el-input v-model="searchNew" size="mini" v-if="batchDetailsList" placeholder="输入关键字搜索" />
              </el-col>
              <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
                @click="addShowdialog">添加</el-button>
            </template>
            <template slot-scope="batchDetailsList">
              <el-button size="mini"
                @click="handleEditDetail(batchDetailsList.$index, batchDetailsList.row)">编辑</el-button>
              <!-- 批次状态/0-创建/1-正常/2-售完/3-过期/4-禁止-后期增加/ -->
              <!-- 创建对应编辑、通过、不通过 -->
              <!-- 正常进货对应编辑 -->
              <!-- 正常销售对应编辑、禁止 -->
              <!-- 售完对应快速进货，如何默认选择一样进货数量，等待确认 -->
              <!-- 过期对应销毁，销毁清零，然后修改为null -->
              <!-- 禁止对应原状态，具体看编号是否存在，以区分进货与售卖 -->
              <!-- CREATED( "创建" ),
    NORMAL_PURCHASE( "正常进货" ),
    SOLD( "正常销售" ),
    SOLD_OUT( "售完" ),
    EXPIRED( "过期" ),
    FORBIDDEN( "禁止" ); -->

              <!-- 通过变为正常进货 -->
              <el-button size="mini" type="primary" v-if="batchDetailsList.row.batchStatus === 'CREATED'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 'NORMAL_PURCHASE')">
                通过
              </el-button>
              <!-- 不通过变为禁止，且需要弹窗填写备注 -->
              <el-button size="mini" type="warning" v-if="batchDetailsList.row.batchStatus === 'CREATED'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 'FORBIDDEN')">
                不通过
              </el-button>
              <!-- 上架变为正常销售 -->
              <el-button size="mini" type="warning" v-if="batchDetailsList.row.batchStatus === 'NORMAL_PURCHASE'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 'SOLD')">
                上架
              </el-button>
              <!-- 禁止，需要弹窗填写利用 -->
              <el-button size="mini" type="danger" v-if="batchDetailsList.row.batchStatus === 'SOLD'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 'FORBIDDEN')">
                禁止
              </el-button>
              <!-- 销毁，数量变为零，需要弹窗 -->
              <el-button size="mini" type="danger" v-if="batchDetailsList.row.batchStatus === 'EXPIRED'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 0)">
                销毁
              </el-button>
              <!-- 恢复变为正常销售 -->
              <el-button size="mini" type="primary" v-if="batchDetailsList.row.batchStatus === 'FORBIDDEN'"
                @click="batchStatusChange(batchDetailsList.$index, batchDetailsList.row, 'SOLD')">
                恢复
              </el-button>
              <el-button size="mini" type="primary" v-if="batchDetailsList.row.batchStatus === 'SOLD_OUT'"
                @click="batchAdd(batchDetailsList.$index, batchDetailsList.row)">
                +1
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog title="联系人" :visible.sync="dialogVisible">
        <span>{{ contactPerson }}</span>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="备注" :visible.sync="RemarkShow">
        <el-form ref="form" :model="batch" label-width="100px" size="mini">
          <el-form-item label="备注">
            <el-col>
              <el-input type="text" maxlength="999" placeholder="备注" show-word-limit v-model="batch.remark"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(RemarkShow)">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="收货" :visible.sync="Receipt">
        <el-form ref="form" :model="batch" label-width="100px" size="mini">
          <el-form-item label="计划数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" :disabled="true" show-word-limit
                v-model="planNum"></el-input></el-col>
          </el-form-item>
          <el-form-item label="实际数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="batch.batchPurchaseQuantity"></el-input></el-col>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-col>
              <el-date-picker v-model="batch.batchProductionDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="批号">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="批号" show-word-limit
                v-model="batch.batchNumber"></el-input></el-col>
          </el-form-item>
          <el-form-item label="保质期">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="保质期(月)" show-word-limit
                v-model="batch.batchValidityPeriod"></el-input></el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closedialog(Receipt)">取 消</el-button>
          <el-button type="primary" @click="updItem">确 定</el-button>
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
      pageInfo: { current: 0, size: 5 },
      pageInfoNew: { current: 0, size: 5 },
      search: '',
      dialogFormVisible: false,
      dialogFormVisibles: false,
      dialogFormVisibleDetails: false,
      dialogVisible: false,
      drugDetailList: [],
      brandList: [],
      drugDetail: {
        drugId: '',
        brandId: '',
        drugDetailsStatus: '',
        drugSpecification: '',
        drugShelfLife: ''
      },
      batchsList: [],
      batchStatus: -1,
      batch: {},
      batchDetailsList: [],
      maxWidth: '190%',
      contactPerson: '',
      activeName: '0',
      batchStatusList: [],
      activeDrugDetailId: '',
      searchNew: '',
      Receipt: false,
      planNum: '',
      RemarkShow: false,
      changeAllShow: false
    }
  },

  created () {
    // 先获取全部用户
    this.getBatchsList()
  },
  methods: {
    handleClick (tab, event) {
      console.log('切换', tab, event)
      console.log('此时为', this.activeName)
      console.log('此时状态中文为', this.batchStatusList[this.activeName])
      this.getBatchDetails(this.activeDrugDetailId, this.batchStatusList[this.activeName])
    },
    updItem () {
      console.log('更新batch:', this.batch)
      axios({
        method: 'put',
        url: '/admin/batch',
        data: Qs.stringify(this.batch)
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
      console.log('即将添加的批次:', this.batch)
      axios({
        method: 'post',
        url: '/admin/batch',
        data: Qs.stringify(this.batch)
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          this.closedialog(1)
          this.noti('提交')
        }
      })
        .then(console.error())
      this.getBatchsList()
    },
    closedialog (val) {
      //       dialogFormVisible: false,
      // dialogFormVisibles: false,
      // dialogFormVisibleDetails: false,
      // dialogVisible: false,
      // Receipt: false,
      // RemarkShow: false,
      // changeAllShow: false

      // if (val === 1) { this.dialogFormVisible = false } else if (val === 2) { this.dialogFormVisibles = false } else if (val === 3) { this.dialogFormVisibleDetails = false } else if (val === 'RemarkShow') {
      //   this.RemarkShow = false
      // } else {
      //   this.dialogFormVisible = false
      //   this.dialogFormVisibles = false
      //   this.dialogFormVisibleDetails = false
      // }
      this[val] = false
      this.batch = {

      }
    },
    addShowdialog () {
      // 添加前展示
      // 只能选择相关信息，然后输入数量、生产日期、批号
      // this.getBrandList()
      this.getDrugDetailList()
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getBatchsList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getBatchsList()
    },
    drugStateChaged (item) {
      console.log('change', item)
      let changeData = { drugDetailsStatus: item.drugDetailsStatus, drugDetailsId: item.drugDetailsId }
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
      this.getBatchsList()
    },
    async getBatchStatusList (row) {
      await axios({
        method: 'get',
        url: '/admin/batch/status'
      }).then(jsondata => {
        this.batchStatusList = jsondata.data

        console.log('批次状态List:', this.batchStatusList)
        console.log('此时为', this.activeName)
        console.log('activeName', this.activeName)
        console.log('状态为:', this.batchStatusList[this.activeName])
        this.batchDetail = row.drugName
        this.getBatchDetails(row.drugDetailId, this.batchStatusList[this.activeName])
      })
    },
    getBrandList () {
      axios({
        method: 'get',
        url: '/admin/brand'
      }).then(jsondata => {
        this.brandList = jsondata.data
        console.log('获取brandList:', this.brandList)
      })
    },
    getDrugDetailList () {
      axios({
        method: 'get',
        url: '/admin/drugdetail/drugvo'
      }).then(jsondata => {
        this.drugDetailList = jsondata.data
        console.log('获取drugList:', this.drugDetailList)
      })
    },
    getBatchsList () {
      console.log('pageInfo:>', this.pageInfo)
      // 获取库存分页列表
      axios({
        method: 'get',
        url: `/admin/batch/page/` + this.batchStatus,
        params: { 'current': this.pageInfo.current, 'size': this.pageInfo.size }
      }).then((jsondata) => {
        this.batchsList = jsondata.data.records
        console.log('batchsList:', jsondata.data.records)
        this.pageInfo = jsondata.data
        // console.log(jsondata.data[0].usersDetail)
      })
    },
    getBatchDetails (drugDetailId, active) {
      console.log('active', active)
      axios({
        method: 'get',
        url: `/admin/batch/detail/` + drugDetailId,
        params: { 'active': active }
      }).then(jsondata => {
        this.batchDetailsList = jsondata.data
        console.log('batchDetailsList:', this.batchDetailsList)
      })

      this.dialogFormVisibleDetails = true
    },
    handleLookUser (index, row) {
      console.log(index)
      console.log(row)
      axios({
        method: 'get',
        url: `/admin/user/drugdetailid/` + row.drugDetailId
      }).then(jsondata => {
        this.contactPerson = jsondata.data
        this.dialogVisible = true
      })
    },
    handleLook (index, row) {
      // 药品详情id
      this.activeDrugDetailId = row.drugDetailId
      // 获取状态list
      this.getBatchStatusList(row)
      console.log('此时activeName', this.activeName)
      // this.batchDetail = row.drugName
      // this.getBatchDetails(row.drugDetailId, this.batchStatusList[this.activeName])
      // console.log('activeName', this.activeName)
      // console.log('状态为:', this.batchStatusList[this.activeName])
      // this.batchDetail = row.drugName
      // this.getBatchDetails(row.drugDetailId, this.batchStatusList[this.activeName])
    },
    handleDelete (index, row) {
      console.log('删除的drugDetailId:', row.drugDetailId)
      this.$confirm('此操作将永久删除对应数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBatch(row.drugDetailId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    delBatch (drugDetailId) {
      axios({
        method: 'delete',
        url: `/admin/batch/` + drugDetailId
      })
        .then(
          (jsondata) => {
            console.log('删除', jsondata.data)
            if (jsondata.code === '200') {
              this.noti('删除')
            }
          }).then(console.error())
    },
    handleEditDetail (index, row) {
      // CREATED( "创建" ),
      // NORMAL_PURCHASE( "正常进货" )
      console.log('编辑', row)
      this.batch = row
      if (row.batchStatus === 'CREATED' || row.batchStatus === 'NORMAL_PURCHASE') {
        // console.log('编辑', row)
        // this.batch = row
        this.dialogFormVisibles = true
      } else {
        this.changeAllShow = true
      }
    },
    batchStatusChange (index, row, target) {
      // 先赋值
      row.batchStatus = target
      this.batch = row
      // 上架
      if (target === 'SOLD' && row.batchProductionDate == null) {
        // 填补数据，走新增的方法
        this.planNum = row.batchPurchaseQuantity
        // 开启收货弹窗，之后更新即可
        this.Receipt = true
        console.log('新进药品', row)
        return
      } else if (target === 'FORBIDDEN') {
        // 填写备注
        console.log('禁止', row)
        // todo 备注弹窗
        this.RemarkShow = true
        return
      } else if (target === 0) {
        console.log('销毁', row)
        // 更新为零 将sql语句加一条num不为零
        row.batchExistingQuantity = 0
      }

      axios({
        method: 'put',
        url: '/admin/batch/detail',
        data: Qs.stringify(row)
      }).then(jsondata => {
        console.log(jsondata.data)
        this.noti(target)
      })
    }
  }
}
</script>

<!-- todo 优化关闭窗口 -->
<style></style>
