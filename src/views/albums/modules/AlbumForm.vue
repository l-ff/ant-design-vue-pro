<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')">
    <a-form :form="form" layout="vertical">
      <div class="albums-background" :style="{ backgroundImage: 'url(' + (form.getFieldValue('background_url') || default_img ) + ')' }" />
      <div class="albums-cover" :style="{ backgroundImage: 'url(' + (form.getFieldValue('cover_url') || default_img ) + ')' }" />
      <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
      <a-form-item v-show="false" label="主键ID">
        <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
      </a-form-item>
      <a-form-item label="相册背景">
        <a-input type="url" v-decorator="['background_url']" placeholder="请输入相册背景url" />
      </a-form-item>
      <a-form-item label="相册封面">
        <a-input type="url" v-decorator="['cover_url']" placeholder="请输入相册封面url" />
      </a-form-item>
      <a-form-item label="相册名称">
        <a-input
          v-decorator="['name', { rules: [{ required: true, min: 5, message: '请输入至少5个字符' }] }]"
          placeholder="请输入相册名称" />
      </a-form-item>
      <a-form-item label="相册简介">
        <a-textarea
          v-decorator="['intro', { rules: [{ max: 200, message: '请输入最多200个字符' }] }]"
          placeholder="请输入相册简介"
          :auto-size="{ minRows: 2, maxRows: 4 }" />
      </a-form-item>
      <a-form-item label="是否公开">
        <a-switch v-decorator="['permission', { valuePropName: 'checked' }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'background_url', 'cover_url', 'name', 'intro', 'permission']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Number,
      default: () => 1
    },
    entity: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      default_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAANSURBVBhXY/j58+d/AAnFA+uv5oZtAAAAAElFTkSuQmCC',
      title: this.getTitle(),
      is_open: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getTitle () {
      return (this.model === 1 ? '新增' : this.model === 2 ? '编辑' : this.model === 3 ? '查看' : this.model) + '相册'
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 entity 发生改变时，为表单设置值
    this.$watch('entity', () => {
      // this.form.resetFields() // 新增模式需要手动清空表单
      this.entity && this.form.setFieldsValue(pick(this.entity, fields))
    })

    this.$watch('model', () => {
      this.title = this.getTitle()
    })
  }
}
</script>
<style lang="less" scoped>
.albums-background {
  width: calc(100% + 48px);
  height: 175px;
  margin: -25px -24px 50px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.albums-cover {
  width: 140px;
  height: 100px;
  position: absolute;
  top: 100px;
  border: 1px solid #fff;
  background-color: #f2f4f5;
  box-shadow: 3px 3px 3px #0007;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.ant-form-item{
  margin: 0;
}
.albums-cover{
  margin-bottom: 0;
  :deep(.ant-upload) {
    padding: 0;
    width: 100%;
    height: 180px;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }
}
</style>
