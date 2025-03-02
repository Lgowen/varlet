# 弹出层

### 介绍

创建一个可以从上、下、左、右、中心弹出的容器，用于展示信息。默认使用 `teleport` 插入到 `body` 尾部。


### 弹出位置

```html
<script setup>
import { ref } from 'vue'
  
const center = ref(false)
const top = ref(false)
const bottom = ref(false)
const left = ref(false) 
const right = ref(false)
</script>

<template>
  <var-space direction="column" :size="[10, 0]">
    <var-button type="primary" block @click="center = true">
      居中弹出
    </var-button>
    <var-button type="primary" block @click="bottom = true">
      下方弹出
    </var-button>
    <var-button type="primary" block @click="top = true">
      上方弹出
    </var-button>
    <var-button type="primary" block @click="left = true">
      左侧弹出
    </var-button>
    <var-button type="primary" block @click="right = true">
      右侧弹出
    </var-button>
  </var-space>
  
  <var-popup v-model:show="center">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
  
  <var-popup position="bottom" v-model:show="bottom">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
  
  <var-popup position="top" v-model:show="top">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
  
  <var-popup position="left" v-model:show="left">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
  
  <var-popup position="right" v-model:show="right">
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
</template>

<style>
.popup-example-block {
  padding: 20px 24px;
  width: 250px;
}
</style>
```

### 遮罩层样式

```html
<script setup>
import { ref } from 'vue'
  
const overlayClass = ref(false)
const overlayStyle = ref(false)
</script>

<template>
  <var-space direction="column" :size="[10, 0]">
    <var-button type="primary" block @click="overlayClass = true">
      遮罩层 class
    </var-button>
    <var-button type="primary" block @click="overlayStyle = true">
      遮罩层 style
    </var-button>
  </var-space>
  
  <var-popup
    overlay-class="popup-example-custom-overlay"
    v-model:show="overlayClass"
  >
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
  
  <var-popup
    :overlay-style="{backgroundColor: 'rgba(0, 0, 0, 0.3)'}"
    v-model:show="overlayStyle"
  >
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
</template>

<style>
.popup-example-custom-overlay {
  background: rgba(0, 0, 0, 0.3) !important;
}

.popup-example-block {
  padding: 20px 24px;
  width: 250px;
}
</style>
```

### 注册事件

```html
<script setup>
import { ref } from 'vue'
import { Snackbar } from '@varlet/ui'

const event = ref(false)
</script>

<template>
  <var-button type="primary" block @click="event = true">
    注册事件
  </var-button>

  <var-popup
    v-model:show="event"
    @open="Snackbar.info('open')"
    @opened="Snackbar.success('opened')"
    @close="Snackbar.warning('close')"
    @closed="Snackbar.error('closed')"
  >
    <div class="popup-example-block">
      素胚勾勒出青花笔锋浓转淡,
      瓶身描绘的牡丹一如你初妆,
      冉冉檀香透过窗心事我了然,
      宣纸上走笔至此搁一半。
    </div>
  </var-popup>
</template>

<style>
.popup-example-block {
  padding: 20px 24px;
  width: 250px;
}
</style>
```

## API

### 属性

| 参数                       | 说明                                               | 类型                    | 默认值      |
|--------------------------|--------------------------------------------------|-----------------------|----------|
| `v-model:show`           | 是否显示弹出层                                          | _boolean_             | `false`  |
| `position`               | 弹出位置，可选值为 `top` `bottom` `right` `left` `center` | _string_              | `center` |
| `overlay`                | 是否显示遮罩层                                          | _boolean_             | `true`   |
| `overlay-class`          | 自定义遮罩层的 class                                    | _string_              | `-`      |
| `overlay-style`          | 自定义遮罩层的 style                                    | _object_              | `-`      |
| `default-style`          | 是否启用默认样式                                         | _boolean_             | `true`   |
| `transition`             | 过度动画的名称                                          | _string_              | `-`      |
| `lock-scroll`            | 是否禁止滚动穿透，禁止时滚动弹出层不会引发 body 的滚动                   | _boolean_             | `true`   |
| `close-on-click-overlay` | 是否点击遮罩层关闭弹出层                                     | _boolean_             | `true`   |
| `teleport`               | 弹出层挂载的位置                                         | _TeleportProps['to']_ | `body`      |
| `safe-area`              | 是否开启底部安全区适配	                                     | _boolean_             | `false`  |
| `safe-area-top`          | 是否开启顶部安全区适配	                                     | _boolean_             | `false`  |

### 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `open` | 打开弹出层时触发 | `-` |
| `opened` | 打开弹出层动画结束时触发 | `-` |
| `close` | 关闭弹出层时触发 | `-` |
| `closed` | 关闭弹出层动画结束时触发 | `-` |
| `click-overlay` | 点击遮罩层时触发 | `-` |

### 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `default` | 弹出层内容 | `-` |

### 样式变量
以下为组件使用的 css 变量，可以使用 [StyleProvider 组件](#/zh-CN/style-provider) 进行样式定制。

| 变量名 | 默认值 |
| --- | --- |
| `--popup-overlay-background-color` | `rgba(0, 0, 0, .6)` |
| `--popup-content-background-color` | `#fff` |
