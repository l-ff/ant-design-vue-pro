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
                <a @click="albumModal_open(2, { id: item.id, name: item.name })"><a-icon type="edit" /> 编辑相册</a>
              </a-menu-item>
              <a-menu-item>
                <a><a-icon type="lock" /> 设置权限</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="ablbum_delete(item.id, item.name)"><a-icon type="delete" /> 删除相册</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <img slot="cover" :alt="item.name" :src="item.src" :key="item.id" />
          <div class="img-info" style="display: flex">
            <span style="flex: 1 1"><a-icon type="lock" /></span>
            <span style="flex: 0 1 auto"><a-icon type="picture" /> {{ item.count }}</span>
          </div>
          <a-card-meta :title="item.name" />
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
      @ok="albumModal_ok" />
  </page-header-wrapper>
</template>

<script>
import AlbumForm from './modules/AlbumForm'
export default {
  components: {
    AlbumForm
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      model: 0,
      entity: null,
      dataSource: [
        {
          id: 1,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册001',
          count: 50,
          lock: false
        },
        {
          id: 2,
          src: 'https://tva3.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh49nzpwj31hc0u0amq.jpg',
          name: '我的相册002',
          count: 522,
          lock: false
        },
        {
          id: 3,
          src: 'https://tva1.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4atmd2j31hc0u0too.jpg',
          name: '我的相册003',
          count: 51,
          lock: false
        },
        {
          id: 4,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册004',
          count: 1230,
          lock: !false
        },
        {
          id: 5,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册005',
          count: 346,
          lock: false
        },
        {
          id: 6,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册006',
          count: 364,
          lock: false
        },
        {
          id: 7,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册007',
          count: 631,
          lock: !false
        },
        {
          id: 8,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册008',
          count: 1364,
          lock: false
        },
        {
          id: 9,
          src: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
          name: '我的相册009',
          count: 23745,
          lock: !false
        }
      ]
    }
  },
  methods: {
    albumModal_open (model, entity) {
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
            }).then(res => {
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
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false

          const form = this.$refs.albumModal.form
          form.resetFields() // 清理表单数据（可不做）
        }
      })
    },
    albumModal_cancel () {
      this.visible = false
    },
    ablbum_delete (id, name) {
      var me = this
      me.$confirm({
        title: '您确定要删除此项吗?',
        content: (h) => <div style="color:red;">{name}</div>,
        onOk () {
          console.log('OK', id)
          me.$message.success('删除成功！')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  .card-actions {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #0002;
    border: 1px solid #0002 !important;
    background-color: #fff1 !important;
    backdrop-filter: blur(0.35rem);
  }

  .img-info {
    position: absolute;
    left: 0;
    bottom: 36px;
    padding: 2px 10px;
    width: 100%;
    color: #fff;
    background-color: #0001;
    backdrop-filter: blur(0.35rem);
  }
}
</style>
