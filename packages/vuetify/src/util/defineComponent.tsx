// Utils
import {
  defineComponent as _defineComponent, // eslint-disable-line no-restricted-imports
  computed,
  getCurrentInstance,
  shallowRef,
  watchEffect,
} from 'vue'
import { consoleWarn } from '@/util/console'
import { mergeDeep, toKebabCase } from '@/util/helpers'
import { injectSelf } from '@/util/injectSelf'
import { DefaultsSymbol, provideDefaults, useDefaults } from '@/composables/defaults'
import { useToggleScope } from '@/composables/toggleScope'

// Types
import type {
  ComponentObjectPropsOptions,
  ComponentOptions,
  ComponentOptionsMixin,
  ComponentOptionsWithObjectProps,
  ComponentPropsOptions,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  ExtractDefaultPropTypes,
  ExtractPropTypes,
  FunctionalComponent,
  MethodOptions,
  VNode,
  VNodeChild,
} from 'vue'
import { propsFactory } from '@/util/propsFactory'

function propIsDefined (vnode: VNode, prop: string) {
  return typeof vnode.props?.[prop] !== 'undefined' ||
    typeof vnode.props?.[toKebabCase(prop)] !== 'undefined'
}

export const defineComponent = (function defineComponent (options: ComponentOptions) {
  options._setup = options._setup ?? options.setup

  if (!options.name) {
    consoleWarn('The component is missing an explicit name, unable to generate default prop value')

    return options
  }

  if (options._setup) {
    options.props = options.props ?? {}

    options.props = propsFactory(options.props, toKebabCase(options.name))()

    options.props._as = String
    options.setup = function setup (props: Record<string, any>, ctx) {
      const defaults = useDefaults()

      // Skip props proxy if defaults are not provided
      if (!defaults.value) return options._setup(props, ctx)

      const vm = getCurrentInstance()!
      const componentDefaults = computed(() => defaults.value![props._as ?? options.name!])
      const _props = new Proxy(props, {
        get (target, prop: string) {
          if (!propIsDefined(vm.vnode, prop)) {
            return componentDefaults.value?.[prop] ?? defaults.value!.global?.[prop] ?? target[prop]
          }
          return Reflect.get(target, prop)
        },
      })

      const _subcomponentDefaults = shallowRef()
      watchEffect(() => {
        if (componentDefaults.value) {
          const subComponents = Object.entries(componentDefaults.value).filter(([key]) => key.startsWith(key[0].toUpperCase()))
          if (subComponents.length) _subcomponentDefaults.value = Object.fromEntries(subComponents)
        }
      })

      const setupBindings = options._setup(_props, ctx)

      // If subcomponent defaults are provided, override any
      // subcomponents provided by the component's setup function.
      // This uses injectSelf so must be done after the original setup to work.
      useToggleScope(_subcomponentDefaults, () => {
        provideDefaults(mergeDeep(
          injectSelf(DefaultsSymbol)?.value ?? {},
          _subcomponentDefaults.value
        ))
      })

      return setupBindings
    }
  }

  return options
}) as unknown as typeof _defineComponent

type ToListeners<T extends string | number | symbol> = { [K in T]: K extends `on${infer U}` ? Uncapitalize<U> : K }[T]

export type SlotsToProps<T extends Record<string, any>> = T extends Record<string, Slot> ? ({
  $children?: (
    | VNodeChild
    | (keyof T extends 'default' ? T['default'] : {})
    | { [K in keyof T]?: T[K] }
  )
  'v-slots'?: { [K in keyof T]?: T[K] | false }
} & {
  [K in keyof T as `v-slot:${K & string}`]?: T[K] | false
}) : T extends Record<string, any[]> ? SlotsToProps<MakeSlots<T>> : never

type Slot<T extends any[] = any[]> = (...args: T) => VNodeChild
export type MakeSlots<T extends Record<string, any[]>> = {
  [K in keyof T]?: Slot<T[K]>
}

export function genericComponent<T extends (new () => {
  $props?: Record<string, any>
})> (exposeDefaults = true): <
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string,
  I = InstanceType<T>,
  Base = DefineComponent<
    I extends Record<'$props', any>
      ? Omit<PropsOptions, keyof I['$props']>
      : PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E extends any[] ? E : I extends Record<'$props', any> ? Omit<E, ToListeners<keyof I['$props']>> : E,
    EE
  >
>(options: ComponentOptionsWithObjectProps<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>) => Base & T {
  return options => (exposeDefaults ? defineComponent : _defineComponent)(options) as any
}

export function defineFunctionalComponent<
  T extends FunctionalComponent<Props>,
  PropsOptions = ComponentObjectPropsOptions,
  Defaults = ExtractDefaultPropTypes<PropsOptions>,
  Props = Readonly<ExtractPropTypes<PropsOptions>>,
> (props: PropsOptions, render: T): FunctionalComponent<Partial<Defaults> & Omit<Props, keyof Defaults>> {
  render.props = props as any
  return render as any
}
