<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ state: ("X" | "O" | null)[] }>();
const emit = defineEmits(["cell-click"]);
</script>

<template>
  <table class="board">
    <tbody>
      <tr v-for="(row, rowIndex) in [0, 1, 2]" :key="rowIndex">
        <td
          v-for="(col, colIndex) in [0, 1, 2]"
          :key="colIndex"
          @click="emit('cell-click', row * 3 + col);"
        >
          {{ props.state[row * 3 + col] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.board {
  border-collapse: collapse;
  width: 150px;
  height: 150px;
}
td {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  border: 2px solid black;
  cursor: pointer;
}
</style>