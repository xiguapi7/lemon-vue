<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input placeholder="名称" v-model="filters.label"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.search')" @click="findPage(null)" icon="fa fa-search" perms="sys:config:view"
                     type="primary"/>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.add')" @click="handleAdd" icon="fa fa-plus" perms="sys:config:add"
                     type="primary"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table :columns="columns" :data="pageResult"
              @findPage="findPage" @handleDelete="handleDelete"
              @handleEdit="handleEdit" permsDelete="sys:config:delete" permsEdit="sys:config:edit">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :close-on-click-modal="false" :title="operation?'新增':'编辑'" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="dataForm" :rules="dataFormRules" :size="size" label-width="80px" ref="dataForm">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input :disabled="true" auto-complete="off" v-model="dataForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input auto-complete="off" v-model="dataForm.label"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input auto-complete="off" v-model="dataForm.value"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input auto-complete="off" v-model="dataForm.type"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input auto-complete="off" v-model="dataForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="描述 " prop="description">
          <el-input auto-complete="off" type="textarea" v-model="dataForm.description"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input auto-complete="off" type="textarea" v-model="dataForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button :loading="editLoading" :size="size" @click.native="submitForm" type="primary">
          {{ $t('action.submit') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import {format} from "@/utils/datetime"

export default {
  components: {
    KtTable,
    KtButton
  },
  data() {
    return {
      size: 'small',
      filters: {
        label: ''
      },
      columns: [
        {prop: "id", label: "ID", minWidth: 50},
        {prop: "label", label: "名称", minWidth: 100},
        {prop: "value", label: "值", minWidth: 100},
        {prop: "type", label: "类型", minWidth: 80},
        {prop: "sort", label: "排序", minWidth: 80},
        {prop: "description", label: "描述", minWidth: 120},
        {prop: "remarks", label: "备注", minWidth: 120},
        {prop: "createBy", label: "创建人", minWidth: 100},
        {prop: "createTime", label: "创建时间", minWidth: 120, formatter: this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: {pageNum: 1, pageSize: 10},
      pageResult: {},

      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        label: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        label: '',
        value: '',
        type: '',
        sort: 0,
        description: '',
        remarks: ''
      }
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.params = [{name: 'label', value: this.filters.label}]
      this.$api.config.findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function (data) {
      this.$api.config.batchDelete(data.params).then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function () {
      this.editDialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        label: '',
        value: '',
        type: '',
        sort: 0,
        description: 'desc',
        remarks: 'remark'
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.editDialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            this.$api.config.save(params).then((res) => {
              if (res.code == 200) {
                this.$message({message: '操作成功', type: 'success'})
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
              this.editLoading = false
              this.$refs['dataForm'].resetFields()
              this.editDialogVisible = false
              this.findPage(null)
            })
          })
        }
      })
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property])
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>