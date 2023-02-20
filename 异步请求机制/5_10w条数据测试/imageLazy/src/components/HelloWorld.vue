<template>
  <div id="container" @scroll="handleScroll" ref="container">
    <div class="coder" v-for="item in showList" :key="item.tid">
      <img :src="item.src" alt="" />
      <span>{{ item.text }}</span>
    </div>
    <div ref="blank"></div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
export default {
  setup() {
    const getList = () => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("get", "http://localhost:5000");

        xhr.send();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          }
        };
      });
    };

    const container = ref();
    const blank = ref();
    const list = ref([]); //列表
    const page = ref(1); //当前页数
    const limit = 200; //一页展示

    // 最大页数
    const maxPage = computed(() => Math.ceil(list.value.length / limit));
    // 真实展示的列表
    const showList = computed(() => list.value.slice(0, page.value * limit));

    const handleScroll = () => {
      // 当前页数与最大页数比较
      if (page.value > maxPage.value) return;
      const clientHeight = container.value?.clientHeight;
      const blankTop = blank.value?.getBoundingClientRect().top;
      // console.log(clientHeight)
      // console.log(blankTop)
      if (clientHeight>blankTop) {
        // blank出现在试图中
        page.value++;
      }
    };

    onMounted(async () => {
      const res = await getList();

      list.value = res;
    });
    return {
      container,
      blank,
      showList,
      handleScroll,
    };
  },
};
</script>

<style scoped>
#container {
  height: 100vh;
  overflow: auto;
}
.coder {
  display: flex;
  padding: 10px;
}

img {
  width: 150px;
  height: 150px;
}
</style>
