<template>
  <div class="form">
    <input v-model="inputValue" type="text" placeholder="Введите значение" />
    <button @click="add">Добавить</button>
    <button @click="remove">Удалить</button>
    <button @click="search">Поиск</button>
  </div>
</template>

<script>
export default {
  name: "TreeForm",
  data() {
    return {
      inputValue: ""
    };
  },
  methods: {
    add() {
      if (this.inputValue !== "") {
        this.$emit("add", this.inputValue);
        this.inputValue = "";
      }
    },
    remove() {
      if (this.inputValue !== "") {
        this.$emit("remove", this.inputValue);
        this.inputValue = "";
      }
    },
    search() {
      if (this.inputValue !== "") {
        this.$emit("search", this.inputValue);
        this.inputValue = "";
      }
    }
  },
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
  input,
  button {
    outline: none;
    height: 40px;
    max-height: 40px;
    padding: 2px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    line-height: 20px;
    display: inline-flex;
    align-items: center;
    border: none;
  }
  input {
    max-width: 360px;;
    background-color: #ffffff;
    border: 1px solid #0858ab;
  }
  button {
    min-width: 160px;
    text-align: center;
    justify-content: center;
    background-color: #0858ab;
    color: #ffffff;
  }
}
</style>