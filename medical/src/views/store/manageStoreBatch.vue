<template>
  <div>
    <div>
      <!-- diu 理解错误了，直接拿了店铺选择器的key当id -->
      <!-- 选择店铺的页面 -->
      <el-tabs v-model="activeStoreNum" type="card" @tab-click="chooseStore">
        <el-tab-pane v-for="(store, sindex ) in storeList" :key="sindex" :label="store.storeName">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="
        storeBatchList.filter(
          (data) =>
            !search ||
            data.drugName.toLowerCase().includes(search.toLowerCase())
        )
      " fit stripe mix-height="100" style="width: 100%">
        <el-table-column label="详情ID" min-width="80px" fixed="left">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.drugDetailId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品名" min-width="150px" fixed="left">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.drugName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" min-width="125px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品类" min-width="60px">
          <template slot-scope="storeBatchList">
            <span v-if="storeBatchList.row.isRx == '0'">非处方药</span>
            <span v-if="storeBatchList.row.isRx == '1'">处方药</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="125px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.drugSpecification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" min-width="75px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.drugUnitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="零售价（元）" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.drugRetailPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.totalCreated }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调货" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.totalNormalPurchase }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.totalSold }}</span>
          </template>
        </el-table-column>
        <el-table-column label="待清理" min-width="100px">
          <template slot-scope="batchsList">
            <span style="margin-left: 10px">{{ batchsList.row.totalExpired }}</span>
          </template>
        </el-table-column>
        <el-table-column label="禁售" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.totalNormalForbidden }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总数量" min-width="100px">
          <template slot-scope="storeBatchList">
            <span style="margin-left: 10px">{{ storeBatchList.row.totalAll }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width="300px" fixed="right">
          <template slot="header" slot-scope="storeBatchList">
            <el-col :span="14">
              <el-input v-model="search" size="mini" v-if="storeBatchList" placeholder="输入关键字搜索" />
            </el-col>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
              @click="addShowdialog()">添加</el-button>
          </template>
          <template slot-scope="storeBatchList">
            <el-button size="mini" type="primary"
              @click="handleLookUser(storeBatchList.$index, storeBatchList.row)">联系人</el-button>
            <el-button size="mini" type="primary"
              @click="handleLook(storeBatchList.$index, storeBatchList.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(storeBatchList.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增批次的话，可以设置选择药品id、品牌id、填写数量进行初步进货（前两者进行一个筛选），即创建 -->
    <!-- 到货之后就是通过编辑来更新，或者专门有按钮来设置，即更新 -->
    <!-- 不设置删除按钮，只设置禁用 / 取消禁用 -->
    <div>
      <!-- 对于新建批次,店铺id已经选择了在发送请求前添加上去就行,此时只需要确认_药品详情id_数量即可 -->
      <el-dialog title="新建批次" :visible.sync="showAdd">
        <el-form ref="form" :model="storeBatch" label-width="100px" size="mini">
          <el-form-item label="药品" min-width="150px" fixed="left">
            <el-select v-model="storeBatch.drugDetailId" filterable placeholder="请选择药品">
              <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                :label="item.drugName">
                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量（盒）">
            <el-col>
              <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                v-model="storeBatch.storeBatchPurchaseQuantity">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false, storeBatch = {}">取 消</el-button>
          <el-button type="primary" @click="addItem()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- <div>
            <el-dialog title="修改批次信息" :visible.sync="dialogFormVisibles">
                <el-form ref="form" :model="storeBatch" label-width="100px" size="mini">
                    <el-form-item label="药品" min-width="150px" fixed="left">
                        <el-select v-model="storeBatch.drugDetailId" filterable placeholder="请选择药品" :disabled="true">
                            <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                                :label="item.drugName">
                                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量（盒）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                                v-model="storeBatch.batchPurchaseQuantity"></el-input></el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer"> -->
    <!-- <el-button @click="getStoreBatchDetails(activeDrugDetailId, nowActiveName), dialogFormVisibles = false">取
              消</el-button> -->
    <!-- <el-button @click="closedialog(dialogFormVisibles)">取 消</el-button> -->
    <!-- <el-button
                        @click="dialogFormVisibles = false, getStoreBatchDetails(activeDrugDetailId, nowActiveName), storeBatch = {}">取
                        消</el-button>
                    <el-button type="primary" @click="updItem(), dialogFormVisibles = false, storeBatch = {}">确
                        定</el-button>
                </div>
            </el-dialog>
        </div> -->

    <!-- <div>
            <el-dialog title="修改批次信息" :visible.sync="changeAllShow">
                <el-form ref="form" :model="storeBatch" label-width="100px" size="mini">
                    <el-form-item label="药品" min-width="150px" fixed="left">
                        <el-select v-model="storeBatch.drugDetailId" filterable placeholder="请选择药品" :disabled="true">
                            <el-option v-for="item in drugDetailList" :key="item.drugDetailId" :value="item.drugDetailId"
                                :label="item.drugName">
                                {{ item.drugDetailId }}-{{ item.drugName }}-{{ item.drugSpecification }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计划数量（盒）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                                v-model="storeBatch.batchPurchaseQuantity"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="实际数量（盒）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                                v-model="storeBatch.batchPurchaseQuantity"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="生产日期">
                        <el-col>
                            <el-date-picker v-model="storeBatch.batchProductionDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="批号">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="批号" show-word-limit
                                v-model="storeBatch.batchNumber"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="保质期">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="保质期(月)" show-word-limit
                                v-model="storeBatch.batchValidityPeriod"></el-input></el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer"> -->
    <!-- <el-button @click="getStoreBatchDetails(activeDrugDetailId, nowActiveName), changeAllShow = false">取 消</el-button> -->
    <!-- <el-button @click="changeAllShow = false, storeBatch = {}">取 消</el-button>
                    <el-button type="primary" @click="updItem(), changeAllShow = false, storeBatch = {}">确 定</el-button>
                </div>
            </el-dialog>
        </div> -->

    <!-- <div>
            <el-dialog :title="drugName + ' 库存情况'" :visible.sync="dialogFormVisibleDetails" :max-width=this.maxWidth
                :close-on-click-modal="false"> -->
    <!-- <el-dialog :title="`<span style='color: red; font-weight: bold;'>${drugName}</span> 库存情况`"
          :visible.sync="dialogFormVisibleDetails" :max-width=this.maxWidth :close-on-click-modal="false"> -->
    <!-- 标签页标签头 -->
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane v-for="(itemStatus, index ) in batchStatusList" :key="index" :label="itemStatus">
                    </el-tab-pane>
                </el-tabs> -->
    <!-- 关于为什么不放入其中的原因在于放入其中会有明显卡顿 -->
    <!-- 对应内容 -->
    <!-- <el-table :data="
                    storeBatchDetailsList.filter(
                        (data) =>
                            !searchNew ||
                            data.batchId == searchNew
                    )
                " fit stripe mix-height="100" style="width: 100%">
                    <el-table-column label="批次ID" width="70px" fixed="left">
                        <template slot-scope="storeBatchDetailsList">
                            <span style="margin-left: 10px">{{ storeBatchDetailsList.row.storeBatchId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="批次编号" max-width="130px" fixed="left">
                        <template slot-scope="storeBatchDetailsList">
                            <el-popover trigger="hover" placement="top">
                                <p>编号: {{ storeBatchDetailsList.row.batchNumber }}</p>
                                <p>备注: {{ storeBatchDetailsList.row.remark }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <span style="margin-left: 10px">{{ storeBatchDetailsList.row.batchNumber }}</span>
                                </div>
                            </el-popover> -->
    <!-- <span style="margin-left: 10px">{{ storeBatchDetailsList.row.batchNumber }}</span> -->
    <!-- </template>
                    </el-table-column>
                    <el-table-column label="进货数量" max-width="100px">
                        <template slot-scope="storeBatchDetailsList">
                            <span style="margin-left: 10px">{{ storeBatchDetailsList.row.storeBatchPurchaseQuantity
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="目前数量" max-width="100px">
                        <template slot-scope="storeBatchDetailsList">
                            <span style="margin-left: 10px">{{ storeBatchDetailsList.row.storeBatchExistingQuantity
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产时间" width="125px">
                        <template slot-scope="storeBatchDetailsList">
                            <span style="margin-left: 10px">{{ storeBatchDetailsList.row.batchProductionDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="保质期" width="100px">
                        <template slot-scope="storeBatchDetailsList">
                            <span style="margin-left: 10px">{{ storeBatchDetailsList.row.batchValidityPeriod }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" width="270px" fixed="right">
                        <template slot="header" slot-scope="storeBatchDetailsList">
                            <el-col :span="14">
                                <el-input v-model="searchNew" size="mini" v-if="storeBatchDetailsList"
                                    placeholder="输入关键字搜索" />
                            </el-col> -->
    <!-- <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round
                  @click="addShowdialog">添加</el-button> -->
    <!-- <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" round @click="getDrugDetailList()
                                , showAdd = true">添加</el-button> -->
    <!-- this.getDrugDetailList()
                this.showAdd = true -->
    <!-- </template> -->
    <!-- <template slot-scope="storeBatchDetailsList">
                            <el-button size="mini"
                                @click="handleEditDetail(storeBatchDetailsList.$index, storeBatchDetailsList.row)">编辑</el-button> -->
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

    <!-- 通过变为进货 -->
    <!-- <el-button size="mini" type="primary"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'CREATED'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 'NORMAL_PURCHASE')">
                                通过
                            </el-button> -->
    <!-- 不通过变为禁止，且需要弹窗填写备注 -->
    <!-- <el-button size="mini" type="warning"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'CREATED'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 'FORBIDDEN')">
                                不通过
                            </el-button> -->
    <!-- 上架变为正常 -->
    <!-- <el-button size="mini" type="warning"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'NORMAL_PURCHASE'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 'SOLD')">
                                上架
                            </el-button> -->
    <!-- 禁止，需要弹窗填写利用 -->
    <!-- <el-button size="mini" type="danger"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'SOLD'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 'FORBIDDEN')">
                                禁止
                            </el-button> -->
    <!-- 销毁，数量变为零，需要弹窗 -->
    <!-- <el-button size="mini" type="danger"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'EXPIRED'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 0)">
                                销毁
                            </el-button> -->
    <!-- 恢复变为正常 -->
    <!-- <el-button size="mini" type="primary"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'FORBIDDEN'"
                                @click="batchStatusChange(storeBatchDetailsList.$index, storeBatchDetailsList.row, 'SOLD')">
                                恢复
                            </el-button>
                            <el-button size="mini" type="primary"
                                v-if="storeBatchDetailsList.row.storeBatchStatus === 'SOLD_OUT'"
                                @click="batchAdd(storeBatchDetailsList.$index, storeBatchDetailsList.row)">
                                +1
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table> -->
    <!-- </el-tab-pane>
          </el-tabs> -->
    <!-- </el-dialog>
        </div> -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
      </el-pagination>
    </div>
    <div>
      <el-dialog title="联系人" :visible.sync="showContactPerson">
        <span>{{ contactPerson }}</span>
      </el-dialog>
    </div>
    <!-- <div>
            <el-dialog title="添加备注" :visible.sync="RemarkShow">
                <el-form ref="form" :model="storeBatch" label-width="100px" size="mini">
                    <el-form-item label="备注">
                        <el-col>
                            <el-input type="text" maxlength="999" placeholder="备注" show-word-limit
                                v-model="storeBatch.remark"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="RemarkShow = false, storeBatch.remark = ''">取 消</el-button>
                    <el-button type="primary" @click="updItem(), RemarkShow = false, storeBatch.remark = ''">确 定</el-button>
                </div>
            </el-dialog>
        </div> -->
    <!-- <div>
            <el-dialog title="收货" :visible.sync="Receipt">
                <el-form ref="form" :model="storeBatch" label-width="100px" size="mini">
                    <el-form-item label="计划数量（盒）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" :disabled="true" show-word-limit
                                v-model="planNum"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="实际数量（盒）">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="请输入数量（盒）" show-word-limit
                                v-model="storeBatch.batchPurchaseQuantity"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="生产日期">
                        <el-col>
                            <el-date-picker v-model="storeBatch.batchProductionDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="批号">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="批号" show-word-limit
                                v-model="storeBatch.batchNumber"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="保质期">
                        <el-col>
                            <el-input type="text" maxlength="20" placeholder="保质期(月)" show-word-limit
                                v-model="storeBatch.batchValidityPeriod"></el-input></el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="Receipt = false, storeBatch = {}">取 消</el-button>
                    <el-button type="primary" @click="updItem(), Receipt = false, storeBatch = {}">确 定</el-button>
                </div>
            </el-dialog>
        </div> -->

  </div>
</template>

  <!-- 对于取消的按钮设计，全部改为val=false即可，不需要刷新 -->
  <!-- todo: 将所有的取消改为dialogFormVisible = false ，get***（）样式 -->
  <!-- todo: 将所有成功之后调用关闭的直接改，然后调用noti方法 -->
  <!-- TODO: 对于提交、更新按钮，设置为updItem(),val=false样式，精准关闭，这样不用再进行判断，直接关，而之前的取消设置刷新方法，太多余了 -->
  <!-- 关于取消是否需要刷新，应该是在涉及状态修改的按钮对应的窗体下的取消设置刷新，因为状态已经在前端进行了修改，而实际数据是取消了修改，所有应该是要刷新 -->
<script>
import Qs from 'qs'
import mystore from '../../store'
import axios from '../../utils/request'
export default {
  data () {
    return {
      // 分页信息
      pageInfo: { current: 0, size: 5 },
      // 详情分页信息，废弃，——数据量不大
      pageInfoNew: { current: 0, size: 5 },
      search: '',
      showAdd: false,
      dialogFormVisibles: false,
      dialogFormVisibleDetails: false,
      showContactPerson: false,
      drugDetailList: [],
      brandList: [],
      drugDetail: {
        drugId: '',
        brandId: '',
        drugDetailsStatus: '',
        drugSpecification: '',
        drugShelfLife: ''
      },
      storeBatchList: [],
      storeBatchStatus: 'kong',
      storeBatch: {},
      storeBatchDetailsList: [],
      maxWidth: '190%',
      contactPerson: '',
      activeName: '0',
      batchStatusList: [],
      activeDrugDetailId: '',
      searchNew: '',
      Receipt: false,
      planNum: '',
      RemarkShow: false,
      changeAllShow: false,
      batchName: '',
      drugName: '',
      drugDetailId: '',
      nowActiveName: '',
      drugList: [],
      roleId: mystore.state.user.roleId,
      storeList: [],
      showChooseStore: false,
      activeStoreNum: '0',
      activeStoreId: '0',
      nowActiveStore: ''
    }
  },

  created () {
    // 先获取全部
    this.getStoreList()
  },
  methods: {
    // 1.创建之后获取店铺list
    async getStoreList () {
      try {
        const response = await axios.get('/admin/store')
        this.storeList = response.data
        if (this.storeList !== '') {
          console.log('获取店铺list:', this.storeList)
          // 执行获取当前店铺总详情方法
          await this.getStoreBatchList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 2.获取当前店铺批次概览数据
    async getStoreBatchList () {
      console.log('店铺批次pageInfo:>', this.pageInfo)
      this.activeStoreId = this.storeList[this.activeStoreNum].storeId
      // 获取库存分页列表
      try {
        const response = await axios.get(`/admin/store_batch/page/` + this.activeStoreId, {
          params: { 'current': this.pageInfo.current, 'size': this.pageInfo.size }
        })
        if (response.data.records !== '') {
          this.storeBatchList = response.data.records
          console.log('获取整体storeBatchList:', response.data.records)
          this.pageInfo = response.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 3.更改选择的店铺之后触发
    chooseStore () {
      console.log('activeStoreNum:', this.activeStoreNum)
      // 更新当前店铺的id
      console.log('activeStoreNum:', this.activeStoreNum)
      console.log('this.storeList[this.activeStoreNum]:', this.storeList[this.activeStoreNum])
      this.activeStoreId = this.storeList[this.activeStoreNum].storeId
      console.log('activeStoreId:', this.activeStoreId)
      this.getStoreBatchList()
    },
    // 4.分页调整
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getStoreBatchList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getStoreBatchList()
    },
    // 5.新增店内批次
    // showAdd——>addItem
    addShowdialog () {
      // 开启前获取药品详情数据
      this.getDrugDetailList()
      // 添加前清理数据,防止未清理数据直接使用
      this.storeBatch = {}
      // 开启弹窗
      this.showAdd = true
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
    addItem () {
      // 添加店铺信息
      console.log(this.activeStoreId)
      this.storeBatch.storeId = this.activeStoreId
      console.log('即将添加的批次:', this.storeBatch)
      axios({
        method: 'post',
        url: '/admin/store_batch',
        data: Qs.stringify(this.storeBatch)
      }).then((jsondata) => {
        console.log(jsondata)
        if (jsondata.code === '200') {
          this.noti('提交')
          this.showAdd = false
          this.storeBatch = {}
        }
      })
        .then(console.error())
      this.getStoreBatchList()
    },
    noti (action) {
      const h = this.$createElement
      this.$notify({
        title: '操作成功',
        message: h('i', { style: 'color: teal' }, action + '成功')
      })
      this.getStoreBatchList()
    },
    // 6.查看联系人
    handleLookUser (index, row) {
      console.log(index)
      console.log(row)
      axios({
        method: 'get',
        url: `/admin/user/drugdetailid/` + row.drugDetailId
      }).then(jsondata => {
        this.contactPerson = jsondata.data
        this.showContactPerson = true
      })
    },
    // 7.删除当前店内药品
    handleDelete (row) {
      console.log('删除的drugDetailId:', row.drugDetailId)
      this.$confirm('此操作将永久删除对应数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.delBatch()
        axios({
          method: 'delete',
          url: `/admin/store_batch/` + this.activeStoreId + `/` + row.drugDetailId
        })
          .then(
            (jsondata) => {
              console.log('删除', jsondata.data)
              if (jsondata.code === '200') {
                this.noti('删除')
              }
            }).then(console.error())
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getNewStoreBatchDetails (activeDrugDetailId, nowActiveName, nowActiveStore) {
      axios({
        method: 'get',
        url: `/admin/store_batch/detail/` + activeDrugDetailId,
        params: { 'active': nowActiveName, 'store': nowActiveStore }
      }).then(jsondata => {
        this.storeBatchDetailsList = jsondata.data
        console.log('storeBatchDetailsList:', this.storeBatchDetailsList)
      })

      //   this.dialogFormVisibleDetails = true
    },
    handleClick (tab, event) {
      console.log('切换', tab, event)
      console.log('此时为', this.activeName)
      this.nowActiveName = this.batchStatusList[this.activeName]
      console.log('此时状态中文为', this.batchStatusList[this.activeName])
      this.getStoreBatchDetails(this.activeDrugDetailId, this.batchStatusList[this.activeName])
    },
    updItem () {
      console.log('更新batch:', this.storeBatch)
      axios({
        method: 'put',
        url: '/admin/storeBatch',
        data: Qs.stringify(this.storeBatch)
      })
        .then((jsondata) => {
          console.log(jsondata)
          if (jsondata.code === '200') {
            this.noti('提交')
          }
        })
        .then(console.error())
    },

    closedialog (val) {
      this.value[val] = !this.value[val]
      console.log(val, 'val:', this[val])
      this.storeBatch = {

      }
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
    async getStatusList (row) {
      // 异步获取批次状态枚举List，用于展示标签页按钮
      await axios({
        method: 'get',
        url: '/admin/batch/status'
      }).then(jsondata => {
        this.batchStatusList = jsondata.data
        console.log('批次状态List:', this.batchStatusList)
        console.log('activeName', this.activeName)
        console.log('状态为:', this.batchStatusList[this.activeName])
        this.nowActiveName = this.batchStatusList[this.activeName]
        this.batchDetail = row.drugName
        this.getStoreBatchDetails(row.drugDetailId, this.nowActiveName)
        // this.getStoreBatchDetails(row.drugDetailId, this.batchStatusList[this.activeName])
        // this.getStoreBatchDetails(this.activeDrugDetailId, this.batchStatusList[this.activeName])
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
    getStoreBatchDetails (drugDetailId, active) {
      console.log('active', active)
      axios({
        method: 'get',
        url: `/admin/store_batch/detail/` + drugDetailId,
        params: { 'active': active }
      }).then(jsondata => {
        this.storeBatchDetailsList = jsondata.data
        console.log('storeBatchDetailsList:', this.storeBatchDetailsList)
      })

      //   this.dialogFormVisibleDetails = true
    },
    handleLook (index, row) {
      // 查看按钮点击
      this.drugName = row.drugName
      // 药品详情id
      this.activeDrugDetailId = row.drugDetailId
      // 获取状态list
      this.getStatusList(row)
      console.log('此时activeName', this.activeName)
    },
    handleEditDetail (index, row) {
      // CREATED( "创建" ),
      // NORMAL_PURCHASE( "正常进货" )
      console.log('编辑', row)
      this.storeBatch = row
      // 获取药品批次详情列表，展示药品名称，可以考虑设置val来替代
      this.getDrugDetailList()
      // 根据批次状态展示弹窗
      if (row.storeBatchStatus === 'CREATED' || row.storeBatchStatus === 'NORMAL_PURCHASE') {
        // console.log('编辑', row)
        // this.storeBatch = row
        this.dialogFormVisibles = true
      } else {
        this.changeAllShow = true
      }
    },
    batchStatusChange (index, row, target) {
      // 先赋值，在前端修改状态，后面传回给后端
      row.storeBatchStatus = target
      this.storeBatch = row
      // 上架,根据日期是否填写来判断进货还是销售
      if (target === 'SOLD' && row.batchProductionDate == null) {
        // // 填补数据，走新增的方法
        // this.planNum = row.batchPurchaseQuantity
        // // 开启收货弹窗，之后更新即可
        // this.Receipt = true
        // console.log('新进药品', row)
        // return
        // 状态变为进货
        this.storeBatch.storeBatchStatus = 'NORMAL_PURCHASE'
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
      // 调用更新方法
      this.changeBatchStatus(row, target)
    },
    changeBatchStatus (item, target) {
      // 更新状态
      axios({
        method: 'put',
        // url: '/admin/storeBatch/detail',
        url: '/admin/storeBatch/',
        data: Qs.stringify(item)
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
