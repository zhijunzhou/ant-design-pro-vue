<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo.svg" class="logo" alt="logo">
            <span class="title">Ant Design</span>
          </a>
        </div>
        <div class="desc">
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 白鹭学园技术组出品
        </div>
        <div class="audioWrapper">
          <div class="audioCon">
            <i class="close">{{ audio }}</i>
            <APlayer
              ref="aplayer"
              :audio="audio"
              :lrcType="0"
              preload="auto"
              :loop="loop"
              @pause="pauseAudio"
              @ended="endAudio"
              @timeupdate="timeupdateAudio"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
// import { axios } from '@/utils/request'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      loop: 'none',
      showAplayer: true,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      audio: {
        name: '东西（Cover：林俊呈）',
        artist: '纳豆',
        url: 'https://cdn.moefe.org/music/mp3/thing.mp3',
        cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
        lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc'
      }
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
    // this.getAudio()
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  },
  methods: {
    // getAudio () {
    //   axios({
    //     method: 'get',
    //     url: '/file/assets/getaudio'
    //   }).then(res => {
    //     if (res.status === 200) {
    //       this.audio.url = this.baseUrl + res.data.url
    //     }
    //   })
    // },
    addLog () {
      // TODO: make some log
    },
    pauseAudio () {
      this.addLog()
    },
    endAudio () {
      this.addLog(1)
    },
    timeupdateAudio () {
      const { media } = this.$refs.aplayer
      if (media.currentTime && media.duration === media.currentTime) {
        this.addLog(1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>
