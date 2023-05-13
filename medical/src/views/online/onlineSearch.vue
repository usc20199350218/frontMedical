<template>
    <div>
        <div class="condition"  >
            <el-row :height="20">
                <el-col :span="1">
                    <label>品类选择</label>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="typeId" placeholder="请选择"  @change="searchStart()">
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
                    <el-button @click="searchText = '', typeId = '',searchStart()">重置</el-button>
                </el-col>

                <el-col :span="2">
                    <el-button @click="backChoose()">选择店铺</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button icon="el-icon-shopping-cart-full">{{ shoppingCartNum }}</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="content"  >
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
                </el-table>
            </div>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]"
                    :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../utils/request'
export default {
  data () {
    return {
      storeId: '',
      drugDetailsList: [],
      pageInfo: { current: 0, size: 5 },
      typeId: '',
      typeList: [],
      searchMethod: '药品名称',
      searchText: '',
      search: '',
      shoppingCartNum: 0
    }
  },
  created () {
    this.storeId = this.$route.query.storeId
    this.getTypeList()

    this.searchStart()
  },
  methods: {
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
      this.getStaffList()
    },
    handleCurrentChange (val) {
      console.log('修改当前页')
      console.log(`当前页: ${val}`)
      this.pageInfo.current = val
      console.log(this.pageInfo)
      this.getStaffList()
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

<style></style>
