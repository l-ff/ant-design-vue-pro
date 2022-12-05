<template>
  <page-header-wrapper :breadcrumb="false" :title="false">
    <template v-slot:content>
      <a-button type="text" @click="albumModal_open(1, null)"><a-icon type="plus" />创建相册</a-button>
    </template>

    <a-list rowKey="id" :grid="{ gutter: 12, lg: 6, md: 4, sm: 2, xs: 1 }" :dataSource="dataSource" class="card-list">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable>
          <a-dropdown placement="bottomRight" class="card-actions">
            <a-button size="small"><a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="albumModal_open(2, item)"><a-icon type="edit" /> 编辑相册</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="lock" /> 设置权限</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="ablbum_delete(item)"><a-icon type="delete" /> 删除相册</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <img slot="cover" :alt="item.name" :src="item.cover_url" :key="item.id" />
          <div class="img-info" style="display: flex">
            <a-space style="flex: 1 1">
              <span><a-icon type="picture" /> {{ item.image_count }}</span>
            </a-space>
            <a-space style="flex: 0 1 auto">
              <span><a-icon type="eye" /> {{ item.view_count }}</span>
              <span><a-icon type="like" /> {{ item.like_count }}</span>
            </a-space>
          </div>
          <a-card-meta>
            <div slot="title" style="display: flex">
              <ellipsis :length="28" tooltip style="flex: 1 1">{{ item.name }}</ellipsis>
              <span style="flex: 0 1 auto"><a-icon :type="item.permission ? 'lock' : 'unlock'" /></span>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <album-form
      ref="albumModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="model"
      :entity="entity"
      @cancel="albumModal_cancel"
      @ok="albumModal_ok"
    />
  </page-header-wrapper>
</template>

<script>
import Ellipsis from '@/components/Ellipsis'
import AlbumForm from './modules/AlbumForm'

import { getAlbums, getAlbum, delAlbum } from '@/api/album'

export default {
  components: {
    AlbumForm,
    Ellipsis
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      model: 0,
      entity: null,
      dataSource: []
    }
  },
  methods: {
    albumModal_open (model, entity) {
      this.entity = {}
      this.entity = entity
      this.model = model
      this.visible = true
      // this.confirmLoading = true
    },
    albumModal_ok () {
      const form = this.$refs.albumModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
          form.resetFields() // 清理表单数据（可不做）
        }
      })
    },
    albumModal_cancel () {
      this.visible = false
    },
    ablbum_delete (album) {
      var me = this
      me.$confirm({
        title: '您确定要删除此项吗?',
        content: () => <div style="color:red;">{album.name}</div>,
        onOk () {
          // console.log('OK', album.id, album.name)
          delAlbum(album.id).then(res => {
            if (res.message === 'ok') {
                me.$message.success('删除成功！')
                me.dataSource.splice(me.dataSource.indexOf(album), 1)
              } else {
                me.$error.success('删除失败！')
              }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    loadData () {
      const me = this
      getAlbum({ id: 1 }).then((res) => {
        // console.log('album1', res.result)
      })
      getAlbums().then((res) => {
        console.log('albums', res)
        me.dataSource = res.result
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  :deep(.ant-card-cover) {
    display: flex;
    align-items: center;
    justify-items: center;
    height: 160px;
    overflow: hidden;
  }
  .card-actions {
    position: absolute;
    right: 10px;
    top: 10px;
    display: none;
  }

  .img-info {
    position: absolute;
    pointer-events: n;
    left: 0;
    bottom: 36px;
    padding: 30px 10px 2px;
    width: 100%;
    color: #fff;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.00386607) 8.07%,
      rgba(0, 0, 0, 0.0152486) 15.54%,
      rgba(0, 0, 0, 0.033824) 22.5%,
      rgba(0, 0, 0, 0.0592687) 29.04%,
      rgba(0, 0, 0, 0.0912593) 35.26%,
      rgba(0, 0, 0, 0.129472) 41.25%,
      rgba(0, 0, 0, 0.173583) 47.1%,
      rgba(0, 0, 0, 0.22327) 52.9%,
      rgba(0, 0, 0, 0.278208) 58.75%,
      rgba(0, 0, 0, 0.338074) 64.74%,
      rgba(0, 0, 0, 0.402545) 70.96%,
      rgba(0, 0, 0, 0.471296) 77.5%,
      rgba(0, 0, 0, 0.544005) 84.46%,
      rgba(0, 0, 0, 0.620347) 91.93%,
      rgba(0, 0, 0, 0.7)
    );
  }
}
.ant-card:hover .card-actions {
  display: block;
}
</style>
