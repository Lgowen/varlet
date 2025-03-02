<template>
  <div :class="n()" v-hover:desktop="hover">
    <div
      :class="classes(n('block'), [disabled || formDisabled, n('--disabled')])"
      @click="switchActive"
      :style="styleComputed.switch"
    >
      <div
        :style="styleComputed.track"
        :class="
          classes(n('track'), [modelValue === activeValue, n('track--active')], [errorMessage, n('track--error')])
        "
      ></div>
      <div
        :class="classes(n('ripple'), [modelValue === activeValue, n('ripple--active')])"
        :style="styleComputed.ripple"
        v-ripple="{
          disabled: !ripple || disabled || loading || formDisabled,
        }"
      >
        <div
          :style="styleComputed.handle"
          :class="
            classes(
              n('handle'),
              n('$-elevation--2'),
              [modelValue === activeValue, n('handle--active')],
              [errorMessage, n('handle--error')]
            )
          "
        >
          <span
            v-if="loading"
            :class="n('loading')"
            :style="{
              width: radius,
              height: radius,
            }"
          >
            <svg viewBox="25 25 50 50">
              <circle cx="50" cy="50" r="20" fill="none"></circle>
            </svg>
          </span>
        </div>

        <var-hover-overlay :hovering="hovering" />
      </div>
    </div>
    <var-form-details :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import VarFormDetails from '../form-details'
import Ripple from '../ripple'
import VarHoverOverlay, { useHoverOverlay } from '../hover-overlay'
import Hover from '../hover'
import { defineComponent, computed, nextTick, type ComputedRef } from 'vue'
import { useValidation, createNamespace, call } from '../utils/components'
import { multiplySizeUnit } from '../utils/elements'
import { useForm } from '../form/provide'
import { props } from './props'
import { type SwitchProvider } from './provide'

const { n, classes } = createNamespace('switch')

type StyleProps = {
  width: string
  height: string
  left: string
  borderRadius: string
  backgroundColor: string
  color: string
}

export default defineComponent({
  name: 'VarSwitch',
  components: {
    VarFormDetails,
    VarHoverOverlay,
  },
  directives: { Ripple, Hover },
  props,
  setup(props) {
    const { bindForm, form } = useForm()
    const { errorMessage, validateWithTrigger: vt, validate: v, resetValidation } = useValidation()
    const { hovering, handleHovering } = useHoverOverlay()

    const validate = () => v(props.rules, props.modelValue)

    const validateWithTrigger = () => nextTick(() => vt(['onChange'], 'onChange', props.rules, props.modelValue))

    const styleComputed: ComputedRef<Record<string, Partial<StyleProps>>> = computed(() => {
      const { size, modelValue, color, closeColor, loadingColor, activeValue } = props

      return {
        handle: {
          width: multiplySizeUnit(size),
          height: multiplySizeUnit(size),
          backgroundColor: modelValue === activeValue ? color : closeColor,
          color: loadingColor,
        },
        ripple: {
          left: modelValue === activeValue ? multiplySizeUnit(size, 0.5) : `-${multiplySizeUnit(size, 0.5)}`,
          color: modelValue === activeValue ? color : closeColor || '#999',
          width: multiplySizeUnit(size, 2),
          height: multiplySizeUnit(size, 2),
        },
        track: {
          height: multiplySizeUnit(size, 0.72),
          width: multiplySizeUnit(size, 1.9),
          borderRadius: multiplySizeUnit(size, 2 / 3),
          filter: modelValue === activeValue || errorMessage?.value ? undefined : 'brightness(.6)',
          backgroundColor: modelValue === activeValue ? color : closeColor,
        },
        switch: {
          height: multiplySizeUnit(size, 1.2),
          width: multiplySizeUnit(size, 2),
        },
      }
    })

    const radius: ComputedRef<string | undefined> = computed(() => multiplySizeUnit(props.size, 0.8))

    const switchActive = (event: MouseEvent) => {
      const {
        onClick,
        onChange,
        disabled,
        loading,
        readonly,
        modelValue,
        activeValue,
        inactiveValue,
        'onUpdate:modelValue': updateModelValue,
      } = props

      call(onClick, event)
      if (disabled || loading || readonly || form?.disabled.value || form?.readonly.value) return
      const newValue = modelValue === activeValue ? inactiveValue : activeValue
      call(onChange, newValue)
      call(updateModelValue, newValue)
      validateWithTrigger()
    }

    const hover = (value: boolean) => {
      if (props.disabled || form?.disabled.value) return

      handleHovering(value)
    }

    const reset = () => {
      call(props['onUpdate:modelValue'], props.inactiveValue)
      resetValidation()
    }

    const switchProvider: SwitchProvider = {
      reset,
      validate,
      resetValidation,
    }
    call(bindForm, switchProvider)

    return {
      n,
      classes,
      multiplySizeUnit,
      switchActive,
      hovering,
      hover,
      radius,
      styleComputed,
      errorMessage,
      formDisabled: form?.disabled,
      formReadonly: form?.readonly,
    }
  },
})
</script>

<style lang="less">
@import '../styles/common';
@import '../styles/elevation';
@import '../ripple/ripple';
@import '../loading/loading';
@import '../form-details/formDetails';
@import '../hover-overlay/hoverOverlay';
@import './switch';
</style>
