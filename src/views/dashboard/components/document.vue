<script>
import PdfSvg from '@/assets/pdf.svg?inline'
import FileSvg from '@/assets/file.svg?inline'

export default {
  components: {
    PdfSvg,
    FileSvg
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    suffixMapping: {
      required: true,
      type: Object
    }
  },
  render (h) {
    const { item } = this
    const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/g

    if (typeof item.url === 'string' && item.url.length > 0) {
      const suffix = item.url.substr(item.url.lastIndexOf('.') + 1).toLowerCase()
      const suffixMapping = this.suffixMapping

      if (regex.test(item.url)) {
        return (
          <div>
            <img class="img-overview" alt={item.name} src={item.url} slot="cover" />
            <a-card-meta
              class="card-desc"
              title={item.name}>
              <template slot="description">{ item.desc }</template>
            </a-card-meta>
          </div>
        )
      } else if (suffixMapping[suffix]) {
        return (
          <div>
            <a href={item.url} target="_blank"><PdfSvg /></a>
            <a-card-meta
              class="card-desc card-desc-attach"
              title={item.name}>
              <template slot="description">{ item.desc }</template>
            </a-card-meta>
          </div>
        )
      } else {
        return (
          <div>
            <a href={item.url} target="_blank"><FileSvg /></a>
            <a-card-meta
              class="card-desc card-desc-attach"
              title={item.name}>
              <template slot="description">{ item.desc }</template>
            </a-card-meta>
          </div>
        )
      }
    }

    return <div>{item.url}</div>
  }
}
</script>
