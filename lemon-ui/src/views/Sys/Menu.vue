<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input placeholder="名称" v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.search')" @click="findTreeData(null)" icon="fa fa-search" perms="sys:menu:view"
                     type="primary"/>
        </el-form-item>
        <el-form-item>
          <kt-button :label="$t('action.add')" @click="handleAdd" icon="fa fa-plus" perms="sys:menu:add"
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
      <el-table-column align="center" header-align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="类型" prop="type">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="small" type="success" v-else-if="scope.row.type === 1">菜单</el-tag>
          <el-tag size="small" type="info" v-else-if="scope.row.type === 2">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="center" header-align="center" label="上级菜单" prop="parentName" width="120">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true" align="center" header-align="center" label="菜单URL"
          prop="url" width="150">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true" align="center" header-align="center" label="授权标识"
          prop="perms" width="150">
      </el-table-column>
      <el-table-column
          align="center" header-align="center" label="排序" prop="orderNum">
      </el-table-column>
      <el-table-column
          :label="$t('action.operation')" align="center" fixed="right" header-align="center" width="185">
        <template slot-scope="scope">
          <kt-button :label="$t('action.edit')" @click="handleEdit(scope.row)" icon="fa fa-edit" perms="sys:menu:edit"/>
          <kt-button :label="$t('action.delete')" @click="handleDelete(scope.row)" icon="fa fa-trash"
                     perms="sys:menu:delete"
                     type="danger"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" :visible.sync="dialogVisible"
               width="40%">
      <el-form :model="dataForm" :rules="dataRule" :size="size" @keyup.enter.native="submitForm()"
               label-width="80px" ref="dataForm" style="text-align:left;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :key="index" :label="index" v-for="(type, index) in menuTypeList">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input :placeholder="menuTypeList[dataForm.type] + '名称'" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <popup-tree-input
              :currentChangeHandle="handleTreeSelectChange" :data="popupTreeData"
              :nodeKey="''+dataForm.parentId"
              :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
              :props="popupTreeProps">
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="授权标识" prop="perms" v-if="dataForm.type !== 0">
          <el-input placeholder="如: sys:user:add, sys:user:edit, sys:user:delete" v-model="dataForm.perms"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop="url" v-if="dataForm.type === 1">
          <el-row>
            <el-col :span="22">
              <el-input placeholder="菜单路由" v-model="dataForm.url"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip effect="light" placement="top" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                  <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                  <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序编号" prop="orderNum" v-if="dataForm.type !== 2">
          <el-input-number :min="0" controls-position="right" label="排序编号"
                           v-model="dataForm.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="dataForm.type !== 2">
          <el-row>
            <el-col :span="22">
              <!-- <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in dataForm.iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover> -->
              <el-input :readonly="false" class="icon-list__input" placeholder="菜单图标名称（如：fa fa-home fa-lg）"
                        v-model="dataForm.icon" v-popover:iconListPopover></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip/>
            </el-col>
          </el-row>
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
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";

export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      size: "small",
      loading: false,
      filters: {
        name: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      menuTypeList: ["目录", "菜单", "按钮"],
      dataForm: {
        id: 0,
        type: 1,
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      },
      dataRule: {
        name: [{required: true, message: "菜单名称不能为空", trigger: "blur"}]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function () {
      this.loading = true;
      this.$api.menu.findMenuTree().then(res => {
        this.tableTreeDdata = res.data;
        this.popupTreeData = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function (tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true;
      this.dataForm = {
        id: 0,
        type: 1,
        typeList: ["目录", "菜单", "按钮"],
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      };
    },
    // 显示编辑界面
    handleEdit: function (row) {
      this.dialogVisible = true;
      Object.assign(this.dataForm, row);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        this.$api.menu.batchDelete(params).then(res => {
          this.findTreeData();
          this.$message({message: "删除成功", type: "success"});
        });
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({id: row.id});
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.parentName = data.name;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.menu.save(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({message: "操作成功", type: "success"});
                this.$refs["dataForm"].resetFields();
                this.dialogVisible = false;
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.findTreeData();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style scoped>
</style>