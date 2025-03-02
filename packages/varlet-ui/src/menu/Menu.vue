<template>
  <div
    ref="host"
    :class="classes(n(), n('$--box'))"
    @click="handleHostClick"
    @mouseenter="handleHostMouseenter"
    @mouseleave="handleHostMouseleave"
  >
    <slot />

    <Teleport :to="teleport">
      <transition :name="n()" @after-enter="onOpened" @after-leave="handleClosed">
        <div
          ref="popover"
          :style="{
            zIndex,
            width: sameWidth ? toSizeUnit(Math.ceil(hostSize.width)) : undefined,
          }"
          :class="
            classes(
              n('menu'),
              n('$--box'),
              popoverClass,
              [defaultStyle, n('--menu-background-color')],
              [defaultStyle, formatElevation(elevation, 3)]
            )
          "
          v-show="show"
          @click.stop
          @mouseenter="handlePopoverMouseenter"
          @mouseleave="handlePopoverMouseleave"
        >
          <slot name="menu" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { createNamespace, formatElevation } from '../utils/components'
import { defineComponent } from 'vue'
import { props } from './props'
import { usePopover } from './usePopover'
import { toSizeUnit } from '../utils/elements'

const { n, classes } = createNamespace('menu')

export default defineComponent({
  name: 'VarMenu',
  props,
  setup(props) {
    const {
      popover,
      host,
      hostSize,
      show,
      zIndex,
      handleHostClick,
      handleHostMouseenter,
      handleHostMouseleave,
      handlePopoverMouseenter,
      handlePopoverMouseleave,
      handlePopoverClose,
      handleClosed,
      // expose
      open,
      // expose
      close,
      // expose
      resize,
    } = usePopover(props)

    return {
      popover,
      host,
      hostSize,
      show,
      zIndex,
      formatElevation,
      toSizeUnit,
      n,
      classes,
      handleHostClick,
      handleHostMouseenter,
      handleHostMouseleave,
      handlePopoverMouseenter,
      handlePopoverMouseleave,
      handlePopoverClose,
      handleClosed,
      resize,
      open,
      close,
    }
  },
})
</script>

<style lang="less">
@import './menu';
@import '../styles/elevation';
@import '../styles/common';
</style>
