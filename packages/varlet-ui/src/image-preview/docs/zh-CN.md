# 图片预览

### 介绍

图片放大预览，支持双击倍数放大，支持函数调用和组件调用两种方式。

## 函数调用

### 基本使用

```html
<script setup>
import { ImagePreview } from '@varlet/ui'

function preview() {
  ImagePreview('https://varlet.gitee.io/varlet-ui/cat.jpg')
}
</script>

<template>
  <var-button type="primary" block @click="preview">基本使用</var-button>
</template>
```

### 处理回调函数

```html
<script setup>
import { ImagePreview } from '@varlet/ui'

function preview() {
  ImagePreview({
    images: [
      'https://varlet.gitee.io/varlet-ui/cat.jpg',
      'https://varlet.gitee.io/varlet-ui/cat2.jpg'
    ],
    onChange(index) {
      console.log(index)
    }
  })
}
</script>

<template>
  <var-button type="primary" block @click="preview">处理回调函数</var-button>
</template>
```


## 组件调用

### 基本使用

```html
<script setup>
import { ref } from 'vue'

const show = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
</script>

<template>
  <var-button
    type="warning"
    block
    @click="show = true"
  >
    基本使用
  </var-button>
  <var-image-preview :images="images" v-model:show="show" />
</template>
```
### 指定初始位置

```html
<script setup>
import { ref } from 'vue'

const show = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
</script>

<template>
  <var-button
    type="warning"
    block
    @click="show = true"
  >
    指定初始位置
  </var-button>
  <var-image-preview
    :initial-index="1"
    :images="images"
    v-model:show="show"
  />
</template>
```

### 展示关闭按钮

```html
<script setup>
import { ref } from 'vue'

const show = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
</script>

<template>
  <var-button
    type="warning"
    block
    @click="show = true"
  >
    展示关闭按钮
  </var-button>
  <var-image-preview
    closeable
    :images="images"
    v-model:show="show"
  />
</template>
```

### 监听关闭事件

```html
<script setup>
import { ref } from 'vue'
import { Snackbar } from '@varlet/ui'

const show = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
</script>

<template>
  <var-button
    block
    type="warning"
    @click="show = true"
  >
    监听关闭事件
  </var-button>
  <var-image-preview
    :images="images"
    v-model:show="show"
    @close="Snackbar('触发了关闭事件。')"
  />
</template>
```

### 监听长按事件

通过 `image-prevent-default` 属性禁止图片默认行为，可自定义 `long-press` 事件来实现长按需求。

```html
<script setup>
import { ref } from 'vue'
import { Snackbar } from '@varlet/ui'

const show = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
</script>

<template>
  <var-button
    block
    type="warning"
    @click="show = true"
  >
    监听长按事件
  </var-button>
  <var-image-preview
    image-prevent-default
    :images="images"
    v-model:show="show"
    @long-press="Snackbar('触发了长按事件')"
  />
</template>
```

### 展示额外插槽

```html
<script setup>
import { ref } from 'vue'

const show = ref(false)
const menuShow = ref(false)
const images = ref([
  'https://varlet.gitee.io/varlet-ui/cat.jpg',
  'https://varlet.gitee.io/varlet-ui/cat2.jpg',
])
const actions = [
  {
    name: '操作',
    icon: 'wrench'
  },
  {
    name: '操作',
    icon: 'wrench'
  }
]
</script>

<template>
  <var-button
    block
    type="warning" 
    @click="show = true"
  >
    展示额外插槽
  </var-button>
  <var-image-preview :images="images" v-model:show="show">
    <template #extra>
      <var-icon
        name="menu"
        :size="22"
        color="#fff"
        @click="menuShow = true"
      />
      <var-action-sheet :actions="actions" v-model:show="menuShow" />
    </template>
  </var-image-preview>
</template>
```
## API

### 属性

| 参数         | 说明   | 类型  | 默认值  |
| ------------ | ------------ | ------------------ | ------------ |
| `show`       | 是否显示     | _boolean_ | `false` |
| `images`     | 需要预览的图片 URL 数组 | _string[]_ | `[]` |
| `initial-index` | 图片预览起始的索引 | _string \| number_ | `0` |
| `zoom`       | 双击放大倍数 | _string \| number_ | `2` |
| `closeable`  | 是否显示关闭按钮 | _boolean_ | `false` |
| `loop`       | 是否开启循环播放 | _boolean_ | `true` |
| `indicator`  | 是否显示分页 | _boolean_ | `true` |
| `lock-scroll` | 锁定滚动 | _boolean_ | `true` |
| `teleport`   | 弹出层挂载的位置 | _TeleportProps['to']_ | `body` |
| `image-prevent-default` | 是否禁止图片默认行为 |  _boolean_ | `false` |

### 事件

| 事件名 | 说明  | 回调参数 |
| ----- | ---- | ----- |
| `change` | 切换图片时的回调函数，回调参数为当前索引 | `index: number` 图片索引 |
| `open`   | 打开 image-preview 时触发 | `-`  |
| `opened` | 打开 image-preview 动画结束时触发 | `-` |
| `close`  | 关闭 image-preview 时触发 | `-` |
| `closed` | 关闭 image-preview 动画结束时触发 | `-` |
| `long-press` | 长按图片时的回调函数，回调参数为当前索引 | `index: number` 图片索引 | 

### 方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `ImagePreview` | 显示 image-preview | _options \| string \| string[]_ | `-` |
| `ImagePreview.close` | 关闭 image-preview | _-_ | `-` |
| `ImagePreview.setDefaultOptions` | 设置默认的选项配置 | _options_ | `-` |
| `ImagePreview.resetDefaultOptions` | 重置默认的选项配置 | _-_ | `-` |
| `prev` | 上一页 | `options?: SwipeToOptions` | `-` |
| `next` | 下一页 | `options?: SwipeToOptions` | `-` |
| `to` | 跳转到指定下标 | `index: number, options?: SwipeToOptions` | `-` |

### 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `indicator` | 分页指示器 | `index: number` 图片索引 <br> `length: number` 图片总数 |
| `close-icon` | 关闭按钮 | `-` |
| `extra` | 额外插槽 | `-` |

### ImagePreview Options

| 参数   | 说明  |  类型  | 默认值 |
| ------ | ----------- | ------ | -------- |
| `images`     | 需要预览的图片 URL 数组或者单个图片的 URL  | _string[] \| string_ | `[]` |
| `initialIndex` | 图片预览起始的索引 | _string \| number_ | `0` |
| `zoom`       | 双击放大倍数  | _string \| number_ | `2` |
| `closeable`  | 是否显示关闭按钮 | _boolean_ | `false` |
| `loop`       | 是否开启循环播放 | _boolean_ | `true` |
| `indicator`  | 是否显示分页 | _boolean_ | `true` |
| `lockScroll` | 锁定滚动 | _boolean_ | `true` |
| `imagePreventDefault` | 是否禁止图片默认行为 |  _boolean_ | `false` |
| `onChange`   | 切换图片时的回调函数，回调参数为当前索引 | _(index: number) => void_  |  `-` |
| `onOpen`   | image-preview 开启时候的回调 |  _() => void_ | `-` |
| `onOpened` | image-preview 动画结束时候的回调 |   _() => void_ | `-` |
| `onClose`  | image-preview 时关闭时候的回调 |  _() => void_ |  `-` |
| `onClosed` | image-preview 关闭动画结束时候的回调 |  _() => void_ | `-` |
| `onLongPress` | 长按图片时的回调函数，回调参数为当前索引 | _(index: number) => void_  |  `-` |

### 样式变量
以下为组件使用的 css 变量，可以使用 [StyleProvider 组件](#/zh-CN/style-provider) 进行样式定制。

| 变量名                                           | 默认值   |
|-----------------------------------------------| -------- |
| `--image-preview-swipe-indicators-text-color` | `#ddd`  |
| `--image-preview-swipe-indicators-padding`    | `16px 0` |
| `--image-preview-zoom-container-background`   | `#000`  |
| `--image-preview-close-icon-top`              | `14px` |
| `--image-preview-close-icon-right`            | `14px` |
| `--image-preview-close-icon-size`             | `22px` |
| `--image-preview-close-icon-color`            | `#fff` |
| `--image-preview-extra-top`                   | `14px` |
| `--image-preview-extra-left`                  | `14px` |

