<template>
  <van-button
    :class="{ like: value === 1 }"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          await delLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.van-button {
  border: 0;
}
.like {
  .van-icon {
    color: #ffa500;
  }
}
</style>
