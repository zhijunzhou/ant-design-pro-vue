
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="24">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="avatar()">
            </div>
            <div class="username">你大爷永远是你大爷</div>
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <a-divider :dashed="true"/>
          <div class="account-center-team">
            <div class="sfc-scope">
              <Editor :value="content" :options="options" @change="executeCode"/>
              <Preview :value="preview" :styles="styles" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// https://cronus.ministudy.com/uploads/20190917/45620f37eba959fc70cec1957c8f0d60.jpg
import { mapGetters } from 'vuex'
import Preview from './preview'
import Editor from '@/components/Editor/Editor.vue'
import parser from '@/utils/parser'
import compiler from '@/utils/compiler'
import 'codemirror/lib/codemirror.css'

/* eslint-disable no-useless-escape */
const content = `
<style>
  .main {
    color: #2c3e50;
  }
  .text {
    color: #4fc08d;
  }
</style>

<template>
  <div class="main">
    <h2> Welcome to <span class="text">{{ name }}</span>!</h2>
    <h2>Features</h2>
    <ul>
      <li v-for="text in features">{{ text }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    components: {
      Features
    },
    data () {
      return {
        name: 'Vuep',
        features: [
          'Single File Component',
          'Babel for ES6/JSX/UMD/CommonJS',
          'Scoped style',
          'Customizable JavaScript scope'
        ]
      }
    }
  }
<\/script>
`

export default {
  components: {
    Editor,
    Preview
  },
  data () {
    return {
      content: content,
      preview: '',
      styles: '',
      error: '',
      options: {}
    }
  },
  methods: {
    ...mapGetters(['avatar']),
    executeCode (code) {
      this.error = ''
      const result = parser(code)

      /* istanbul ignore next */
      if (result.error) {
        this.error = result.error.message
        return
      }

      const compiledCode = compiler(result, this.scope)

      /* istanbul ignore next */
      if (compiledCode.error) {
        this.error = compiledCode.error.message
        console.error(compiledCode.error)
        return
      }

      this.content = result.content
      this.preview = compiledCode.result
      if (compiledCode.styles) this.styles = compiledCode.styles
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }
}
</style>
