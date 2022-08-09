<template>
  <div class="update-birthdy">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPrifile } from '@/api/user.js'
import dayJs from 'dayjs'
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, //  持续展示
        duration: 0 // 禁止背景点击
      })
      try {
        await updateUserPrifile({
          birthday: dayJs(this.currentDate).format('YYYY-MM-DD')
        })
        this.$emit('input', dayJs(this.currentDate).format('YYYY-MM-DD'))
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style></style>
