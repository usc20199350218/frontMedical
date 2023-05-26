<template>
  <div>
    <el-row>
      <el-col :span="1" style="float: left;">
        <el-input v-model="searchText" class="input-with-select" placeholder="请输入内容" style="width: 50vw;">
          <el-select slot="prepend" v-model="storeId" placeholder="请选择店铺" style="width: 15vw;" @change="searchF()">
            <el-option v-for="store in storeList" :key="store.storeId" :label="store.storeName"
                       :value="store.storeId"></el-option>
          </el-select>
          <el-select slot="prepend" v-model="searchMethod" placeholder="请选择搜索方式" style="width: 8vw;"
                     @change="searchF()">
            <el-option label="药品名称" value="药品名称"></el-option>
            <el-option label="药品编号" value="药品编号"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchF()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row style="height: 60vh;">
      <!-- <el-col :span="12" style="background-color: aqua;"> -->
      <el-table ref="multipleTable" :data="scDrugList" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.drugDetailPath" width="100px" alt="">
          </template>
        </el-table-column>
        <el-table-column label="品名" width="120">
          <template slot-scope="scope">{{ scope.row.drugName }}</template>
        </el-table-column>
        <el-table-column label="规格" prop="drugSpecification" width="120">
        </el-table-column>
        <el-table-column label="单价" prop="drugRetailPrice" width="120">
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number" :max="50" :min="1" controls-position="right"
                             size="mini" style="width: 80px;" @change="sizeChange(scope.row)"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <div>
          <span style="float: left;">
            总金额
            {{ totalPrice }} 元
          </span>

        <el-button @click="settlement()">结算</el-button>
      </div>
      <div>
        <!-- <el-button @click="settlement()">结算</el-button> -->
      </div>
      <!-- </el-col> -->
    </el-row>

    <div class="left">

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
      storeId: '',
      userId: mystore.state.user.userId,
      searchMethod: '药品名称',
      showStoreList: '',
      storeList: [],
      searchText: '',
      scDrugList: [],
      totalPrice: 0,
      temp: '',
      multipleSelection: []
    }
  },
  async created () {
    this.temp = this.$route.query.storeId

    await this.getStoreList()

    // 判断是从那边打开
    if (typeof this.temp !== 'undefined' && this.temp) {
      console.log('店铺进入')
      this.storeId = this.temp
      this.searchF()
    } else {
      console.log('外部进入')
      this.storeId = 1
      this.searchF()
    }
  },
  methods: {
    settlement () {
      // 遍历已选数据
      // this.multipleSelection
      // 获取详情，带入数据
      const list = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        list.push({'val': this.multipleSelection[i]})
      }
      // 进入confirm页面准备结算
      this.$router.push({
        path: '/online/confirm',
        query: {drugDetailList: list, storeId: this.storeId}
      })
    },
    sizeChange (val) {
      // 单独更新这条数据
      console.log('sizeChange:', val)
      console.log('sizeChange:', val.cartId)
      console.log('sizeChange:', val.number)
      const data = {
        cartId: val.cartId,
        number: val.number
      }
      console.log('data:', data)
      axios.put('/api/shopping_cart', Qs.stringify(data))
        .then((jsondata) => {
          console.log('更新jsondata:', jsondata)
        })
      this.calculate()
    },
    handleSelectionChange (val) {
      console.log('change', val)
      // this.calculate()
      this.multipleSelection = val
      console.log('multipleSelection', this.multipleSelection)
      this.calculate()
    },
    getStoreList () {
      axios({
        method: 'get',
        url: '/admin/store'
      }).then((jsondata) => {
        console.log('storeList:', jsondata)
        this.storeList = jsondata.data
      })
    },
    searchF () {
      console.log('this.storeId:', this.storeId)
      console.log('searchMethod:', this.searchMethod)
      axios({
        method: 'get',
        url: `/api/shopping_cart/search/` + this.userId,
        params: {
          searchMethod: this.searchMethod,
          searchText: this.searchText,
          storeId: this.storeId
        }
      }).then((jsondata) => {
        console.log('jsondata:', jsondata)
        this.scDrugList = jsondata.data
      })
    },
    calculate () {
      this.totalPrice = 0
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.totalPrice += this.multipleSelection[i].drugRetailPrice * this.multipleSelection[i].number
      }
    }
  }
}
</script>

<style></style>
