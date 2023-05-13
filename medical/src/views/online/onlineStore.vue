<template>
  <div class="main">
    <div  >
      <h1>请选择店铺</h1>
      <br />
      <div>
        <div class="storeMode" v-for="store in storeList" :key="store.storeId">
          <el-card shadow="hover">
            <img :src="store.storePath" class="image" />
            <div style="padding: 14px">
              <span class="storeName">{{ store.storeName }}</span>
              <hr />
              <span class="decss">{{ store.businessHours }}</span>
              <hr />
              <div class="bottom clearfix">
                <el-link type="danger" @click="enter(store)">进店</el-link>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!-- <div v-if="!showStore" style="background-color: aquamarine;">
      <div class="condition" style="background-color: antiquewhite;">
        <el-row :height="20">
          <el-col :span="1">
            <label>品类选择</label>
          </el-col>
          <el-col :span="2">
            <el-select v-model="typeId" placeholder="请选择">
              <el-option v-for="type in typeList" :key="type.typeId" :label="type.typeName" :value="type.typeId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <el-button @click="clean()">清理</el-button>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>

          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select">
              <el-select v-model="searchMethod" slot="prepend" placeholder="请选择" @change="searchStart()">
                <el-option label="药品名称" value="1"></el-option>
                <el-option label="药品编号" value="2"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-searchStart" @click="searchStart()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button @click="searchText = '', typeId = ''">重置</el-button>
          </el-col>

          <el-col :span="2">
            <el-button @click="showStore = true">选择店铺</el-button>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-shopping-cart-full">{{ shoppingCartNum }}</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content" style="background-color: azure;">
        <div>
          <div>
            <el-table :data="drugDetailsList.filter(
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
                  <span v-if="drugDetailsList.row.cartsNum !== ''">{{ drugDetailsList.row.cartsNum }}</span>
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
            </el-table>
          </div>
        </div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]" :page-size="pageInfo.size"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
          </el-pagination>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
import axios from '../../utils/request'
export default {
  data () {
    return {
      search: '',
      showStore: true,
      storeList: [],
      pageInfo: { current: 0, size: 5 }
    }
  },
  created () {
    this.getStoreList()
  },
  methods: {
    handleSizeChange (val) {
      console.log('修改条数')
      console.log(`每页 ${val} 条`)
      this.pageInfo.size = val
      console.log(this.pageInfo)
      this.getStaffList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getStaffList()
    },
    getStoreList () {
      axios({
        method: 'get',
        url: '/api/online/store'
      }).then((jsondata) => {
        console.log(jsondata)
        this.storeList = jsondata.data
      })
    },
    enter (store) {
      console.log('打开id为', store, '的店铺')
      this.storeId = store.storeId
      this.storeName = store.storeName
      this.$router.push({
        path: '/online/index',
        query: { storeId: this.storeId, storeName: this.storeName }
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
