export const useCartStore = defineStore("cart", () => {
  const count = ref<number>(0);

  const setCount = (value: number) => {
    count.value = value;
  };

  const increment = (value: number = 1) => {
    count.value += value;
  };

  const decrement = (value: number = 1) => {
    count.value -= value;
  };

  return {
    count,
    setCount,
    increment,
    decrement,
  };
});
