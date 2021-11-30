<template>
  <div>
    <el-form :inline="true" ref="form" :model="form" label-width="auto" label-suffix=":" size="mini">
      <el-row>
        <el-form-item label="id">
          <el-input v-model="form.did" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="form.dfilename" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.dupdate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                          style="width: 180px"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" round @click="queryFile('query')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <!-- action="http://localhost:8088/sfs/file/upload"-->
          <el-upload
              class="upload-demo"
              action="http://www.dochao.top:8888/sfs/file/upload"
              :on-success="handleSuccess">
            <el-button round type="success">上传文件</el-button>
          </el-upload>
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
        <el-table-column resizable prop="dfilename" label="文件名"/>
        <el-table-column resizable prop="dsize" label="大小" width="100"/>
        <el-table-column resizable prop="dupdate" label="录入时间" width="200"/>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="handleDownload(scope.row)" type="text" size="small">下载</el-button>
            <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

  </div>

</template>

<script>
export default {
  name: "File",
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
        dfilename: '',
        dupdate: '',
      },
      tableData: [],
      total: 0,
      currentPage: 0,
      pageSize: 10,
      formLabelWidth: '100px',
    }
  },
  methods: {
    queryFile(val) {
      if (val === 'query') {
        this.currentPage = 0
        this.pageSize = 10
      }
      this.$axios({
        url: '/file/query',
        params: {
          id: this.form.did,
          filename: this.form.dfilename,
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
    handleDownload(row) {
      window.location.href = 'http://www.dochao.top:8888/sfs/file/download?id=' + row.did
      // window.location.href = 'http://localhost:8088/sfs/file/download?id=' + row.did
    },
    handleSuccess() {
      this.queryFile('query')
    },
    deleteRow(row) {
      this.$axios({
        url: '/file/delete',
        params: {
          id: row.did,
        }
      }).then(res => {
        if (res.code === '200') {
          this.queryFile('query')
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.queryFile()
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.queryFile()
    },

  }
}
</script>
