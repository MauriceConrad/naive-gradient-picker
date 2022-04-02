<template>
  <div class="n-gradient-picker">
    <n-popover placement="bottom" trigger="click" :show-arrow="false" class="n-gradient-picker__popover">
      <template #trigger>
        <div class="n-gradient-picker-preview" :style="{ 'border-color': theme.borderColor, 'border-radius': theme.borderRadius, '--gradient-preview-size': gradientPreviewSize }">
          <div class="n-gradient-canvas" :style="{ 'background-image': value }">
            
          </div>
        </div>
      </template>
      <!--<header>
        <n-slider :value="Number(val.orientation.value)" @update:value="val.orientation.value = $event.toString()" :min="0" :max="360" :step="1" />
      </header>-->
      <main>
        <div class="gradient-preview" :style="{ 'background-image': value }">
          <n-angle-thumb v-if="orientation || orientation == 0" v-model:value="orientation" :min="0" :max="360" :step="1" :grid="[0, 90, 180, 270, 360]">
            <div class="gradient-angle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" style="stroke: #fff; stroke-width: 1px; fill: none; opacity: 0.8;" />
                <circle cx="50" cy="4" r="4" style="fill: #fff; stroke-width: 1px;" :style="{ }" />
              </svg>
            </div>
          </n-angle-thumb>
        </div>
        <n-radio-group v-model:value="gradientType" name="gradient-type-radios" class="gradient-type-radios">
          <n-radio value="linear-gradient">
            Linear
          </n-radio>
          <n-radio value="radial-gradient">
            Radial
          </n-radio>
        </n-radio-group>
        <n-slider v-model:value="stops" :marks="stopMarks" range :min="0" :max="100" :step="1" />
        <n-list>
          <n-list-item v-for="({ value }, i) in gradient.colorStops" :key="i" class="color-stop-item">
            <n-color-picker :value="ensureColor(value)" @update:value="updateColor(i, $event)" class="color-wrapper" />
            <div class="pos-wrapper">
              <n-input-number :value="stops[i]" @update:value="updatePos(i, $event)" />
            </div>
            <div class="actions-wrapper">
              <n-button tertiary circle type="error" @click="removeStop(i)" :disabled="stops.length <= 2">
                <template #icon>
                  <n-icon>
                    <trash-outline />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </n-list-item>
        </n-list>
      </main>
      <footer>
        <n-button type="default" @click="addStop">Add Stop</n-button>
      </footer>
    </n-popover>
  </div>
</template>

<style lang="scss" scoped>
  .n-gradient-picker {
    
    user-select: none;
    .n-gradient-picker-preview {
      border: 1px solid #000;
      cursor: pointer;
      .n-gradient-canvas {
        min-width: 32px;
        height: 100%;
      }
      height: 34px;
      box-sizing: border-box;
      padding: 3px;
    }
    
  }
  .n-gradient-picker__popover {
      main {
        padding: 5px 0;
        .gradient-type-radios {
          margin: 15px 0 0;
        }
        .gradient-preview {
          --gradient-preview-size: 400px;
          width: var(--gradient-preview-size);
          height: var(--gradient-preview-size);
          border-radius: 3px;
          .n-angle-thumb {
            padding: 20px;
            width: 100%;
            height: 100%;
            .gradient-angle {
              width: 100%;
              height: 100%;
              > svg {
                filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
              }
              .angle-thumb {
                --size: 20px;
                width: var(--size);
                height: var(--size);
                position: relative;
                top: 0;
                left: calc(50% - var(--size) / 2);
                border-radius: 50%;
                background-color: #fff;
                
              }
            }
          }
        }
        .color-stop-item {
          ::v-deep(.n-list-item__main) {
            display: grid;
            grid-template-columns: auto 90px max-content;
            grid-template-rows: 100%;
            grid-gap: 10px;
          }
          .color-wrapper {
            grid-column: 1 / span 1;
            grid-row: 1 / span 1;
          }
          .pos-wrapper {
            grid-column: 2 / span 1;
            grid-row: 1 / span 1;
            .n-input {
              
            }
          }
        }
      }
      header {
        .n-slider {
          margin: 5px 0 5px;
        }
      }
      footer {
        margin: 0px 0 0;
        padding: 0 0 5px 0;
        .n-button {
          width: 100%
        }
      }
    }
</style>

<script setup>
import _ from 'lodash'
import { parse, stringify } from 'gradient-parser'
import { ref, watch, computed, watchEffect } from 'vue'
import { useThemeVars, NPopover, NSlider, NList, NListItem, NColorPicker, NInputNumber, NIcon, NButton, NRadioGroup, NRadio } from 'naive-ui'
import NAngleThumb from './NAngleThumb.vue'
import { TrashOutline } from '@vicons/ionicons5'
import { orientationToAngle, ensureColor } from '../util/helpers.js'

const props = defineProps({
  value: String,
  size: [String, Number]
});
const emit = defineEmits(['update:value']);

const theme = useThemeVars();


const gradientPreviewSize = computed(() => {
  const literalsSizes = {
    'tiny': '200px',
    'small': '370px',
    'medium': '350px',
    'large': '40px'
  }
  if (props.size in literalsSizes) {
    return literalsSizes[props.size];
  }
  else if (props.size) {
    return props.size;
  }
});

const gradient = computed({
  get() {
    try {
      return parse(props.value)[0];
    }
    catch (err) {
      console.log(props.value);
      console.error(err);
      return parse(`linear-gradient(to right, red, blue)`)[0];
    }
  },
  set(newGradientObj) {
    try {
      emit('update:value', stringify(newGradientObj));
    }
    catch (err) {
      console.log(newGradientObj);
      console.error(err);
    }
  }
});

const gradientType = computed({
  get() {
    return gradient.value.type;
  },
  set(type) {
    gradient.value = {
      ...gradient.value,
      type,
      orientation: type === 'linear-gradient' ? { type: 'directional', value: 'right' } : undefined
    }
  }
});


const orientation = computed({
  get() {
    return gradient.value.orientation ? orientationToAngle(gradient.value.orientation) : undefined;
  },
  set(value) {
    gradient.value = {
      ...gradient.value,
      orientation: { type: 'angular', value }
    }
  }
});

console.log(parse(`linear-gradient(red 20%, blue 100%)`));

const stopMarks = computed(() => {
  return {
    0: '0%',
    50: '50%',
    100: '100%'
  }
});
const stops = computed({
  get() {
    return gradient.value.colorStops.map(({ length }, index) => {
      const pos = Number(length?.value ?? 100 / (gradient.value.colorStops.length - 1) * index);
      return pos;
    });
  },
  set(newStops) {
    newStops.sort((a, b) => a - b);
    gradient.value = {
      ...gradient.value,
      colorStops: gradient.value.colorStops.map(({ type, value }, index) => {
        return {
          type: 'rgba',
          value: ensureColor(value, type).slice(5, -1).split(', ').map(Number),
          length: { type: '%', value: newStops[index] }
        }
      })
    }
  }
});



const updateColor = (i, newValue) => {
  gradient.value = {
    ...gradient.value,
    colorStops: gradient.value.colorStops.map(({ type, value, length }, index) => {
      return {
        type: 'rgba',
        value: ensureColor(index === i ? newValue : value, type).slice(5, -1).split(', ').map(Number),
        length
      }
    })
  }
}


const updatePos = (i, newPos) => {
  stops.value = stops.value.map((pos, index) => index === i ? newPos : pos)
}

const addStop = () => {
  gradient.value = {
    ...gradient.value,
    colorStops: [
      ...gradient.value.colorStops,
      {
        ..._.cloneDeep(gradient.value.colorStops[gradient.value.colorStops.length - 1]),
        length: undefined
      }
    ]
  }
}
const removeStop = index => {
  gradient.value = {
    ...gradient.value,
    colorStops: gradient.value.colorStops.filter((_, i) => i !== index)
  }
}

/*

export default {
  components: {
    NPopover, NList, NListItem, NColorPicker, NInput, NIcon, NButton, NRadioGroup, NRadio,
    NAngleThumb,
    TrashOutline,
  },
  props: ['value'],
  emits: ['update:value'],
  setup(props, context) {
    const theme = useThemeVars();

    const val = ref(null);
    watchEffect(() => {
      try {
        val.value = gradient.parse(props.value)[0];
        let i = 0;
        for (const colorStop of val.value.colorStops) {
          if (!colorStop.length) {
            colorStop.length = {
              type: '%',
              value: (100 / (val.value.colorStops.length - 1)) * i
            }
          }
          i++;
        }
      }
      catch {
        val.value = gradient.parse(`linear-gradient(0deg, rgba(25, 25, 25, 1) 0%, rgba(255, 0, 0, 1) 100%)`)[0];
      }
    });

    watch(() => _.cloneDeep(val.value), () => {
      context.emit('update:value', gradient.stringify(val.value));
    });
    context.emit('update:value', gradient.stringify(val.value));

    return {
      theme,
      val,
      updateColor(i, value, length) {
        val.value.colorStops[i].value = value;
        val.value.colorStops[i].type = 'rgba';
        val.value.colorStops[i].length = length;
      },
      addStop() {
        const newStop = _.cloneDeep(val.value.colorStops[val.value.colorStops.length - 1]);
        newStop.length.value = '100';
        val.value.colorStops.push(newStop);

        let i = 0;
        for (const colorStop of val.value.colorStops) {
          colorStop.length.value = (100 / (val.value.colorStops.length - 1)) * i;
          i++;
        }


        console.log(val.value.colorStops);
      },
      removeStop(i) {
        val.value.colorStops = val.value.colorStops.filter((_, index) => index != i);
      },
      gradientContrastColor: computed(() => {
        return 'none';
      }),
      onUpdateType(type) {
        if (type == 'linear-gradient') {
          val.value.orientation = {
            value: '0',
            type: 'angular'
          };
        }
        if (type == 'radial-gradient') {
          val.value.orientation = undefined;
        }
        val.value.type = type;

      },
      ensureColor(value) {
        try {
          const [ , color ] = standarizeColor(value).match(/#(.*)/)
          return `rgba(${ [ ...colorConvert.hex.rgb.raw(color), 1].join(', ') })`;
        }
        catch {
          return value;
        }
      }
    }
  },
}*/
</script>