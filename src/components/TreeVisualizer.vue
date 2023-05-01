<template>
  <div class="visual">
    <tree-form @add="addValue" @remove="removeValue" @search="searchValue"/>
    <div class="visual_block">
      <tree-node :node="tree"/>
    </div>
  </div>
</template>

<script>

export default {
  name: "TreeVisualizer",
  data() {
    return {
      btree: [],
    };
  },
  methods: {
    addValue(value) {
      this.btree.push(value);
    },
    removeValue(value) {
      console.log(value);
    },
    searchValue(value) {
      console.log(value);
    },
  },
  computed: {
    tree() {
      const data = this.btree;
      const buildTree = (values) => {
        if (!values.length) {
          return null;
        }

        const mid = Math.floor(values.length / 2);
        const node = {
          value: values[mid],
          left: buildTree(values.slice(0, mid)),
          right: buildTree(values.slice(mid + 1)),
        };

        return node;
      };

      return buildTree(data);
    },
  }
}
</script>

<style lang="scss">
.visual {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>