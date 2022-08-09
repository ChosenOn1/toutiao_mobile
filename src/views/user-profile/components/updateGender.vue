<template>
  <div>
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserPrifile } from '@/api/user.js'

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserPrifile({
          gender: localGender
        })
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
      }
    },
    onPickerChange(picker, value, index) {
      this.localGender = index
    },
    onCancel() {
      this.$toast('取消')
    }
  }
}
</script>

<style></style>
