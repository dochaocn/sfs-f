<template>
  <div>
    <el-form :inline="true" ref="form" :model="form" label-width="auto" label-suffix=":" size="mini">
      <el-row>
        <el-form-item label="id">
          <el-input v-model="form.did" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item label="key值">
          <el-input v-model="form.dkey" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.dupdate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                          style="width: 180px"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" round @click="queryMessage('query')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round @click="dialogFormVisible = true">新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-col :push="6">
      <el-pagination
          background
          layout="total, prev, pager, next"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
      />
    </el-col>

    <el-col :push="4">
      <el-table :data="tableData" border style="width: 60%">
        <el-table-column resizable prop="did" label="id" width="50"/>
        <el-table-column resizable prop="dkey" label="key值" width="100"/>
        <el-table-column resizable prop="dmsg" label="传输信息"/>
        <el-table-column resizable prop="dupdate" label="录入时间" width="200"/>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog title="新增信息" :visible.sync="dialogFormVisible">
      <el-form :model="model">
        <el-form-item label="key值" :label-width="formLabelWidth">
          <el-input v-model="model.key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="传输信息" :label-width="formLabelWidth">
          <el-input v-model="model.message" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMessage">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Message",
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }]
      },
      form: {
        did: '',
        dkey: '',
        dupdate: '',
      },
      tableData: [],
      total: 0,
      currentPage: 0,
      pageSize: 10,
      model: {
        key: '',
        message: '',
      },
      dialogFormVisible: false,
      formLabelWidth: '100px',
    }
  },
  methods: {
    addMessage() {
      this.$axios({
        url: '/message/add',
        params: {
          key: this.model.key,
          message: this.model.message,
        }
      }).then(res => {
        if (res.code === '200') {
          this.$notify({title: '成功', message: res.message, type: 'success', duration: 2})
          this.dialogFormVisible = false
          this.currentPage = 0
          this.pageSize = 10
          this.model = {}
          this.queryMessage()
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
    },
    queryMessage(val) {
      if (val === 'query') {
        this.currentPage = 0
        this.pageSize = 10
      }
      this.$axios({
        url: '/message/query',
        params: {
          id: this.form.did,
          key: this.form.dkey,
          date: this.form.dupdate,
          page: this.currentPage,
          size: this.pageSize,
        }
      }).then(res => {
        if (res.code === '200') {
          this.tableData = res.rows
          this.total = res.total
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
    },
    deleteRow(row) {
      this.$axios({
        url: '/message/delete',
        params: {
          id: row.did,
        }
      }).then(res => {
        if (res.code === '200') {
          this.queryMessage('query')
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.queryMessage()
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.queryMessage()
    },
  }
}
</script>

<style>
.el-row {
  margin-bottom: 12px;
}

.el-pagination {
  padding-top: 5px;
}
</style>