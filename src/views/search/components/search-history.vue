<template>
  <div>
    <van-cell-group>
      <!-- 搜索历史表头 -->
      <van-cell title="搜索历史" value="内容">
        <div v-if="isDeleteShow">
          <span @click="$emit('clearSearchHistories')">全部删除</span>
          &nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon name="delete-o" v-else @click="isDeleteShow = true" />
      </van-cell>

      <!-- 搜索历史内容 -->
      <van-cell
        :title="searchHistory"
        value="内容"
        v-for="(searchHistory, index) in searchHistories"
        :key="index"
        @click="onSearchItemClick(searchHistory, index)"
      >
        <van-icon name="close" v-show="isDeleteShow" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style></style>
