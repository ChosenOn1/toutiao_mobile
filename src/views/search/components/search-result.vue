<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败,点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      error: false,
      perPage: 20
    }
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })

        // 测试加载失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2. 将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)

        // 3. 将本次加载中的loading关闭
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有,则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有,则将加载状态finish设置为结束
          this.finished = true
        }
      } catch (err) {
        // console.log(err)
        this.$toast('数据获取失败,请稍后重试')
      }
    }
  }
}
</script>

<style></style>
