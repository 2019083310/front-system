
const add = () => {
  // 下一行eslint所有规则都失效（下一行不进行eslint检查）
  // eslint-disable-next-line
  console.log('hello');
};
export default add;
