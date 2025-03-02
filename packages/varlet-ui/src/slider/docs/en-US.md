# Slider

### Intro

Used to take values within a given range.

### Basic Usage

```html
<script setup>
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <var-slider v-model="value" />
</template>
```

### Step size

Set step increment by `step`.

```html
<script setup>
import { ref } from 'vue'

const value = ref(25)
</script>

<template>
  <var-slider v-model="value" step="10" />
</template>
```

### Dual thumb

Open the double slider mode through the `range` attribute. Make sure the `value` is an **array**.

```html
<script setup>
import { ref } from 'vue'

const value = ref([24, 50])

function handleChange(value) {
  console.log(value)
}
</script>

<template>
  <var-slider v-model="value" range @change="handleChange" />
</template>
```

### Range

```html
<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <var-slider v-model="value" max="210" min="-50" label-visible="always" />
</template>
```

### Disable

```html
<script setup>
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <var-slider v-model="value" disabled />
</template>
```

### Readonly

```html
<script setup>
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <var-slider v-model="value" readonly />
</template>
```

### Slider size

Control the size of slider through `track-height` and `thumb-size`.

```html
<script setup>
import { ref } from 'vue'

const value = ref([7, 64])
</script>

<template>
  <var-slider v-model="value" track-height="4" thumb-size="8" range />
</template>
```

### Custom style

```html
<script setup>
import { ref } from 'vue'

const value = ref(20)
</script>

<template>
  <var-slider
    v-model="value"
    label-color="purple"
    active-color="#e0732c"
    track-color="#3a68b4"
    thumb-color="#e25241"
    label-text-color="#ededed"
  />
</template>
```

### Custom Button

The props such as `label-visible`, `label-text-color`, `thumb-size` are invalid when using slot custom buttons.

```html
<script setup>
import { ref } from 'vue'

const value = ref([5, 38])
</script>

<template>
  <var-slider v-model="value" range active-color="#52af77">
    <template #button="{ currentValue }">
      <div class="slider-example__block">{{ currentValue }}</div>
    </template>
  </var-slider>
</template>

<style>
.slider-example__block {
  width: 24px;
  border: 1px solid #52af77;
  color: #52af77;
  height: 24px;
  margin: 0 -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: #ebebeb 0 2px 2px;
  border-radius: 50%;
  font-size: 12px;
  background-color: #fff;
}
</style>
```

### Show label
Control the display of labels through the `label-visible` attribute.

```html
<script setup>
import { ref } from 'vue'

const value = ref(20)
const value1 = ref(70)
const value2 = ref(50)
</script>

<template>
  <var-slider v-model="value" label-visible="never" />
  <var-slider v-model="value1" />
  <var-slider v-model="value2" label-visible="always" />
</template>
```

### Validate value

Verify the value through the `rules` attribute.

<span style="font-size: 12px">`rules` is an array that accepts `functions`, `boolean`, and `string`. Functions pass an input value as an argument and must return either `true` / `false` or a `string` containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) `false` or is a `string`.</span>

```html
<script setup>
import { ref } from 'vue'

const value = ref(20)
</script>

<template>
  <var-slider v-model="value" :rules="[(v) => v > 35 || 'error message']" />
</template>
```

### Vertical

Set the `direction` attribute value to `vertical` to make the slider display vertically.

```html
<script setup>
import { ref } from 'vue'

const value1 = ref(50)
const value2 = ref([7, 64])
</script>

<template>
  <var-space justify="space-around">
    <div style="height: 300px">
      <var-slider v-model="value1" direction="vertical" />
    </div>
    <div style="height: 300px">
      <var-slider v-model="value2" range label-visible="always" direction="vertical" />
    </div>
  </var-space>
</template>
```

## API

### Props

| Prop | Description                                                              | Type | Default |
| ----- |--------------------------------------------------------------------------| -------- | ---------- |
| `v-model` | The value of slider                                                      | _number \| [number, number]_ | `0` |
| `step`| Step size. The value must greater than 0                                 | _string \| number_ | `1` |
| `range`| Whether open the dual thumb mode                                         | _boolean_ | `false` |
| `max` | The maximum value the slider can slide to                                | _string \| number_ | `100`           |
| `min` | The minimum value the slider can slide to                                | _string \| number_ | `0`           |
| `label-visible` | Whether to display labels, the optional value is `always, normal, never` | _string_ | `normal` |
| `label-text-color` | Color of label text                                                      | _string_ | `#fff` |
| `label-color`  | Background color of label                                                | _string_ | `-`               |
| `active-color` | Background color of actived track                                        | _string_ | `-`               |
| `track-color`  | Background color of track                                                | _string_ | `-`               |
| `track-height` | Height of track                                                          | _string \| number_ | `2` |
| `thumb-size` | Size of thumb                                                            | _string \| number_ | `12` |
| `thumb-color`   | Background color of thumb                                                | _string_ | `-`               |
| `disabled`| Whether to disable slider                                                | _boolean_  | `false` |
| `readonly`| Whether to readonly slider                                               | _boolean_  | `false` |
| `direction` | Direction of slider, Can be set to `vertical horizontal`                           | _string_ | `horizontal` |
| `rules`| Validation rules                                                         | _array_  | `-` |

### Events

| Event | Description | arguments |
| ----- | -------- | -------- |
| `change` |  Emitted after slider changed | value: current value |
| `start` | Emitted when start dragged | `-` |
| `end` | Emitted when end dragged | value: current value |

### Slots

| Name | Description | SlotProps |
| ----- | -------------- | -------- |
| `button` | Custom button | `currentValue`: current value |

### Style Variables

Here are the CSS variables used by the component, Styles can be customized using [StyleProvider](#/en-US/style-provider).

| Variable | Default |
| --- | --- |
| `--slider-error-color` | `var(--color-danger)` |
| `--slider-track-background` | `#bdbdbd` |
| `--slider-track-fill-background` | `var(--color-primary)` |
| `--slider-thumb-block-background` | `var(--color-primary)` |
| `--slider-thumb-ripple-background` | `var(--color-primary)` |
| `--slider-thumb-label-background` | `var(--color-primary)` |
| `--slider-thumb-label-font-size` | `var(--font-size-sm)` |
| `--slider-disabled-opacity` | `var(--opacity-disabled)` |
