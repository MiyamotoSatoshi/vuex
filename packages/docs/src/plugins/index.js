import marked from 'marked'

// Make this dynamic
import '@/plugins/no-ssr'

marked.setOptions({
  headerIds: false,
})
