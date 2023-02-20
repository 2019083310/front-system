function foo(x) {
  delete x
  // 不能删
  console.log(x)
}

foo(1)