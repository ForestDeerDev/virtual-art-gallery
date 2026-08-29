<template>
  <div class="gallery-controls">
    <div class="control-panel">
      <h5>控制面板</h5>
      <div class="control-item">
        <label>移动速度</label>
        <el-slider
          :model-value="controls.moveSpeed"
          :min="0.1"
          :max="2"
          :step="0.1"
          @update:model-value="$emit('update:moveSpeed', $event)"
        />
        <span>{{ controls.moveSpeed }}</span>
      </div>
      <div class="control-item">
        <label>鼠标灵敏度</label>
        <el-slider
          :model-value="controls.mouseSensitivity"
          :min="0.1"
          :max="1"
          :step="0.1"
          @update:model-value="$emit('update:mouseSensitivity', $event)"
        />
        <span>{{ controls.mouseSensitivity }}</span>
      </div>
      <div class="control-item">
        <el-button type="primary" size="small" @click="$emit('reset')">
          <el-icon><RefreshLeft /></el-icon> 重置视角
        </el-button>
      </div>
      <div class="control-item">
        <el-button type="success" size="small" @click="$emit('toggle-rotate')">
          <el-icon><Refresh /></el-icon> {{ controls.autoRotate ? '停止旋转' : '自动旋转' }}
        </el-button>
      </div>
    </div>
    <div class="instructions">
      <h6>操作说明</h6>
      <p>
        <el-icon><Mouse /></el-icon> 鼠标移动：旋转视角
      </p>
      <p>
        <el-icon><Key /></el-icon> W/A/S/D：前后左右移动
      </p>
      <p>
        <el-icon><Top /></el-icon> 空格/Shift：上升/下降
      </p>
      <p>
        <el-icon><Pointer /></el-icon> 点击画框：查看详情
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GalleryControlState } from '@/types/gallery'

defineProps<{
  controls: GalleryControlState
}>()

defineEmits<{
  'update:moveSpeed': [value: number]
  'update:mouseSensitivity': [value: number]
  reset: []
  'toggle-rotate': []
}>()
</script>

<style scoped>
.gallery-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  color: white;
  max-width: 250px;
  z-index: 100;
}

.control-panel h5 {
  margin-bottom: 15px;
  color: #ffd700;
}

.control-item {
  margin-bottom: 15px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.control-item span {
  font-size: 12px;
  color: #aaa;
}

.control-item button {
  width: 100%;
  margin-top: 5px;
}

.instructions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #444;
}

.instructions h6 {
  margin-bottom: 10px;
  color: #ffd700;
}

.instructions p {
  margin: 8px 0;
  font-size: 13px;
  color: #ccc;
}

.instructions i {
  margin-right: 8px;
}
</style>
