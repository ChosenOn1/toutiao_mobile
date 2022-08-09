<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
        background="orange"
      />
    </form>
    <!-- 搜索结果, 当触发search事件时显示,search聚焦时不显示 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>

    <!-- 联想建议, 当search有内容时显示 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggestion>

    <!-- 历史记录, 搜索结果和联想建议都不显示时它显示 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clearSearchHistories="searchHistories = []"
      @search="onSearch"
    ></search-history>
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage.js'

export default {
  components: { searchHistory, SearchSuggestion, SearchResult },
  name: 'SearchPage',
  data() {
    return {
      searchText: '', // 搜索框中输入的内容
      isResultShow: false, // 控制搜索结果展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录
    }
  },
  methods: {
    // 手机用户按下搜索触发，或者模拟器按下ENTER触发
    onSearch(val) {
      this.isResultShow = true
      this.searchText = val // 搜索建议或者历史记录传过来的值，都赋值给搜索内容

      // 存储历史记录
      // 不要有重复的历史记录,最新的排在前面
      const index = this.searchHistories.indexOf(val) // indexOf 返回的是索引
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.push(val)
    },

    // 搜索后面取消按钮
    onCancel() {
      // Toast('取消')
      this.$router.push('./home')
    }
  },
  watch: {
    // 历史记录数据持久化，当searchHistories的数据发生变化时就将它存到本地
    searchHistories(val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
