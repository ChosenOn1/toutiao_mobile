<template>
  <div class="edit-channel-popup">
    <van-cell title="我的频道" :border="false">
      <van-button
        size="mini"
        round
        type="danger"
        @click="isEdit = !isEdit"
        plain
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <!-- 宫格 close右上角关闭按钮 -->
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          slot="icon"
          name="close"
          v-show="isEdit && !fixedChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" :class="{ active: active === index }" slot="text">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <van-cell title="频道推荐" :border="false"> </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <!-- plus加号按钮 -->
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
        icon="plus"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'

export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 频道是否在编辑状态
      fixedChannels: [0]
    }
  },
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    // 加载所有频道
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    // 添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      if (this.user) {
        // 已登录
        try {
          // 已登录，数据存储到线上
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登陆
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 频道切换或删除
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态，删除频道
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        this.myChannels.splice(index, 1)

        // 删除数据持久化 (保存在localstorage或者线上)
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道  子向父传值
        this.$emit('update-active', index, false)
      }
    },

    // 删除数据持久化 (保存在localstorage或者线上)
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        // 数组find方法:遍历数组,把符合条件的第一个元素返回
        const mychannel = this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        return !mychannel
      })
    },
    // 获取user
    ...mapState(['user'])
  }
}
</script>

<style scoped lang="less">
.edit-channel-popup {
  padding-top: 100px;
  box-sizing: border-box;
  .channel-item {
    height: 86px;

    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 26px;
        white-space: nowrap;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
    .active {
      color: red !important;
    }
  }

  // 右上角关闭图标样式
  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 38px !important;
    color: red;
  }
  // +样式
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      .van-icon {
        font-size: 24px;
      }

      .van-grid-item__text {
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
}
</style>
