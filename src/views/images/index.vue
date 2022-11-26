<template>
  <page-header-wrapper :breadcrumb="false" :title="false" :style="{ background: isEdit ? '#f2de76' : null, marginBottom : '-15px' }">
    <template v-slot:extraContent>
      <a-row>
        <a-col :span="12">
          <a-button type="text" v-show="!isEdit" @click="setEditMode(true)"><a-icon type="form" />批量操作</a-button>
          <a-button type="text" v-show="isEdit" @click="setEditMode(false)"><a-icon type="close" />取消</a-button>

          <span v-show="isEdit">
            &nbsp;
            <a-checkbox
              :indeterminate="selected.length !== 0 && selected.length !== dataSource.length"
              :checked="selected.length !== 0 && selected.length === dataSource.length"
              @change="onCheckAllChange">
              {{ selected.length }}/{{ dataSource.length }}
            </a-checkbox>
          </span>

          <a-dropdown v-show="isEdit" :trigger="['click']">
            <a-button type="text" class="ant-dropdown-link">更多操作<a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a><a-icon type="plus" /> 添加到相册</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="lock" /> 设置权限</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="share-alt" /> 分享</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="edit" /> 重命名</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="delete" /> 删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </a-col>
        <a-col :span="12" style="text-align: right;">
          <a-input-search placeholder="请输入关键字搜索..." style="width: 200px" @search="onSearch" />
          &nbsp;
          <a-dropdown>
            <a-button type="text" class="ant-dropdown-link">排序<a-icon type="sort-descending" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">1st menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!-- &nbsp;
          <a-radio-group default-value="all" button-style="solid">
            <a-radio-button value="b">公开的</a-radio-button>
            <a-radio-button value="c">私有的</a-radio-button>
            <a-radio-button value="all">全部</a-radio-button>
          </a-radio-group> -->
        </a-col>
      </a-row>
    </template>
    <viewer>
      <a-list
        rowKey="id"
        :grid="{ gutter: 24, lg: 6, md: 4, sm: 2, xs: 1 }"
        :dataSource="dataSource"
        v-lazy-container="{ selector: 'img' }"
        class="card-list">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card hoverable :style="{ border: (item.isCheck ? '4px solid #1890ff':'4px solid #fff'), padding: '2px' }">
            <a-checkbox v-show="isEdit" :checked="item.isCheck" @change="item.isCheck = $event.target.checked" />
            <img slot="cover" :alt="item.title" :data-src="item.img" :key="item.id" />
            <template slot="actions" class="ant-card-actions">
              <a-popover trigger="click" title="重命名：">
                <template slot="content">
                  <a-input-search placeholder="请输入名称..." value="item.title" @search="testFun">
                    <a-button slot="enterButton">ok</a-button>
                  </a-input-search>
                </template>
                <a-tooltip placement="bottom" >
                  <template slot="title">重命名</template>
                  <a-icon key="edit" type="edit" theme="twoTone" two-tone-color="#6e4d40" />
                </a-tooltip>
              </a-popover>
              <a-tooltip placement="bottom" >
                <template slot="title">查看图片信息</template>
                <a-icon type="info-circle" theme="twoTone" two-tone-color="#7991d1" />
              </a-tooltip>
              <a-tooltip placement="bottom" v-if="item.isLock" >
                <template slot="title">私有的</template>
                <a-icon type="lock" theme="twoTone" two-tone-color="#00b483" />
              </a-tooltip>
              <a-tooltip placement="bottom" v-if="!item.isLock">
                <template slot="title">公开的</template>
                <a-icon type="unlock" theme="twoTone" two-tone-color="#f0c649" />
              </a-tooltip>
              <a-tooltip placement="bottom" >
                <template slot="title">删除</template>
                <a-icon type="delete" theme="twoTone" two-tone-color="#c56978" />
              </a-tooltip>
            </template>
          </a-card>
        </a-list-item>
      </a-list>
    </viewer>
  </page-header-wrapper>
</template>

<script>

const dataSource = []
for (let i = 0; i < 34; i++) {
  dataSource.push({
    id: i,
    title: 'Alipay',
    isCheck: false,
    isLock: i % 2 === 0,
    img: 'https://www.dmoe.cc/random.php?_=' + i,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  })
}

export default {
  name: 'CardList',
  data () {
    return {
      isEdit: false,
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource
    }
  },
  computed: {
    /** 已选中的项 */
      selected: () => dataSource.filter(x => x.isCheck)
  },
  methods: {
    onSearch () {},
    /** 设置编辑模式 */
    setEditMode (isEdit) {
      this.isEdit = isEdit
      dataSource.forEach(item => { item.isCheck = false })
    },
    /** 全选按钮事件 */
    onCheckAllChange ($event) {
      dataSource.forEach(item => { item.isCheck = $event.target.checked })
    },
    testFun () {
      this.$message.info('快速开始被点击！')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.card-list {
  margin-top: -10px;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 124px);

  :deep(.ant-row) {
    margin: 0 -5px !important;
}

:deep(.ant-col) {
  padding: 6px !important;

  .ant-list-item {
    margin-bottom: 0 !important;
  }
}

:deep(.ant-card-cover){
  height: 135px;
  position: relative;
  overflow: hidden;
}
  :deep(.ant-card-cover:hover:before) {
    opacity: 1;
  }
  :deep(.ant-card-cover::before) {
    content: '全屏查看 >>';
    width: 100%;
    height:135px;
    line-height:135px;
    text-align:center;
    position: absolute;
    pointer-events: none;
    display:block;
    z-index: 999;
    opacity: 0;
    color: #fff;
  }

  :deep(.ant-card-cover img) {
    height: 100%;
    object-fit:cover;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }
  :deep(.ant-card-cover img:hover) {
    filter: brightness(.45);
    transform: scale3d(1.2, 1.2, 1);
  }

  :deep(.ant-card-body) {
    padding: 0;
    .ant-checkbox-wrapper {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .ant-checkbox-inner{
      width: 25px;
      height: 25px;
      border-radius: 25px;
      text-align: center;
    }
    .ant-checkbox-inner::after{
      left: 31%;
    }
  }

  :deep(.ant-card-body:hover) {
    .ant-card-meta-title>a {
      color: @primary-color;
    }
  }

  :deep(.meta-content) {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    margin-bottom: 1em;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.ant-card-actions {
  background: #f7f9fa;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
    width: 50%;

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }

    a {
      color: rgba(0, 0, 0, .45);
      line-height: 22px;
      display: inline-block;
      width: 100%;

      &:hover {
        color: @primary-color;
      }
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 145px;
}
</style>
