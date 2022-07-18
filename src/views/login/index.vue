<template>
  <div class="login-container">
    <!-- 导航栏  nav-bar组件 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单  form组件 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请填写手机号"
        :rules="userFormRules.mobile"
        type="number"
        v-model="user.mobile"
        maxlength="11"
      >
        <template v-slot:left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>

      <van-field
        type="text"
        name="密码"
        placeholder="请填写验证码"
        :rules="userFormRules.code"
        v-model="user.code"
        maxlength="6"
      >
        <template v-slot:left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>

        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            size="small"
            type="primary"
            round
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'

export default {
  data() {
    return {
      user: {
        mobile: '18636369999', // 手机号
        code: '246810' // 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3\5\7\8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      const user = this.user

      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })

      // 请求登录
      try {
        const { data } = await login(user)

        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请重试')
        }
      }
    },
    async onSendSms() {
      // 手机号验证
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 验证通过，展示倒计时
      this.isCountDownShow = true

      // 发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>

<style scoped>
.toutiao {
  font-size: 38px;
}
.van-button--small {
  background-color: #ededed;
  color: #666;
  border: 0px;
}
</style>
