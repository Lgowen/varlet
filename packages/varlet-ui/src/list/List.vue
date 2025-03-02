<template>
  <div :class="classes(n(), n('$--box'))" ref="listEl">
    <slot />

    <slot name="loading" v-if="loading">
      <div :class="n('loading')">
        <div :class="n('loading-text')">{{ dt(loadingText, pack.listLoadingText) }}</div>
        <var-loading size="mini" :radius="10" />
      </div>
    </slot>

    <slot name="finished" v-if="finished">
      <div :class="n('finished')">{{ dt(finishedText, pack.listFinishedText) }}</div>
    </slot>

    <slot name="error" v-if="error">
      <div :class="n('error')" v-ripple @click="load">
        {{ dt(errorText, pack.listErrorText) }}
      </div>
    </slot>

    <div :class="n('detector')" ref="detectorEl"></div>
  </div>
</template>

<script lang="ts">
import VarLoading from '../loading'
import Ripple from '../ripple'
import { defineComponent, ref, nextTick, type Ref, watch } from 'vue'
import { getParentScroller, getRect, toPxNum } from '../utils/elements'
import { props } from './props'
import { isNumber } from '@varlet/shared'
import { dt } from '../utils/shared'
import { createNamespace, call } from '../utils/components'
import { pack } from '../locale'
import { onSmartMounted, onSmartUnmounted } from '@varlet/use'
import { useTabItem } from './provide'

const { n, classes } = createNamespace('list')

export default defineComponent({
  name: 'VarList',
  directives: { Ripple },
  components: {
    VarLoading,
  },
  props,
  setup(props) {
    const { tabItem, bindTabItem } = useTabItem()
    const listEl: Ref<HTMLElement | null> = ref(null)
    const detectorEl: Ref<HTMLElement | null> = ref(null)
    let scroller: HTMLElement | Window

    const load = () => {
      call(props['onUpdate:error'], false)
      call(props['onUpdate:loading'], true)
      call(props.onLoad)
    }

    const isReachBottom = () => {
      const { bottom: containerBottom } = getRect(scroller)
      const { bottom: detectorBottom } = getRect(detectorEl.value!)

      // The fractional part of the detectorBottom when bottoming out overflows
      // https://github.com/varletjs/varlet/issues/310
      return Math.floor(detectorBottom) - toPxNum(props.offset) <= containerBottom
    }

    const removeScrollerListener = () => {
      scroller.removeEventListener('scroll', check)
    }

    // expose
    const check = async () => {
      await nextTick()

      if (props.loading || props.finished || props.error || tabItem?.current.value === false || !isReachBottom()) {
        return
      }

      load()
    }

    call(bindTabItem, {})

    if (tabItem) {
      watch(() => tabItem.current.value, check)
    }

    watch(() => [props.loading, props.error, props.finished], check)

    onSmartMounted(() => {
      scroller = getParentScroller(listEl.value!)
      scroller.addEventListener('scroll', check)

      if (props.immediateCheck) {
        check()
      }
    })

    onSmartUnmounted(removeScrollerListener)

    return {
      pack,
      listEl,
      detectorEl,
      dt,
      isNumber,
      load,
      check,
      n,
      classes,
    }
  },
})
</script>

<style lang="less">
@import '../styles/common';
@import '../ripple/ripple';
@import '../loading/loading';
@import './list';
</style>
