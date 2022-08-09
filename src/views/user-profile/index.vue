<template>
  <div class="user-profile">
    <!-- 用户资料编辑 -->
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" rounder :src="user.photo" round>
      </van-image>
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      @click="isUpdateNameShow = true"
      is-link
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />

    <van-cell
      title="生日"
      @click="isUpdateBirthdayShow = true"
      :value="user.birthday || '1977-00-00'"
      is-link
    />

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      style="height: 100%"
    >
      <!-- v-model 既传值又修改 -->
      <UpdateName @close="isUpdateNameShow = false" v-model="user.name" />
    </van-popup>

    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
      style="height: 40%"
    >
      <UpdateGender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <updatePhoto
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserPrifile } from '@/api/user.js'
import UpdateName from './components/updateName.vue'
import UpdateGender from './components/updateGender.vue'
import UpdateBirthday from './components/updateBirthday.vue'
import updatePhoto from './components/updatePhoto'
export default {
  components: { UpdateName, UpdateGender, UpdateBirthday, updatePhoto },
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserPrifile()
        this.user = data.data
      } catch (err) {
        console.log(err)
        this.$toast('获取数据失败')
      }
    },
    onFileChange() {
      // 获取文章对象
      const file = this.$refs.file.files[0]
      console.log(file)
      // 基于文章对象获取 blob 对象
      this.img = window.URL.createObjectURL(file)

      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .van-nav-bar__content {
    background-color: #fff;
  }
  /deep/.avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #f5f7f9;
  }
}
</style>
