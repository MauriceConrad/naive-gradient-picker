<template>
  <div class="n-angle-thumb" @mousedown="startDrag" @touchstart="startDrag" ref="angleThumbMainRef">
    <div class="n-angle-thumb__content" :style="{ transform: `rotate(${ angleDegree }deg)` }">
      <slot name="default" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .n-angle-thumb {
    cursor: grab;
    color: #fff;
    overflow: visible;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    user-select: none;
    .n-angle-thumb__content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      left: 0;
      top: 0;
      transform-origin: 50% 50%;
    }
  }
</style>

<script>
import { ref, watch, computed, reactive, watchEffect } from 'vue'
export default {
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 360
    },
    step: {
      type: Number,
      default: 1
    },
    grid: {
      type: Array,
      default: () => new Array
    },
    value: Number
  },
  emits: ['update:value'],
  setup(props, context) {
    const angleThumbMainRef = ref(null);
    const dragStartPos = ref(null);

    const angle = ref(0);
    watchEffect(() => {
      const range = props.max - props.min;
      angle.value = props.value / (range / 2) * Math.PI;
    });
    const angleDegree = computed(() => {
      const range = props.max - props.min;
      // Angle caluclated straight
      const theoAngle = props.min + (angle.value / Math.PI) * (range / 2) + (range / 2);
      
      // Map angle to the set of step' values (surjective)
      const mappedAngle = Math.round(theoAngle / props.step) * props.step;

      const gridTolerance = 10;

      const closestGridValue = props.grid.map(angle => ({
        angle,
        diff: Math.abs(angle - mappedAngle)
      })).filter(({ diff }) => diff <= gridTolerance).sort((a, b) => a.diff - b.diff)[0];

      const angleDegreRes = (closestGridValue ? closestGridValue.angle : mappedAngle) - (range / 2);

      return angleDegreRes + props.max * (angleDegreRes < 0);
    });
    watch(angleDegree, () => {
      if (props.value != angleDegree.value) {
        context.emit('update:value', angleDegree.value);
      }
    });
    
    const cancelDrag = () => dragStartPos.value = null;
    window.addEventListener('mouseup', cancelDrag);
    window.addEventListener('touchend', cancelDrag);

    const centerPos = reactive({ x: 0, y: 0 });


    function handleDrag(event) {
      if (dragStartPos.value) {
        const drag = {
          x: dragStartPos.value.x - event.clientX,
          y: dragStartPos.value.y - event.clientY
        }

        const mainBBox = angleThumbMainRef.value.getBoundingClientRect();
        centerPos.x = mainBBox.x + mainBBox.width / 2;
        centerPos.y = mainBBox.y + mainBBox.height / 2;

        const diff = {
          x: event.clientX - centerPos.x,
          y: event.clientY - centerPos.y
        }

        angle.value = Math.atan2(diff.x, -diff.y);

      }
    }
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('touchmove', handleDrag);

    return {
      angleThumbMainRef,
      angleDegree,
      startDrag(event) {
        dragStartPos.value = {
          x: event.type == 'touchstart' ? event.touches[0].clientX : event.clientX,
          y: event.type == 'touchstart' ? event.touches[0].clientY : event.clientY,
        }
        handleDrag(event);
      }
    }
  },
}
</script>