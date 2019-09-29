<script>
import CodeMirror from 'codemirror'
// import assign from '../utils/assign'

const DEFAULT_OPTIONS = {
  lineNumbers: true,
  mode: 'text/x-vue',
  theme: 'material',
  tabSize: 2
}

export default {
  name: 'VueCodeMirror',

  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },

  render (h) {
    return h('div', null, [
      h('textarea', { ref: 'textarea' }, this.value)
    ])
  },

  mounted () {
    this.currentOptions = Object.assign({}, DEFAULT_OPTIONS, this.options)
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, this.currentOptions)
    this.editor.on('change', this.handleChange)
  },

  watch: {
    value (val) {
      val !== this.editor.getValue() && this.editor.setValue(val)
    }
  },

  methods: {
    handleChange () {
      /* istanbul ignore next */
      this.$emit('change', this.editor.getValue())
    }
  }
}
</script>
