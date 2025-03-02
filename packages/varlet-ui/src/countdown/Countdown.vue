<template>
  <div :class="n()">
    <slot v-bind="timeData">
      {{ showTime }}
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, onDeactivated, onUnmounted, ref, watch } from 'vue'
import { props } from './props'
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/elements'
import { call, createNamespace } from '../utils/components'
import { padStart } from '../utils/shared'
import { toNumber } from '@varlet/shared'
import type { Ref } from 'vue'
import type { TimeData } from './props'

const { n } = createNamespace('countdown')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export default defineComponent({
  name: 'VarCountdown',
  props,
  setup(props) {
    const showTime: Ref<string> = ref('')
    const timeData: Ref<TimeData> = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    })

    let endTime = 0
    let isStart = false
    let handle = 0
    let remainingTime = 0
    let cacheIsStart: boolean

    const parseFormat = (format: string, time: TimeData): string => {
      const scannedTimes = Object.values(time)
      const scannedFormats = ['DD', 'HH', 'mm', 'ss']
      const padValues = [24, 60, 60, 1000]

      scannedFormats.forEach((scannedFormat, index) => {
        if (!format.includes(scannedFormat)) {
          scannedTimes[index + 1] += scannedTimes[index] * padValues[index]
        } else {
          format = format.replace(scannedFormat, padStart(`${scannedTimes[index]}`, 2, '0'))
        }
      })

      if (format.includes('S')) {
        const ms = padStart(`${scannedTimes[scannedTimes.length - 1]}`, 3, '0')

        if (format.includes('SSS')) {
          format = format.replace('SSS', ms)
        } else if (format.includes('SS')) {
          format = format.replace('SS', ms.slice(0, 2))
        } else {
          format = format.replace('S', ms.slice(0, 1))
        }
      }

      return format
    }

    const displayTime = (durationTime: number) => {
      const days = Math.floor(durationTime / DAY)
      const hours = Math.floor((durationTime % DAY) / HOUR)
      const minutes = Math.floor((durationTime % HOUR) / MINUTE)
      const seconds = Math.floor((durationTime % MINUTE) / SECOND)
      const milliseconds = Math.floor(durationTime % SECOND)

      const time: TimeData = {
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      }
      timeData.value = time

      call(props.onChange, timeData.value)
      showTime.value = parseFormat(props.format, time)
    }

    const countdown = () => {
      const { time, onEnd } = props
      const now = performance.now()

      if (!endTime) {
        endTime = now + toNumber(time)
      }

      remainingTime = endTime - now
      if (remainingTime < 0) {
        remainingTime = 0
      }

      displayTime(remainingTime)

      if (remainingTime === 0) {
        call(onEnd)
        return
      }

      if (isStart) {
        handle = requestAnimationFrame(countdown)
      }
    }

    // expose
    const start = (resume = false) => {
      if (isStart && !resume) {
        return
      }

      isStart = true
      endTime = performance.now() + (remainingTime || toNumber(props.time))
      countdown()
    }

    // expose
    const pause = () => {
      isStart = false
      cancelAnimationFrame(handle)
    }

    // expose
    const reset = () => {
      endTime = 0
      isStart = false
      cancelAnimationFrame(handle)
      countdown()
    }

    watch(
      () => props.time,
      () => {
        reset()

        if (props.autoStart) {
          start()
        }
      },
      { immediate: true }
    )

    onActivated(() => {
      if (cacheIsStart == null) {
        return
      }

      isStart = cacheIsStart

      if (isStart === true) {
        start(true)
      }
    })

    onDeactivated(() => {
      cacheIsStart = isStart
      pause()
    })

    onUnmounted(pause)

    return {
      showTime,
      timeData,
      n,
      start,
      pause,
      reset,
    }
  },
})
</script>

<style lang="less">
@import '../styles/common';
@import './countdown';
</style>
