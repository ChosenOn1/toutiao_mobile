<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>

    <div style="padding: 10px">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserPrifile } from '@/api/user.js'
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('不能为空')
          return
        }
        await updateUserPrifile({
          name: localName
        })
        // 更新视图
        this.$emit('input', localName) // input 默认的绑定
        this.$emit('close') // 关闭弹窗
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.van-nav-bar__content {
  background: rgb(189, 28, 28);
}
</style>
