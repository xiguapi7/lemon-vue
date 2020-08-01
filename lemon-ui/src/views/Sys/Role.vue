<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input placeholder="角色名" v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.search')" @click="findPage(null)" icon="fa fa-search" perms="sys:role:view"
                     type="primary"/>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.add')" @click="handleAdd" icon="fa fa-plus" perms="sys:role:add"
                     type="primary"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table :columns="columns" :data="pageResult" :highlightCurrentRow="true" :showBatchDelete="false"
              :stripe="false" @findPage="findPage" @handleCurrentChange="handleRoleSelectChange"
              @handleDelete="handleDelete"
              @handleEdit="handleEdit" permsDelete="sys:role:delete" permsEdit="sys:role:edit">
    </kt-table>
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog :close-on-click-modal="false" :title="operation?'新增':'编辑'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="dataForm" :rules="dataFormRules" :size="size" label-width="80px" ref="dataForm">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input :disabled="true" auto-complete="off" v-model="dataForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input auto-complete="off" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input auto-complete="off" type="textarea" v-model="dataForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button :loading="editLoading" :size="size" @click.native="submitForm" type="primary">
          {{ $t('action.submit') }}
        </el-button>
      </div>
    </el-dialog>
    <!--角色菜单，表格树内容栏-->
    <div :v-if="true" class="menu-container">
      <div class="menu-header">
        <span><B>角色菜单授权</B></span>
      </div>
      <el-tree :check-strictly="true" :data="menuData" :props="defaultProps" :render-content="renderContent"
               @check-change="handleMenuCheckChange"
               element-loading-text="拼命加载中" node-key="id" ref="menuTree"
               show-checkbox size="mini" style="width: 100%;padding-top:20px;"
               v-loading="menuLoading">
      </el-tree>
      <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox :disabled="this.selectRole.id == null" @change="handleCheckAll" v-model="checkAll"><b>全选</b>
        </el-checkbox>
      </div>
      <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
        <kt-button :disabled="this.selectRole.id == null" :label="$t('action.reset')" @click="resetSelection"
                   perms="sys:role:edit"
                   type="primary"/>
        <kt-button :disabled="this.selectRole.id == null" :label="$t('action.submit')" :loading="authLoading"
                   @click="submitAuthForm"
                   perms="sys:role:edit" type="primary"/>
      </div>
    </div>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import {format} from "@/utils/datetime"

export default {
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      columns: [
        {prop: "id", label: "ID", minWidth: 50},
        {prop: "name", label: "角色名", minWidth: 120},
        {prop: "remark", label: "备注", minWidth: 120},
        {prop: "createBy", label: "创建人", minWidth: 120},
        {prop: "createTime", label: "创建时间", minWidth: 120, formatter: this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: {pageNum: 1, pageSize: 10},
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          {required: true, message: '请输入角色名', trigger: 'blur'}
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: '',
        remark: ''
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.params = [{name: 'name', value: this.filters.name}]
      this.$api.role.findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
        this.findTreeData()
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function (data) {
      this.$api.role.batchDelete(data.params).then(data.callback)
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        remark: ''
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
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
            this.$api.role.save(params).then((res) => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({message: '操作成功', type: 'success'})
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
              this.findPage(null)
            })
          })
        }
      })
    },
    // 获取数据
    findTreeData: function () {
      this.menuLoading = true
      this.$api.menu.findMenuTree().then((res) => {
        this.menuData = res.data
        this.menuLoading = false
      })
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return
      }
      this.selectRole = val.val
      this.$api.role.findRoleMenus({'roleId': val.val.id}).then((res) => {
        this.currentRoleMenus = res.data
        this.$refs.menuTree.setCheckedNodes(res.data)
      })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId
        this.$refs.menuTree.setChecked(parentId, true, false)
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      let roleId = this.selectRole.id
      if ('admin' === this.selectRole.name) {
        this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
        return
      }
      this.authLoading = true
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      let roleMenus = []
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        let roleMenu = {roleId: roleId, menuId: checkedNodes[i].id}
        roleMenus.push(roleMenu)
      }
      this.$api.role.saveRoleMenus(roleMenus).then((res) => {
        if (res.code === 200) {
          this.$message({message: '操作成功', type: 'success'})
        } else {
          this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        }
        this.authLoading = false
      })
    },
    renderContent(h, {node, data, store}) {
      return (
          `<div class="column-container">
            <span style="text-algin:center;margin-right:80px;">{data.name}</span>
            <span style="text-algin:center;margin-right:80px;">
              <el-tag type={data.type === 0 ? '' : data.type === 1 ? 'success' : 'info'} size="small">
                {data.type === 0 ? '目录' : data.type === 1 ? '菜单' : '按钮'}
              </el-tag>
            </span>
            <span style="text-algin:center;margin-right:80px;">
              <i class={data.icon}/>
            </span>
            <span style="text-align:center;margin-right:80px;">{data.parentName ? data.parentName : '顶级菜单'}</span>
            <span style="text-align:center;margin-right:80px;">{data.url ? data.url : '\t'}</span>
          </div>`);
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
.menu-container {
  margin-top: 10px;
}

.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);

}
</style>