<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    :width="768"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')">
    <a-spin :spinning="loading">
      <a-form :form="form" layout="vertical">
        <a-form-item label="相册背景">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="albums-cover"
            :show-upload-list="false"
            :beforeUpload="beforeUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="100%" />
            <div style="width=100%" v-else>
              <a-icon :type="loading1 ? 'loading' : 'plus'" />上传背景
              <p>建议尺寸 1080*800，支持PNG、JPG，最大2MB</p>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="相册封面">
          <a-upload list-type="picture-card" :beforeUpload="beforeUpload">
            <a-icon type="plus" />选择封面
          </a-upload>
        </a-form-item>
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="entity && entity.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="相册名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, min: 5, message: '请输入至少5个字符！' }] }]"
            placeholder="请输入相册名称..." />
        </a-form-item>
        <a-form-item label="相册简介">
          <a-textarea
            v-decorator="['intro', { rules: [{ max: 200, message: '请输入最多五个字符！' }] }]"
            placeholder="请输入相册简介..."
            :auto-size="{ minRows: 2, maxRows: 4 }" />
        </a-form-item>
        <a-form-item label="是否公开">
          <a-switch v-decorator="['permission', { valuePropName: 'checked' }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'intro', 'permission']

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
      imageUrl: '',
      loading1: false,
      title: this.getTitle(),
      is_open: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : {}
    },
    getTitle () {
      return (this.model === 1 ? '新增' : this.model === 2 ? '编辑' : this.model === 3 ? '查看' : this.model) + '相册'
    },
    beforeUpload (file, fileList) {
      const me = this
      this.getBase64(file).then(function (base64) {
        console.log('base64', base64)
        me.imageUrl = base64
      })

      return false
    },
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          // console.log(e.target.result)// 打印图片的base64
          resolve(e.target.result)
        }
      })
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 entity 发生改变时，为表单设置值
    this.$watch('entity', () => {
      !this.entity && this.form.resetFields() // 新增模式需要手动清空表单
      this.entity && this.form.setFieldsValue(pick(this.entity, fields))
    })

    this.$watch('model', () => {
      this.title = this.getTitle()
    })
  }
}
</script>
<style lang="less" scoped>
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
