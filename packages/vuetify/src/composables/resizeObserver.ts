// Utilities
import { onBeforeUnmount, readonly, ref, watch } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

// Globals
import { IN_BROWSER } from '@/util/globals'

interface ResizeState {
  resizeRef: Ref<HTMLElement | undefined>
  contentRect: DeepReadonly<Ref<DOMRectReadOnly | undefined>>
}

export function useResizeObserver (callback?: ResizeObserverCallback): ResizeState {
  const resizeRef = ref<HTMLElement>()
  const contentRect = ref<DOMRectReadOnly>()

  if (IN_BROWSER) {
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      callback?.(entries, observer)

      if (!entries.length) return

      contentRect.value = entries[0].contentRect
    })

    onBeforeUnmount(() => {
      observer.disconnect()
    })

    watch(resizeRef, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(oldValue)
        contentRect.value = undefined
      }

      if (newValue) observer.observe(newValue)
    }, {
      flush: 'post',
    })
  }

  return {
    resizeRef,
    contentRect: readonly(contentRect),
  }
}
