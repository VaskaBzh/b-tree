<template>
  <div class="visual">
    <tree-form @add="addValue" @remove="removeValue" @search="searchValue"/>
    <div ref="svgContainer">
      <svg width="1200" height="400"></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import BTree from "@/js/BTree";

export default {
  name: "TreeVisualizer",
  data() {
    return {
      btree: new BTree(2),
    };
  },
  methods: {
    btreeToHierarchy(node) {
      if (!node) {
        return null;
      }

      const children = node.children.map((child) => this.btreeToHierarchy(child));

      if (children.length === 0) {
        children.push(null);
      }

      return {
        keys: node.keys.filter((key) => key !== undefined),
        children: children.filter((child) => child !== null),
        checked: node.checked,
      };
    },
    drawTree() {
      // // Установка начальных и конечных значений анимации
      // const initialOpacity = 0;
      // const finalOpacity = 1;
      // const initialNodeScale = 0.1;
      // const finalNodeScale = 1;
      //
      // // Длительность анимации в миллисекундах
      // const animationDuration = 500;

      // Реализация визуализации B-дерева с помощью D3
      const svg = d3.select(this.$refs.svgContainer).select("svg");
      svg.selectAll("*").remove(); // Очистка SVG перед перерисовкой

      const width = parseInt(svg.attr("width"));
      const height = parseInt(svg.attr("height"));

      const treeLayout = d3.tree().size([width, height - 100]);
      const hierarchy = this.btreeToHierarchy(this.btree.root);
      const root = d3.hierarchy(hierarchy);
      const treeData = treeLayout(root);

      const g = svg.append("g");

      // Рисование связей между узлами
      g.selectAll(".link")
        .data(treeData.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
        )
        .attr("stroke", "black")
        .attr("fill", "none");
        // .attr("opacity", initialOpacity)
        // .transition()
        // .duration(animationDuration)
        // .delay(300)
        // .attr("opacity", finalOpacity);


      // Рисование узлов
      const node = g.selectAll(".node")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      const nodeRadius = 20;
      node.append("circle")
        .attr("r", nodeRadius)
        .attr("fill", "white")
        .attr("stroke", "black");
        // .attr("opacity", initialOpacity)
        // .attr("transform", `scale(${initialNodeScale})`)
        // .transition()
        // .duration(animationDuration)
        // .attr("opacity", finalOpacity)
        // .attr("transform", `scale(${finalNodeScale})`);

      node.append("text")
        .text((d) => d.data.keys.join(","))
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");
        // .attr("opacity", initialOpacity)
        // .transition()
        // .duration(animationDuration)
        // .attr("opacity", finalOpacity);
    },
    highlightCheckedNodes() {
      const svg = d3.select(this.$refs.svgContainer).select("svg");
      svg.selectAll(".node")
        .filter(d => d.data.checked)
        .classed("checked", true);
    },
    highlightFoundNode(searchIntValue) {
      return searchIntValue;
      // const svg = d3.select(this.$refs.svgContainer).select("svg");
      // svg.selectAll(".node")
      //   .filter(d => {
      //     setTimeout(() => {
      //       d.data.keys.includes(searchIntValue)
      //     }, 1000)
      //   })
      //   .classed("found", true);
    },
    addValue(value) {
      this.btree.insert(parseInt(value));
      this.drawTree();
    },
    removeValue(value) {
      this.btree.remove(value, () => {
        this.drawTree();
        this.highlightCheckedNodes();
      }, 500, true);
    },
    searchValue(value) {
      const searchIntValue = parseInt(value);
      this.btree.clearFound();
      this.drawTree();

      this.btree.searchAnimated(searchIntValue, () => {
        setTimeout(() => {
          this.drawTree();
          this.highlightCheckedNodes(); // Вызовите новый метод здесь
          this.highlightFoundNode(searchIntValue);
        }, 500); // Задержка 500 мс
      });
    }
  },
};
</script>

<style lang="scss">
.visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  .found {
    circle {
      fill: #b5b3b3;
      r: 50px;
    }
  }
  svg {
    padding: 60px 0;
    overflow: visible;
    circle {
      transition: all 0.3s ease 0s;
      r: 40px;
    }
  }
  .node.checked circle {
    stroke: green;
    stroke-width: 3px;
  }

  .node.found circle {
    stroke: red;
    stroke-width: 3px;
  }
}
</style>