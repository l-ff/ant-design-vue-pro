<template>
  <page-header-wrapper
    :breadcrumb="false"
    :title="false"
    :style="{ background: isEdit ? '#f2de76' : null, marginBottom: '-15px' }"
  >
    <template v-slot:content>
      <a-button type="text" :disabled="isLoading" v-show="!isEdit" @click="setEditMode(true)"><a-icon type="form" />批量操作</a-button>
      <a-button type="text" :disabled="isLoading" v-show="isEdit" @click="setEditMode(false)"><a-icon type="close" />取消</a-button>

      <span v-show="isEdit">
        &nbsp;
        <a-checkbox
          :indeterminate="selected.length !== 0 && selected.length !== dataSource.length-1"
          :checked="selected.length !== 0 && selected.length === dataSource.length-1"
          :disabled="isLoading"
          @change="onCheckAllChange"
        >
          <span>选择{{ selected.length }}/{{ dataSource.length-1 }}</span>
        </a-checkbox>
      </span>
      <a-button type="text" :disabled="isLoading" v-show="isEdit"><a-icon type="plus" />&nbsp;添加到相册</a-button>
      <a-button type="text" :disabled="isLoading" v-show="isEdit"><a-icon type="lock" />&nbsp;设置权限</a-button>
      <a-button type="text" :disabled="isLoading" v-show="isEdit"><a-icon type="share-alt" />&nbsp;分享</a-button>
      <a-button type="text" :disabled="isLoading" v-show="isEdit"><a-icon type="delete" />&nbsp;删除</a-button>
      <!-- <a-dropdown v-show="isEdit" :trigger="['click']">
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
      </a-dropdown> -->
    </template>
    <template v-slot:extraContent>
      <a-input-search :disabled="isLoading" placeholder="请输入关键字搜索..." style="width: 240px" @search="filter.search = $event" />
          &nbsp;
      <a-dropdown :disabled="isLoading">
        <a-button type="text" class="ant-dropdown-link">排序<a-icon type="sort-descending" /></a-button>
        <a-menu slot="overlay">
          <a-menu-item>最新上传</a-menu-item>
          <a-menu-item>最早上传</a-menu-item>
          <a-menu-item>赞最多</a-menu-item>
          <a-menu-item>赞最少</a-menu-item>
        </a-menu>
      </a-dropdown>
      &nbsp;
      <a-radio-group v-model="filter.viewMode" :disabled="isLoading" button-style="solid">
        <a-radio-button :value="1">公开的</a-radio-button>
        <a-radio-button :value="2">私有的</a-radio-button>
        <a-radio-button :value="0">全部</a-radio-button>
      </a-radio-group>
    </template>
    <viewer :images="dataSource">
      <a-spin tip="拼命加载中..." :spinning="isLoading" :delay="10">
        <a-list rowKey="id" :grid="{ gutter: 24, lg: 6, md: 4, sm: 2, xs: 1 }" :dataSource="dataSource" class="card-list">
          <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="item && item.id !== undefined">
              <a-card hoverable :style="{ border: item.isCheck ? '4px solid #1890ff' : '4px solid transparent', padding: '2px' }">
                <a-checkbox v-show="isEdit" :checked="item.isCheck" @change="item.isCheck = $event.target.checked" />
                <img
                  slot="cover"
                  :alt="item.title"
                  :src="item.src"
                  :data-source="item.dataSource"
                  :key="item.id"
                  v-lazy="item.src" />
                <a-card-meta :title="item.title" @click="item.isCheck = isEdit ? !item.isCheck : item.isCheck">
                  <template slot="description">
                    <div style="display: flex;">
                      <small style="flex: 1 1;"><a-icon type="clock-circle" theme="twoTone" />&nbsp;<timeago :datetime="item.createdTime"></timeago></small>
                      <small style="flex: 0 1 auto;">{{ item.like }}&nbsp;<a-icon type="heart" theme="twoTone" two-tone-color="#c56978" /></small>
                    </div>
                  </template>
                </a-card-meta>
                <template slot="actions" class="ant-card-actions">
                  <a-popover trigger="click" title="重命名：">
                    <template slot="content">
                      <a-input-search placeholder="请输入名称..." :value="item.title" @search="testFun">
                        <a-button slot="enterButton">ok</a-button>
                      </a-input-search>
                    </template>
                    <a-tooltip placement="bottom">
                      <template slot="title">重命名</template>
                      <a-icon key="edit" type="edit" theme="twoTone" two-tone-color="#6e4d40" />
                    </a-tooltip>
                  </a-popover>
                  <a-tooltip placement="bottom" @click="imgInfo.visible=true">
                    <template slot="title">查看图片信息</template>
                    <a-icon type="info-circle" theme="twoTone" two-tone-color="#7991d1" />
                  </a-tooltip>
                  <a-tooltip placement="bottom" v-if="item.isLock" @click="item.isLock=false">
                    <template slot="title">私有的</template>
                    <a-icon type="lock" theme="twoTone" two-tone-color="#00b483" />
                  </a-tooltip>
                  <a-tooltip placement="bottom" v-if="!item.isLock" @click="item.isLock=true">
                    <template slot="title">公开的</template>
                    <a-icon type="unlock" theme="twoTone" two-tone-color="#f0c649" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template slot="title">删除</template>
                    <a-popconfirm title="确定要删除此项吗?" @confirm="$message.success('Click on Yes');">
                      <a-icon type="delete" theme="twoTone" two-tone-color="#c56978" />
                    </a-popconfirm>
                  </a-tooltip>
                </template>
              </a-card>
            </template>
            <template v-else>
              <a-button class="new-btn" type="dashed" :loading="isLoading" icon="plus" @click="++filter.pageIndex">
                加载更多
              </a-button>
            </template>
          </a-list-item>
        </a-list>
      </a-spin>
    </viewer>
    <a-drawer
      placement="right"
      :visible="imgInfo.visible"
      :maskClosable="true"
      :width="420"
      @close="imgInfo.visible=false"
    >
      <template #title>
        <span><a-icon type="info-circle" theme="twoTone" two-tone-color="#7991d1" /> 图片信息</span>
      </template>
      <a-descriptions :column="1" layout="vertical">
        <a-descriptions-item label="相册名称">-</a-descriptions-item>
        <a-descriptions-item label="图片名称">a.png</a-descriptions-item>
        <a-descriptions-item label="图片大小">122.88 Bytes</a-descriptions-item>
        <a-descriptions-item label="图片类型">image/png</a-descriptions-item>
        <a-descriptions-item label="尺寸">1920 * 1080</a-descriptions-item>
        <a-descriptions-item label="MD5">cb96165dffe7d1bba338c1c0c99a8b6d</a-descriptions-item>
        <a-descriptions-item label="SHA-128">93e71f3cf06f2b2dfb3220e21ae35c9b4c1d4647</a-descriptions-item>
        <a-descriptions-item label="权限">私有</a-descriptions-item>
        <a-descriptions-item label="上传IP">172.69.34.26</a-descriptions-item>
        <a-descriptions-item label="上传时间">2022-11-17 22:33:49</a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </page-header-wrapper>
</template>

<script>
import { getImages } from '@/api/manage'

export default {
  name: 'CardList',
  data () {
    return {
      filter: {
        search: '',
        viewMode: 0,
        pageSize: 20,
        pageIndex: 0
      },
      imgInfo: {
        visible: false
      },
      isLoading: false,
      isEdit: false,
      dataSource: [{}]
    }
  },
  computed: {
    /** 已选中的项 */
    selected () {
      return this.dataSource.filter((x) => x.id && x.isCheck)
    },
    /** 解决监听filter时新旧值一样 */
    strFilter () {
      return JSON.parse(JSON.stringify(this.filter))
    }
  },
  watch: {
    strFilter: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        // 改变试图后重置分页
        if (oldVal && newVal.viewMode !== oldVal.viewMode) {
          newVal.pageIndex = 0
          this.dataSource = [{}]
        }

        this.loadData()
      }
    }
  },
  methods: {
    /** 加载数据 */
    loadData () {
      var me = this
      me.isLoading = true
      getImages(me.filter).then((res) => {
        console.log('getImages：', res)
        if (res.result.length > 0) {
          me.dataSource.splice(me.dataSource.length - 1, 0, ...res.result)
        } else {
          this.$message.warning('没有更多数据了！')
        }
        me.isLoading = false
      })
    },
    /** 设置编辑模式 */
    setEditMode (isEdit) {
      this.isEdit = isEdit
      this.dataSource.forEach((item) => {
        if (item.isCheck !== undefined) {
          item.isCheck = false
        }
      })
    },
    /** 全选按钮事件 */
    onCheckAllChange ($event) {
      this.dataSource.forEach((item) => {
        if (item.isCheck !== undefined) {
          item.isCheck = $event.target.checked
        }
      })
    },
    testFun () {
      this.$message.info('快速开始被点击！')
    }
  },
  mounted () {
    // this.loadData()
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.card-list {
  margin: -6px 5px;

  :deep(.ant-col) {
    padding: 6px !important;

    .ant-list-item {
      margin-bottom: 0 !important;
    }
  }

  :deep(.ant-card-cover) {
    height: 180px;
    position: relative;
    overflow: hidden;
  }
  :deep(.ant-card-cover:hover:before) {
    opacity: 1;
  }
  :deep(.ant-card-cover::before) {
    content: '全屏查看 >>';
    width: 100%;
    height: 180px;
    line-height: 180px;
    text-align: center;
    position: absolute;
    pointer-events: none;
    display: block;
    z-index: 1;
    opacity: 0;
    color: #fff;
  }

  :deep(.ant-card-cover img) {
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  :deep(.ant-card-cover img:hover) {
    filter: brightness(0.45);
    transform: scale3d(1.2, 1.2, 1);
  }

  :deep(.ant-card-body) {
    .ant-checkbox-wrapper {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .ant-checkbox-inner {
      width: 25px;
      height: 25px;
      border-radius: 25px;
      text-align: center;
    }
    .ant-checkbox-inner::after {
      left: 31%;
    }
  }

  :deep(.ant-card-body:hover) {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }
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
      color: rgba(0, 0, 0, 0.45);
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
  height: 302px;
}
</style>
