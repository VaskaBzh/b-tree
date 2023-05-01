<template>
  <div class="tree-view">
    <div class="tree-node">
      <div class="tree-node-keys">
        <div v-for="(key, index) in node?.keys" :key="index" class="tree-key">
          {{ key }}
        </div>
      </div>
      <div class="tree-node-children">
        <tree-view v-for="(child, index) in node?.children" :key="index" :node="child" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeView",
  props: {
    node: Object,
  },
};
</script>

<style scoped lang="scss">
.tree-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.tree-node {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  &-keys,
  &-chiildren {
    display: flex;
  }
}

.tree-key {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid black;
}

.tree-empty {
  font-size: 1.2em;
  color: gray;
}
</style>