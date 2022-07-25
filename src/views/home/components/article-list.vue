<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-duration="1500"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        errpr-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 存储列表出局的数组
      list: [],
      // 控制加载中 loding 状态
      loading: false,
      // 控制数据加载结束状态
      finished: false,
      // 请求获取下一页数据的时间戳
      timestamp: null,
      // 控制列表加载失败的提示状态
      error: false,
      isreFreshLoading: false,
      refreshSuccessText: '刷新成功'
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 请求获取数据
        const { data } = await getArticles({
          // 频道id
          channel_id: this.channel.id,

          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 把请求结果数据放到list数组中
        const { results } = data.data
        // 数组中的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)
        // 本次数据加载结束之后就把加载状态设置为结束
        this.loading = false
        // 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true，不再加载更多数据了
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading也需要关闭
        this.loding = false
      }
    },
    // 下拉刷新时触发
    async onRefresh() {
      this.isreFreshLoading = false
      try {
        // 请求获取数据
        const { data } = await getArticles({
          // 频道id
          channel_id: this.channel.id,

          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })

        // 把请求结果数据放到列表的顶部
        const { results } = data.data
        // 数组中的展开操作符，它会把数组元素一个一个拿出来
        this.list.unshift(...results)
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        console.log(err)
        // 展示错误提示状态
        this.refreshSuccessText = '刷新失败'

        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped>
.article-list {
  height: 79vh;
  overflow: auto;
}
</style>
