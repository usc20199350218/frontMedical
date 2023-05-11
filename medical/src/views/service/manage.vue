<template>
    <div>
        <div>
            <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select">
                <el-select v-model="searchMethod" slot="prepend" placeholder="请选择" style="width: 150px;">
                    <el-option label="编号" value="num"></el-option>
                    <el-option label="内容" value="text"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" type="primary" @click="searchStart()">搜索</el-button>
                <el-button slot="append" icon="el-icon-circle-plus-outline" @click="addServiceBtn()"></el-button>
            </el-input>
        </div>
        <div>
            <el-table :data="serviceList" style="width: 100%">
                <el-table-column label="服务Id">
                    <template slot-scope="serviceList">
                        <span style="margin-left: 10px">{{ serviceList.row.serviceEntryId }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="服务名称">
                    <template slot-scope="serviceList">
                        <span style="margin-left: 10px">{{ serviceList.row.serviceEntryName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="说明">
                    <template slot-scope="serviceList">
                        <el-popover trigger="hover" placement="top">
                            <p>详情: {{ serviceList.row.remark }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ serviceList.row.remark | ellipsis }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="serviceList">
                        <el-button size="mini" @click="changeService(serviceList.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageInfo.current" :page-sizes="[5, 10, 20, 30, 100, 1000, 10000]"
                    :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
                </el-pagination>
            </div>
        </div>
        <div>
            <el-dialog :title="titText" :visible.sync="showEdit" width="30%" :before-close="handleClose">
                <el-form ref="form" :model="services" label-width="80px">
                    <el-form-item label="服务名称">
                        <el-input v-model="services.serviceEntryName"></el-input>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input v-model="services.remark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close()">取 消</el-button>
                    <el-button type="primary" @click="saveService()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Qs from 'qs'
// import slice from 'lodash'
import axios from '../../utils/request'
export default {
  // 过滤
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      }
      return value
    }
  },
  data () {
    return {
      searchText: '',
      searchMethod: 'text',
      serviceList: [],
      pageInfo: { current: 0, size: 5, total: 0 },
      services: {},
      showEdit: false,
      titText: '详情'
    }
  },
  created () {
    this.searchStart()
  },
  methods: {
    saveService () {
      axios.post('/admin/service_entry', Qs.stringify(this.services)).then((jsondata) => {
        console.log('新增', jsondata)
        if (jsondata.code === '200') {
          this.showEdit = false
          this.services = {}
          this.searchStart()
          this.titText = '详情'
        }
      })
    },
    close () {
      this.services = {}
      this.showEdit = false
    },
    addServiceBtn () {
      this.titText = '新增'
      this.services = {}
      this.showEdit = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    changeService (row) {
      console.log('row:', row)
      this.titText = '新增'
      this.services = row
      this.showEdit = true
    },
    searchStart () {
      console.log('searchStart')
      axios.get('/admin/service_entry/page', {
        params: {
          searchMethod: this.searchMethod,
          searchText: this.searchText,
          current: this.pageInfo.current,
          size: this.pageInfo.size
        }
      }).then((jsondata) => {
        console.log('搜索结果:', jsondata)
        this.serviceList = jsondata.data.records
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
    }
  }
}
</script>

<style></style>
