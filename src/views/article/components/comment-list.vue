<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，点击重试"
      @load="onLoad"
      :immediate-check="false"
    >
      <CommentItem
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-clik="$emit('reply-clik', $event)"
      />
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
  components: { CommentItem },
  name: 'ArticleComment',
  props: {
    source: {
      type: [Number, String],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 默认值，意思是如果没有传值就显示空数组
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a' // 默认值（default基本类型可以直接赋值）
    }
  },
  data() {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      error: false,
      limit: 10
    }
  },

  created() {
    this.loading = true
    this.onLoad()
  },

  methods: {
    async onLoad() {
      try {
        const { data } = await getComment({
          type: this.type, // 评论类型：a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        const { results } = data.data
        // console.log(data.data)
        this.list.push(...results)
        // console.log(this.list)
        this.$emit('onload-success', data.data)

        this.loading = false

        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
