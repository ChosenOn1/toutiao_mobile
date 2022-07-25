<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="orange"
      />
    </form>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'SearchPage',
  data() {
    return {
      value: ''
    }
  },
  methods: {
    // 手机用户按下搜索触发，或者模拟器按下ENTER触发
    onSearch(val) {
      Toast(val)
    },

    onCancel() {
      // Toast('取消')
      this.$router.push('./home')
    }
  }
}
</script>

<style scoped></style>
