<template>
  <div class="login-container">
    <!-- 导航栏  nav-bar组件 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单  form组件 -->
    <van-form @submit="onSubmit">
      <van-field name="手机号" placeholder="请填写手机号" />
      <van-field type="password" name="密码" placeholder="请填写验证码" />
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log('submit', values)
    }
  }
}
</script>

<style scoped></style>
