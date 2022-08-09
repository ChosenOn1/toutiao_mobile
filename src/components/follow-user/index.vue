<template>
  <van-button
    class="follow-btn"
    round
    size="small"
    v-if="isFollowed"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, delFollow } from '@/api/user.js'

export default {
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is-followed' // 默认是input
  },
  props: {
    userId: {
      type: [Number, String],
      required: true
    },
    isFollowed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await delFollow(this.userId)
        } else {
          // 未关注，请求关注
          await addFollow(this.userId)
        }
        // this.isFollowed = !this.article.is_followed
        this.$emit('update-is-followed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style></style>
