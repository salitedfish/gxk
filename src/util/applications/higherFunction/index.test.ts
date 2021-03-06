import * as useHigherFunc from ".";

/**测试异步请求用的，延时200ms，随机返回0 ~ 4的整数 */
const genAsync = () => {
  const res = Math.floor(Math.random() * 5);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, 200);
  });
};

/**test usePromiseInsist */
test("test usePromiseInsist", async () => {
  try {
    const genTarget = await useHigherFunc.usePromiseInsist(genAsync)((res) => {
      return res === 3;
    })();
    expect(genTarget).toBe(3);
  } catch (err) {
    expect(err).toMatch("Exceeded times");
  }
});
