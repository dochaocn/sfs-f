<template>
  <div>
    <el-form :inline="true" ref="form" :model="form" label-width="auto" label-suffix=":" size="mini">
      <el-row>
        <el-form-item label="日期">
          <el-date-picker v-model="form.dupdate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                          style="width: 180px"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="queryDaily()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="saveDaily()">入库</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round @click="sendDaily()">发送</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-col :push="8">
      <el-table :data="tableData" border style="width: 650px">
        <el-table-column resizable prop="fxDate" label="日期" width="120"/>
        <el-table-column resizable prop="tempMax" label="最高温度" width="100"/>
        <el-table-column resizable prop="tempMin" label="最低温度" width="100"/>
        <el-table-column resizable prop="textDay" label="白天" width="60"/>
        <el-table-column resizable prop="textNight" label="夜晚" width="60"/>
        <el-table-column resizable prop="windDirNight" label="风向" width="80"/>
        <el-table-column resizable prop="windScaleDay" label="风力" />
      </el-table>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "Daily",
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
        dupdate: '',
      },
      tableData: [],
    }
  },
  methods: {
    sendDaily() {
      if (this.form.dupdate != '') {
        this.$axios({
          url: '/task/sendDailySms',
          params: {
            param: this.form.dupdate,
          },
        }).then(res => {
          if (res.code !== '200') {
            this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
          }
        })
      } else {
        this.$notify({title: '失败', message: '请选择日期', type: 'error', duration: 0})
      }
    },
    saveDaily() {
      this.$axios({
        url: '/task/execute',
        params: {
          controller: 'daily',
          param: this.form.dupdate,
        },
      }).then(res => {
        if (res.code === '200') {
          this.queryDaily()
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
    },
    queryDaily() {
      this.tableData = []
      this.$axios({
        url: '/daily/get',
        params: {
          day: this.form.dupdate,
        }
      }).then(res => {
        if (res.code === '200') {
          // if (!res.data && this.form.dupdate != '') {
          //   this.saveDaily();
          // }
          this.tableData.push(res.data)
        } else {
          this.$notify({title: '失败', message: res.message, type: 'error', duration: 0})
        }
      }).catch(error => this.$notify({title: '失败', message: error, type: 'error', duration: 0}))
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