<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <div slot="left" class="nav-bar-lefticon" @click="leftIcon">
        <van-icon name="arrow-left" />
      </div>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- 只要能获取到文章的title或者任何一个部分就显示文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 关注 -->
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
            v-if="article.is_followed"
            :loading="followLoading"
            @click="onFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            >关注</van-button
          > -->

          <!-- 关注封装组件 -->
          <!-- 当传递给子组件的数据既要使用还要修改时可以使用v-model -->
          <!-- <FollowUser
            class="follow-btn"
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            @update-is-followed="article.is_followed = $event"// $event 是事件参数
          ></FollowUser> -->
          <FollowUser
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          ></FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表 -->
        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-clik="onReplyClick"
        />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >
            写评论
          </van-button>

          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />

          <!-- 收藏 -->
          <!-- <van-icon color="#777" name="star-o" /> -->
          <CollectArticle
            v-model="article.is_collected"
            :article-id="article.art_id"
          />

          <!-- 点赞 -->
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <LikeArticle
            v-model="article.attitude"
            :article-id="article.art_id"
          />

          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errstatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- popup 懒渲染 -->
    <van-popup v-model="isReplayShow" position="bottom" style="height: 100%">
      <CommentReply
        v-if="isReplayShow"
        :comment="currentComment"
        @close="isReplayShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
// import { addFollow, delFollow } from '@/api/user.js'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment_post.vue'
import CommentReply from './components/comment_reply.vue'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },

  // 给所有的后代组件传数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {},
      loading: true, // 加载中的状态
      errstatus: 0, // 失败的状态码
      isFollowed: false,
      followLoading: false, // 关注按钮的loading状态
      totalCommentCount: 0,
      isPostShow: false, // 发布评论的弹出层是否展示
      commentList: [],
      isReplayShow: false,
      currentComment: {}
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    leftIcon() {
      this.$router.back()
    },

    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)

        // 数据驱动视图不是立即的
        this.article = data.data

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        console.log(err)
        if (err.response && err.response.status === 404) {
          this.errstatus = 404
        }
        // this.$toast.fail('加载失败')
      }
      // 无论是成功还是失败，都需要关闭loading
      this.loading = false
    },

    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // 获取img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },

    onPostSuccess(data) {
      console.log(123)
      // 关闭弹层
      this.isPostShow = false
      // 将发布内容显示在列表顶部
      this.commentList.unshift(data.new_obj)
      console.log(this.commentList)
    },

    onReplyClick(comment) {
      console.log(comment)
      this.currentComment = comment
      this.isReplayShow = true
    }

    /* async onFollow() {
      this.followLoading = true
      try {
        if (this.article.is_followed) {
          // 已关注，取消关注
          await delFollow(this.article.aut_id)
        } else {
          // 未关注，请求关注
          await addFollow(this.article.aut_id)
        }
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注自己'
        }
        this.$toast(message)
      }
      this.followLoading = false
    } */
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .page-nav-bar {
    .nav-bar-lefticon {
      .van-icon {
        color: #fff;
      }
    }
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
