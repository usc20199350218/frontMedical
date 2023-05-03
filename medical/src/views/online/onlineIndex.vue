<template>
  <div>
    <div class="condition">
      <div>
        <h1>
          {{ storeName }}
        </h1>
      </div>
      <el-row :height="20">
        <el-col :span="1">
          <label>品类选择</label>
        </el-col>
        <el-col :span="2">
          <el-select v-model="typeId" placeholder="请选择" @change="searchStart()">
            <el-option v-for="type in typeList" :key="type.typeId" :label="type.typeName" :value="type.typeId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button @click="cleanTypeId()">清理</el-button>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>

        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select">
            <el-select v-model="searchMethod" slot="prepend" placeholder="请选择" @change="searchStart()">
              <el-option label="药品名称" value="1"></el-option>
              <el-option label="药品编号" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchStart()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button @click="searchText = '', typeId = '', searchStart()">重置</el-button>
        </el-col>

        <el-col :span="2">
          <el-button @click="backChoose()">选择店铺</el-button>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-shopping-cart-full" @click="toShoppingCart()">{{ shoppingCartNum }}</el-button>
        </el-col>
      </el-row>
    </div>
    <hr/>
    <div class="content">
      <div>
        <!-- <el-table :data="drugDetailsList.filter(
                  (data) =>
                      !search ||
                      data.drugName.toLowerCase().includes(search.toLowerCase())
              )
                  " fit stripe mix-height="100" style="width: 100%">
                  <el-table-column label="图片" min-width="125px">
                      <template slot-scope="drugDetailsList">
                          <img :src="drugDetailsList.row.drugDetailPath" width="100px" alt="图片">
                      </template>
                  </el-table-column>
                  <el-table-column label="品名" min-width="150px">
                      <template slot-scope="drugDetailsList">
                          <el-popover trigger="hover" placement="top">
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
                  <el-table-column label="售价" min-width="60px">
                      <template slot-scope="drugDetailsList">
                          <span style="margin-left: 10px">{{ drugDetailsList.row.drugRetailPrice }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="处方" min-width="60px">
                      <template slot-scope="drugDetailsList">
                          <span v-if="drugDetailsList.row.isRx == '0'">非处方药</span>
                          <span v-if="drugDetailsList.row.isRx == '1'">处方药</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="数量" min-width="60px">
                      <template slot-scope="drugDetailsList">
                          <span v-if="drugDetailsList.row.cartsNum !== ''">{{ drugDetailsList.row.cartsNum
                          }}</span>
                          <span v-if="drugDetailsList.row.isRx == ''">0</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="left" width="220px" fixed="right">
                      <template slot="header" slot-scope="drugDetailsList">
                          <el-col :span="14" v-if="drugDetailsList">
                              操作
                          </el-col>
                      </template>
                      <template slot-scope="drugDetailsList">
                          <el-button size="mini" v-if="drugDetailsList" @click="cHandleAdd(row)">编辑</el-button>
                          <el-button size="mini" v-if="drugDetailsList" @click="cHandleReduce(row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table> -->
        <div>
          <div class="storeMode" v-for="drugDetail in drugDetailsList" :key="drugDetail.storeId">
            <el-card shadow="hover">
              <img :src="drugDetail.drugDetailPath" class="image" />
              <div style="padding: 14px">
                <span class="storeName">{{ drugDetail.drugName }}</span>
                <hr />
                <span class="decss">{{ drugDetail.drugSpecification }}</span>
                <hr />
                <div class="bottom clearfix">
                  <el-link type="danger" @click="addCrat(drugDetail.drugId)">加入购物车</el-link>
                  |
                  <el-link type="danger" @click="settlement(drugDetail)">购买</el-link>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="block" style="clear: both;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.current" :page-sizes="[10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
          layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import mystore from '../../store'
import axios from '../../utils/request'
export default {
  data () {
    return {
      userId: mystore.state.user.userId,
      storeId: '',
      drugDetailsList: [],
      pageInfo: { current: 0, size: 20 },
      typeId: '',
      typeList: [],
      searchMethod: '药品名称',
      searchText: '',
      search: '',
      shoppingCartNum: 0,
      storeName: '店铺名称'
    }
  },
  created () {
    // this.storeId = 1
    this.storeId = this.$route.query.storeId
    this.storeName = this.$route.query.storeName
    this.getTypeList()

    this.searchStart()
  },
  methods: {
    toShoppingCart () {
      this.$router.push({
        path: '/online/shoppingcart',
        query: { storeId: this.storeId, storeName: this.storeName }
      })
    },
    settlement (val) {
      console.log('结算', val, this.userId)

      const list = [
        { val }
      ]
      list[0].val.confirmNum = 1
      console.log('list[0]', list[0])
      this.$router.push({
        path: '/online/confirm',
        query: { drugDetailList: list, storeId: this.storeId }
      })
    },
    addCrat (val) {
      console.log('添加购物车', val, this.userId)
      const data = {
        userId: this.userId,
        drugDetailId: val,
        storeId: this.storeId
      }
      axios({
        method: 'post',
        url: '/api/shopping_cart',
        data: Qs.stringify(data)
      }).then((jsondata) => {
        console.log('加入购物车jsondata:', jsondata)
        if (jsondata.code === '200') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }
      })
    },
    searchStart () {
      console.log('storeId', this.storeId)
      axios({
        method: 'get',
        url: `/api/online/` + this.storeId,
        params: {
          typeId: this.typeId,
          searchMethod: this.searchMethod,
          searchText: this.searchText,
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        console.log('药品搜索结果', jsondata)
        this.drugDetailsList = jsondata.data.records
        this.pageInfo = jsondata.data
      })
    },
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.searchStart()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.searchStart()
    },
    getTypeList () {
      axios({
        method: 'get',
        url: '/admin/type'
      }).then((jsondata) => {
        console.log(jsondata)
        this.typeList = jsondata.data
      })
    },
    cleanTypeId () {
      this.typeId = ''
      this.searchStart()
    },
    backChoose () {
      this.$router.push({
        path: '/online/store'
      })
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.storeName {
  display: -webkit-box;
  /*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 1;
  /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden;
  /*超出的文本隐藏*/
  text-overflow: ellipsis;
  /* 溢出用省略号*/
  -webkit-box-orient: vertical;
  /*伸缩盒子的子元素排列：从上到下*/
}

.decss {
  display: -webkit-box;
  /*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 2;
  /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden;
  /*超出的文本隐藏*/
  text-overflow: ellipsis;
  /* 溢出用省略号*/
  -webkit-box-orient: vertical;
  /*伸缩盒子的子元素排列：从上到下*/
}

/* .nowMovie{
  display: flex;
} */
.storeMode {
  float: left;
}

.el-card {
  width: 220px;
  height: 400px;
  margin-left: 30px;
  margin-bottom: 30px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  /* float: right; */
}

.image {
  width: 160px;
  height: 220px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

el-row {
  height: 10px;
}
</style>
