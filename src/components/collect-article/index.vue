<template>
  <van-button
    :class="{ collected: value }"
    :icon="value ? 'star' : 'star-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, delCollect } from '@/api/article.js'
export default {
  name: 'collectArticle',
  props: {
    value: {
      type: Boolean,
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
        if (this.value) {
          await delCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast(this.value ? '取消收藏' : '收藏成功')
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
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
