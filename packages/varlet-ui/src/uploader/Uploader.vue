<template>
  <div :class="classes(n(), n('$--box'))">
    <div :class="n('file-list')">
      <div
        :class="classes(n('file'), formatElevation(elevation, 2), [f.state === 'loading', n('--loading')])"
        :key="f.id"
        v-for="f in files"
        v-ripple="{ disabled: disabled || formDisabled || readonly || formReadonly || !ripple }"
        @click="preview(f)"
      >
        <div :class="n('file-name')">{{ f.name || f.url }}</div>
        <div :class="n('file-close')" v-if="removable" @click.stop="handleRemove(f)">
          <var-icon :class="n('file-close-icon')" var-uploader-cover name="delete" />
        </div>
        <img :class="n('file-cover')" :style="{ objectFit: f.fit }" :src="f.cover" :alt="f.name" v-if="f.cover" />
        <div :class="n('file-indicator')">
          <div
            :class="
              classes(n('progress'), [f.state === 'success', n('--success')], [f.state === 'error', n('--error')])
            "
            :style="{ width: f.state === 'success' || f.state === 'error' ? '100%' : `${f.progress}%` }"
          ></div>
        </div>
      </div>

      <div
        :class="
          classes(
            [!$slots.default, `${n('action')} ${formatElevation(elevation, 2)}`],
            [disabled || formDisabled, n('--disabled')]
          )
        "
        v-if="!maxlength || modelValue.length < toNumber(maxlength)"
        v-ripple="{ disabled: disabled || formDisabled || readonly || formReadonly || !ripple || $slots.default }"
        v-hover:desktop="handleHovering"
        @click="chooseFile"
      >
        <input
          ref="input"
          type="file"
          :class="n('action-input')"
          :multiple="multiple"
          :accept="accept"
          :capture="capture"
          :disabled="disabled || formDisabled || readonly || formReadonly"
          @change="handleChange"
        />

        <slot>
          <var-icon :class="n('action-icon')" var-uploader-cover name="plus" />
          <var-hover-overlay :hovering="hovering && !disabled && !formDisabled" />
        </slot>
      </div>
    </div>

    <var-form-details :error-message="errorMessage" :extra-message="maxlengthText">
      <template v-if="$slots['extra-message']" #extra-message>
        <slot name="extra-message" />
      </template>
    </var-form-details>

    <var-popup
      :class="n('preview')"
      var-uploader-cover
      position="center"
      v-model:show="showPreview"
      @closed="currentPreview = null"
    >
      <video
        :class="n('preview-video')"
        playsinline="true"
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        controls
        :src="currentPreview?.url"
        v-if="currentPreview && isHTMLSupportVideo(currentPreview?.url)"
      ></video>
    </var-popup>
  </div>
</template>

<script lang="ts">
import VarHoverOverlay, { useHoverOverlay } from '../hover-overlay'
import VarFormDetails from '../form-details'
import VarIcon from '../icon'
import VarPopup from '../popup'
import ImagePreview from '../image-preview'
import Ripple from '../ripple'
import Hover from '../hover'
import { defineComponent, nextTick, reactive, computed, watch, ref, type ComputedRef, type Ref } from 'vue'
import { props, type VarFile, type ValidateTrigger } from './props'
import { isNumber, toNumber, isString, normalizeToArray } from '@varlet/shared'
import { isHTMLSupportImage, isHTMLSupportVideo } from '../utils/shared'
import { call, useValidation, createNamespace, formatElevation } from '../utils/components'
import { useForm } from '../form/provide'
import { type UploaderProvider } from './provide'
import { toSizeUnit } from '../utils/elements'

const { n, classes } = createNamespace('uploader')

interface ValidationVarFile {
  valid: boolean
  varFile: VarFile
}

interface VarFileUtils {
  getLoading(): VarFile[]

  getSuccess(): VarFile[]

  getError(): VarFile[]
}

let fid = 0

export default defineComponent({
  name: 'VarUploader',
  directives: { Ripple, Hover },
  components: {
    VarIcon,
    VarPopup,
    VarFormDetails,
    VarHoverOverlay,
  },
  props,
  setup(props) {
    const input: Ref<null | HTMLElement> = ref(null)
    const showPreview: Ref<boolean> = ref(false)
    const currentPreview: Ref<null | VarFile> = ref(null)
    const maxlengthText: ComputedRef<string> = computed(() => {
      const {
        maxlength,
        modelValue: { length },
      } = props

      return isNumber(maxlength) ? `${length} / ${maxlength}` : ''
    })

    const { form, bindForm } = useForm()
    const {
      errorMessage,
      validateWithTrigger: vt,
      validate: v,
      // expose
      resetValidation,
    } = useValidation()
    const { hovering, handleHovering } = useHoverOverlay()

    const files = computed(() => {
      const { modelValue, hideList } = props

      if (hideList) {
        return []
      }
      return modelValue
    })

    const preview = (varFile: VarFile) => {
      const { disabled, readonly, previewed } = props

      if (form?.disabled.value || form?.readonly.value || disabled || readonly || !previewed) {
        return
      }

      const { url } = varFile

      if (isString(url) && isHTMLSupportImage(url)) {
        ImagePreview(url)
        return
      }

      if (isString(url) && isHTMLSupportVideo(url)) {
        currentPreview.value = varFile
        showPreview.value = true
      }
    }

    const createVarFile = (file: File): VarFile => ({
      id: fid++,
      url: '',
      cover: '',
      name: file.name,
      file,
      progress: 0,
    })

    const getFiles = (event: Event): File[] => {
      const el = event.target as HTMLInputElement
      const { files: fileList } = el
      return Array.from<File>(fileList as ArrayLike<File>)
    }

    const resolver = (varFile: VarFile): Promise<VarFile> =>
      new Promise((resolve) => {
        // For performance, only file reader processing is performed on images
        if (!varFile.file!.type.startsWith('image')) {
          resolve(varFile)
          return
        }

        const fileReader = new FileReader()

        fileReader.onload = () => {
          const base64 = fileReader.result as string

          varFile.cover = base64
          varFile.url = base64

          resolve(varFile)
        }

        fileReader.readAsDataURL(varFile.file as File)
      })

    const getResolvers = (varFiles: VarFile[]) => varFiles.map(resolver)

    const getBeforeReaders = (varFiles: VarFile[]): Promise<ValidationVarFile>[] => {
      const { onBeforeRead } = props

      return varFiles.map(
        (varFile) =>
          new Promise((resolve) => {
            if (!onBeforeRead) {
              resolve({
                valid: true,
                varFile,
              })
            }

            const results = normalizeToArray(call(onBeforeRead, reactive(varFile)))
            Promise.all(results).then((values) => {
              resolve({
                valid: values.every(Boolean),
                varFile,
              })
            })
          })
      )
    }

    const handleChange = async (event: Event) => {
      const { maxsize, maxlength, modelValue, onOversize, onAfterRead, onBeforeFilter, readonly, disabled } = props

      if (form?.disabled.value || form?.readonly.value || disabled || readonly) {
        return
      }

      const getValidSizeVarFile = (varFiles: VarFile[]): VarFile[] =>
        varFiles.filter((varFile) => {
          if (varFile.file!.size > toNumber(maxsize)) {
            call(onOversize, reactive(varFile))
            return false
          }

          return true
        })

      const getValidLengthVarFiles = (varFiles: VarFile[]): VarFile[] => {
        const limit = Math.min(varFiles.length, toNumber(maxlength) - modelValue.length)
        return varFiles.slice(0, limit)
      }

      const getFilterVarFiles = async (varFiles: VarFile[]): Promise<VarFile[]> => {
        if (!onBeforeFilter) {
          return varFiles
        }

        const events = normalizeToArray(onBeforeFilter)

        // eslint-disable-next-line no-restricted-syntax
        for (const event of events) {
          varFiles = await event(varFiles)
        }

        return varFiles
      }

      // limit
      const files = getFiles(event)
      let varFiles: VarFile[] = files.map(createVarFile)

      varFiles = await getFilterVarFiles(varFiles)
      varFiles = maxsize != null ? getValidSizeVarFile(varFiles) : varFiles
      varFiles = maxlength != null ? getValidLengthVarFiles(varFiles) : varFiles

      // pre resolve
      const resolvedVarFiles: VarFile[] = await Promise.all(getResolvers(varFiles))
      const validationVarFiles: ValidationVarFile[] = await Promise.all(getBeforeReaders(resolvedVarFiles))
      const validVarFiles: VarFile[] = validationVarFiles.filter(({ valid }) => valid).map(({ varFile }) => varFile)

      call(props['onUpdate:modelValue'], [...modelValue, ...validVarFiles])
      ;(event.target as HTMLInputElement).value = ''
      validVarFiles.forEach((varFile) => call(onAfterRead, reactive(varFile)))
    }

    const handleRemove = async (removedVarFile: VarFile) => {
      const { disabled, readonly, modelValue, onBeforeRemove, onRemove } = props

      if (form?.disabled.value || form?.readonly.value || disabled || readonly) {
        return
      }

      if (onBeforeRemove) {
        const results = normalizeToArray(call(onBeforeRemove, reactive(removedVarFile)))
        if ((await Promise.all(results)).some((result) => !result)) {
          return
        }
      }

      const expectedFiles: VarFile[] = modelValue.filter((varFile) => varFile !== removedVarFile)
      call(onRemove, reactive(removedVarFile))
      validateWithTrigger('onRemove')
      call(props['onUpdate:modelValue'], expectedFiles)
    }

    // expose
    const getSuccess = () => props.modelValue.filter((varFile) => varFile.state === 'success')

    // expose
    const getError = () => props.modelValue.filter((varFile) => varFile.state === 'error')

    // expose
    const getLoading = () => props.modelValue.filter((varFile) => varFile.state === 'loading')

    // expose
    const chooseFile = () => {
      input.value!.click()
    }

    // expose
    const closePreview = () => {
      currentPreview.value = null
      showPreview.value = false
      ImagePreview.close()
    }

    const varFileUtils: VarFileUtils = {
      getSuccess,
      getError,
      getLoading,
    }

    const validateWithTrigger = (trigger: ValidateTrigger) => {
      nextTick(() => {
        const { validateTrigger, rules, modelValue } = props
        vt(validateTrigger, trigger, rules, modelValue, varFileUtils)
      })
    }

    let callReset = false

    // expose
    const validate = () => v(props.rules, props.modelValue, varFileUtils)

    // expose
    const reset = () => {
      callReset = true
      call(props['onUpdate:modelValue'], [])
      resetValidation()
    }

    const uploaderProvider: UploaderProvider = {
      validate,
      resetValidation,
      reset,
    }

    call(bindForm, uploaderProvider)

    watch(
      () => props.modelValue,
      () => {
        !callReset && validateWithTrigger('onChange')
        callReset = false
      },
      { deep: true }
    )

    return {
      n,
      classes,
      formatElevation,
      input,
      files,
      showPreview,
      currentPreview,
      errorMessage,
      maxlengthText,
      hovering,
      formDisabled: form?.disabled,
      formReadonly: form?.readonly,
      toNumber,
      handleHovering,
      isHTMLSupportVideo,
      isHTMLSupportImage,
      preview,
      handleChange,
      handleRemove,
      getSuccess,
      getError,
      getLoading,
      validate,
      resetValidation,
      reset,
      chooseFile,
      closePreview,
      toSizeUnit,
    }
  },
})
</script>

<style lang="less">
@import '../styles/common';
@import '../styles/elevation';
@import '../form-details/formDetails';
@import '../icon/icon';
@import '../popup/popup';
@import '../image-preview/imagePreview';
@import '../hover-overlay/hoverOverlay';
@import './uploader';
</style>
