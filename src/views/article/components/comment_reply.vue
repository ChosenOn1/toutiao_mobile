<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
      left-arrow
    >
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <CommentList type="c" :source="comment.com_id" :list="commentList" />
    </div>

    <!-- 底部输入框 -->
    <div class="reply-bottom">
      <van-button
        size="small"
        class="write-btn"
        @click="isPostShow = true"
        round
        >写评论</van-button
      >
    </div>

    <!-- 弹出层，输入评论的评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :target="comment.com_id"
        @post-success="onPostSuccess"
      ></comment-post>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment_post.vue'
export default {
  components: { CommentItem, CommentList, CommentPost },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess(data) {
      this.comment.reply_count++
      this.isPostShow = false // 弹层关闭
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
  .van-icon {
    color: #fff;
  }

  .scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
  .reply-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .write-btn {
      width: 80%;
    }
  }
}
</style>
