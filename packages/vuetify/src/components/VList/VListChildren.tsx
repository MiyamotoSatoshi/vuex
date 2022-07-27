// Components
import { VDivider } from '../VDivider'
import { filterListGroupProps, VListGroup } from './VListGroup'
import { VListItem } from './VListItem'
import { VListSubheader } from './VListSubheader'

// Utilities
import { createList } from './list'
import { genericComponent } from '@/util'

// Types
import type { InternalListItem } from './VList'
import type { ListGroupActivatorSlot } from './VListGroup'
import type { ListItemSubtitleSlot, ListItemTitleSlot } from './VListItem'
import type { MakeSlots } from '@/util'
import type { Prop } from 'vue'

export const VListChildren = genericComponent<new <T extends InternalListItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    default: []
    header: [ListGroupActivatorSlot]
    item: [T]
    title: [ListItemTitleSlot]
    subtitle: [ListItemSubtitleSlot]
  }>
}>()({
  name: 'VListChildren',

  props: {
    items: Array as Prop<InternalListItem[]>,
  },

  setup (props, { slots }) {
    createList()

    return () => slots.default?.() ?? props.items?.map(({ children, props: itemProps, type, raw: item }) => {
      if (type === 'divider') return <VDivider {...itemProps} />

      if (type === 'subheader') return <VListSubheader {...itemProps} v-slots={ slots } />

      const slotsWithItem = {
        subtitle: slots.subtitle ? (slotProps: any) => slots.subtitle?.({ ...slotProps, item }) : undefined,
        prepend: slots.prepend ? (slotProps: any) => slots.prepend?.({ ...slotProps, item }) : undefined,
        append: slots.append ? (slotProps: any) => slots.append?.({ ...slotProps, item }) : undefined,
        default: slots.default ? (slotProps: any) => slots.default?.({ ...slotProps, item }) : undefined,
        title: slots.title ? (slotProps: any) => slots.title?.({ ...slotProps, item }) : undefined,
      }

      const [listGroupProps, _1] = filterListGroupProps(itemProps as any)

      return children ? (
        <VListGroup
          value={ itemProps?.value }
          { ...listGroupProps }
        >
          {{
            activator: ({ props: activatorProps }) => slots.header
              ? slots.header({ ...itemProps, ...activatorProps })
              : <VListItem { ...itemProps } { ...activatorProps } v-slots={ slotsWithItem } />,
            default: () => (
              <VListChildren items={ children } v-slots={ slots } />
            ),
          }}
        </VListGroup>
      ) : (
        slots.item ? slots.item(itemProps) : (
          <VListItem
            { ...itemProps }
            v-slots={ slotsWithItem }
          />
        )
      )
    })
  },
})
