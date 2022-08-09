<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(suggession, index) in suggessions"
      :key="index"
      @click="$emit('search',suggession)"
    >
      <!-- 使用插槽处理高亮,使用heightLight来处理这段内容 -->
      <div slot="title" v-html="heightLight(suggession)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggession } from '@/api/search.js'
import { debounce } from 'lodash' // 按需引入
export default {
  props: {
    // 搜索框中输入的内容，通过父传子传过来
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // handler(val) {
      //   this.loadSearchSuggessions(val)
      // },
      // 防抖优化,用lodash里面的debounce
      handler: debounce(function (val) {
        this.loadSearchSuggessions(val)
      }, 1000),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  data() {
    return {
      suggessions: []
    }
  },
  methods: {
    async loadSearchSuggessions(q) {
      try {
        const { data } = await getSearchSuggession(q)
        // console.log(data.data.options)
        if (data.data.options[0] === null) {
          return (this.suggessions = 0)
        }
        this.suggessions = data.data.options
      } catch (err) {
        console.log(err)
      }
    },

    // 高亮正则替换
    heightLight(text) {
      const heightLightStr = `<span class='active'>${this.searchText}</span>`

      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, heightLightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ .active {
    color: red;
  }
}
</style>
