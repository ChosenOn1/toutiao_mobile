<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div class="userInfo header" v-if="user">
      <!-- 基本信息 -->
      <div class="base">
        <div class="left">
          <van-image fit="cover" :src="userInfo.photo" class="avatar" round />
          <span class="name"> {{ userInfo.name }} </span>
        </div>
        <div class="right">
          <van-button type="default" size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 粉丝、关注 -->
      <div class="data">
        <div class="data-item">
          <span> {{ userInfo.art_count }} </span>
          <span>头条</span>
        </div>
        <div class="data-item">
          <span> {{ userInfo.follow_count }} </span>
          <span>关注</span>
        </div>
        <div class="data-item">
          <span> {{ userInfo.fans_count }} </span>
          <span>粉丝</span>
        </div>
        <div class="data-item">
          <span> {{ userInfo.like_count }} </span>
          <span>获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('./login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid :column-num="2">
      <van-grid-item>
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知、小智同学、退出登录 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      @click="onLogout"
      clickable
      title="退出登录"
      center
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 请求加载用户信息，在加载之前判断用户是否登录
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    // 退出登录按钮
    onLogout() {
      this.$dialog
        .confirm({
          title: '确认退出吗？'
          // message: '弹窗内容'
        })
        .then(() => {
          // 确认执行这里
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消执行这里
          this.$toast('获取数据失败，请稍后重试')
        })
      // 登陆后加载用户信息
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        console.log(err)
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .userInfo {
    background: rgba(255, 0, 255, 0.362);
    .base {
      height: 231px;
      padding: 76px 32px 23px;
      background: rgb(153, 49, 49);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
        }
        .name {
          font-size: 29px;
          margin-left: 22px;
          color: #fff;
        }
      }
    }
    .data {
      display: flex;
      justify-content: space-around;
      .data-item {
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        span:nth-child(1) {
          font-size: 36px;
          margin-bottom: 15px;
        }
        span:nth-child(2) {
          font-size: 23px;
        }
      }
    }
  }
  .van-grid {
    background: #fff;
    .toutiao {
      font-size: 45px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    .text {
      color: #000;
      margin-top: 8px;
      font-size: 28px;
    }
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
