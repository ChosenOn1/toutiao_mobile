<template>
  <div class="home-container">
    <!-- 导航栏  nav-bar组件 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索
      </van-button>
    </van-nav-bar>
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs v-model="active" swipeable animated class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <articleList :channel="channel"></articleList>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- close-icon-position="top-left" 弹出层关闭图标的位置(左上角) -->
    <van-popup
      v-model="+"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 弹出层里面的内容 -->
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import articleList from '@/views/home/components/article-list'
import ChannelEdit from '@/views/home/components/channel-edit'
import { getItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
export default {
  components: { articleList, ChannelEdit },
  data() {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false
    }
  },
  created() {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels() {
      try {
        let channels = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 已登录账号 或者 本地没有存储 就发送数据获取后端数据
          const { data } = await getUserChannels()
          this.channels = data.data.channels
          return false
        } else {
          // 未登录并且本地有数据，就从本地获取数据
          channels = localChannels
        }

        // 将数据更新到组件中
        this.channels = channels
        console.log(this.channels)
      } catch (err) {
        console.log(err)
        this.$toast('数据获取失败')
      }
    },

    onUpdateActive(index, isChennelEditShow = true) {
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 180px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 2;
      width: 100%;
    }
    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
  }

  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
