<template>
  <div class="tree-node" v-if="node?.value">
    <div class="value">{{ node.value }}</div>
    <svg v-if="node.left || node.right" class="arrows" viewBox="0 0 100 50">
      <path v-if="node.left" d="M50,0 L0,50" stroke="black" fill="transparent" />
      <path v-if="node.right" d="M50,0 L100,50" stroke="black" fill="transparent" />
    </svg>
    <div class="children">
      <tree-node :class="{ left: !node.right }" v-if="node.left" :node="node.left" />
      <tree-node v-if="node.right" :node="node.right" />
    </div>
  </div>
  <h1 v-else>Дерево пустое</h1>
</template>

<script>

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
}
</script>

<style lang="scss">
.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  min-width: 148px;
}

.left {
  .value {
    margin-right: auto;
  }
}

.arrows {
  width: 100%;
  height: 50px;
}

.value {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 50px;
  border: 1px solid black;
  letter-spacing: 6px;
  padding: 6px;
  text-align: center;
}

.children {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}
</style>