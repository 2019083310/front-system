<template>
  <div class="v-scroll" @scroll.passive="doScroll" ref="scrollBox">
    <div :style="blankStyle" style="height: 100%">
      <div v-for="item in tempSanxins" :key="item.id" class="scroll-item">
        <span>{{ item.msg }}</span>
        <img :src="item.src" />
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from "../../utils/tools";
export default {
  data() {
    return {
      allSanxins: [], // 所有数据
      itemHiehgt: 150, // 列表每一项的宽度
      boxHeight: 0, // 可视区域的高度
      startIndex: 0, // 元素开始索引
    };
  },
  created() {
    // 模拟请求数据
    this.getAllSanxin(30);
  },
  mounted() {
    // 在mounted时获取可视区域的高度
    this.getScrollBoxHeight();
    // 监听屏幕变化以及旋转，都要重新获取可视区域的高度
    window.onresize = this.getScrollBoxHeight;
    window.onorientationchange = this.getScrollBoxHeight;
  },
  methods: {
    getAllSanxin(count) {
      // 模拟获取数据
      const length = this.allSanxins.length;
      for (let i = 0; i < count; i++) {
        this.allSanxins.push({
          id: `sanxin${length + i}`,
          msg: `我是三心${length + i}号`,
          // 这里随便选一张图片就行
          src: require("../../src/asset/images/sanxin.jpg").default,
        });
      }
    },
    // 使用节流，提高性能
    doScroll: throttle(function () {
      // 监听可视区域的滚动事件
      // 公式：~~(滚动的距离 / 列表项 )，就能算出已经滚过了多少个列表项，也就能知道现在的startIndex是多少
      // 例如我滚动条滚过了160px，那么index就是1，因为此时第一个列表项已经被滚上去了，可视区域里的第一项的索引是1
      const index = ~~(this.$refs.scrollBox.scrollTop / this.itemHiehgt);
      if (index === this.startIndex) return;
      this.startIndex = index;
      if (this.startIndex + this.itemNum > this.allSanxins.length - 1) {
        this.getAllSanxin(30);
      }
    }, 200),
    getScrollBoxHeight() {
      // 获取可视区域的高度
      this.boxHeight = this.$refs.scrollBox.clientHeight;
    },
  },
  computed: {
    itemNum() {
      // 可视区域可展示多少个列表项？ 计算公式：~~(可视化区域高度 / 列表项高度) + 2
      // ~~是向下取整的运算符，等同于Math.floor()，为什么要 +2 ，是因为可能最上面和最下面的元素都只展示一部分
      return ~~(this.boxHeight / this.itemHiehgt) + 2;
    },
    endIndex() {
      // endIndex的计算公式：(开始索引 + 可视区域可展示多少个列表项 * 2)
      // 比如可视区域可展示8个列表项，startIndex是0的话endIndex就是0 + 8 * 2 = 16，startIndex是1的话endIndex就是1 + 8 * 2 = 17，以此类推
      // 为什么要乘2呢，因为这样的话可以预加载出一页的数据，防止滚动过快，出现暂时白屏现象
      let index = this.startIndex + this.itemNum * 2;
      if (!this.allSanxins[index]) {
        // 到底的情况，比如startIndex是99995，那么endIndex本应该是99995 + 8 * 2 = 10011
        // 但是列表数据总数只有10000条，此时就需要让endIndex = (列表数据长度 - 1)
        index = this.allSanxins.length - 1;
      }
      return index;
    },
    tempSanxins() {
      //   可视区域展示的截取数据，使用了数组的slice方法，不改变原数组又能截取
      let startIndex = 0;
      if (this.startIndex <= this.itemNum) {
        startIndex = 0;
      } else {
        startIndex = this.startIndex + this.itemNum;
      }
      return this.allSanxins.slice(startIndex, this.endIndex + 1);
    },
    blankStyle() {
      // 上下方的空白处使用padding来充当
      let startIndex = 0;
      if (this.startIndex <= this.itemNum) {
        startIndex = 0;
      } else {
        startIndex = this.startIndex - this.itemNum;
      }
      return {
        // 上方空白的高度计算公式：(开始index * 列表项高度)
        // 比如你滚过了3个列表项，那么上方空白区高度就是3 * 150 = 450，这样才能假装10000个数据的滚动状态
        paddingTop: startIndex * this.itemHiehgt + "px",
        // 下方空白的高度计算公式：(总数据的个数 - 结束index - 1) * 列表项高度
        // 例如现在结束index是100，那么下方空白高度就是：(10000 - 100 - 1) * 150 = 1,484,850
        paddingBottom:
          (this.allSanxins.length - this.endIndex - 1) * this.itemHiehgt + "px",
        // 不要忘了加px哦
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.v-scroll {
  height: 100%;
  /* padding-bottom: 500px; */
  overflow: auto;

  .scroll-item {
    height: 148px;
    /* width: 100%; */
    border: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    img {
      height: 100%;
    }
  }
}
</style>
