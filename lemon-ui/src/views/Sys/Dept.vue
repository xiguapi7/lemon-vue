<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input placeholder="名称" v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.search')" @click="findTreeData(null)" icon="fa fa-search" perms="sys:dept:view"
                     type="primary"/>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.add')" @click="handleAdd" icon="fa fa-plus" perms="sys:dept:add"
                     type="primary"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table :data="tableTreeDdata" element-loading-text="$t('action.loading')" rowKey="id" size="mini"
              stripe style="width: 100%;" v-loading="loading">
      <el-table-column
          align="center" header-align="center" label="ID" prop="id" width="80">
      </el-table-column>
      <table-tree-column
          header-align="center" label="名称" prop="name" treeKey="id" width="150">
      </table-tree-column>
      <el-table-column
          align="center" header-align="center" label="上级机构" prop="parentName" width="120">
      </el-table-column>
      <el-table-column
          align="center" header-align="center" label="排序" prop="orderNum">
      </el-table-column>
      <el-table-column
          align="center" header-align="center" label="创建人" prop="createBy">
      </el-table-column>
      <el-table-column
          :formatter="dateFormat" align="center" header-align="center" label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column
          :label="$t('action.operation')" align="center" fixed="right" header-align="center" width="185">
        <template slot-scope="scope">
          <kt-button :label="$t('action.edit')" @click="handleEdit(scope.row)" icon="fa fa-edit" perms="sys:dept:edit"/>
          <kt-button :label="$t('action.delete')" @click="handleDelete(scope.row)" icon="fa fa-trash"
                     perms="sys:dept:delete"
                     type="danger"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" :visible.sync="dialogVisible"
               width="40%">
      <el-form :model="dataForm" :rules="dataRule" :size="size" @keyup.enter.native="submitForm()"
               label-width="80px" ref="dataForm" style="text-align:left;">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="名称" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <popup-tree-input
              :currentChangeHandle="handleTreeSelectChange" :data="popupTreeData" :nodeKey="''+dataForm.parentId"
              :prop="dataForm.parentName==null?'顶级菜单':dataForm.parentName" :props="popupTreeProps">
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="orderNum" v-if="dataForm.type !== 2">
          <el-input-number :min="0" controls-position="right" label="排序编号"
                           v-model="dataForm.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" @click="submitForm()" type="primary">{{ $t('action.comfirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import PopupTreeInput from "@/components/PopupTreeInput"
import FaIconTooltip from "@/components/FaIconTooltip"
import {format} from "@/utils/datetime"

export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      size: 'small',
      loading: false,
      filters: {
        name: ''
      },
      tableTreeDdata: [],
      dialogVisible: false,
      dataForm: {
        id: 0,
        name: '',
        parentId: 0,
        parentName: '',
        orderNum: 0
      },
      dataRule: {
        name: [
          {required: true, message: '机构名称不能为空', trigger: 'blur'}
        ],
        parentName: [
          {required: true, message: '上级机构不能为空', trigger: 'change'}
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    // 获取数据
    findTreeData: function () {
      this.loading = true
      this.$api.dept.findDeptTree().then((res) => {
        this.tableTreeDdata = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
      })
    },
    // 获取上级机构树
    getParentMenuTree: function (tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeDdata
      }
      return [parent]
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.dataForm = {
        id: 0,
        name: '',
        parentId: 0,
        parentName: '',
        orderNum: 0
      }
    },
    // 显示编辑界面
    handleEdit: function (row) {
      this.dialogVisible = true
      Object.assign(this.dataForm, row);
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let params = this.getDeleteIds([], row)
        this.$api.dept.batchDelete(params).then(res => {
          this.findTreeData()
          this.$message({message: '删除成功', type: 'success'})
        })
      })
    },
    // 获取删除的包含子机构的id列表
    getDeleteIds(ids, row) {
      ids.push({id: row.id})
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 表单提交
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            this.$api.dept.save(params).then((res) => {
              this.editLoading = false
              if (res.code == 200) {
                this.$message({message: '操作成功', type: 'success'})
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
              this.findTreeData()
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
    this.findTreeData()
  }
}
</script>

<style scoped>

</style>