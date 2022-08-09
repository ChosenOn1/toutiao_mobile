<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPostComment"
      :loading="commentLoading"
      :disabled="!message.length"
      >发布
    </van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'CommentPost',
  components: {},

  // 接收index通过provide给所有后代传的数据
  inject: {
    articleId: {
      type: [Number, String],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String],
      requied: true
    },
    list: {
      type: Array,
      default: () => [] // 默认值，意思是如果没有传值就显示空数组
    }
  },
  data() {
    return {
      message: '',
      commentLoading: false
    }
  },
  methods: {
    async onPostComment() {
      this.commentLoading = true
      try {
        const { data } = await addComment({
          target: this.target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        console.log('发布成功后内容：', data)

        // 清空内容，关闭弹层，将发布的评论展示到列表头部
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast('发布成功')
      } catch (err) {
        console.log(err)
        this.$toast('发布失败，请重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
