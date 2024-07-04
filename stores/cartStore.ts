import { getCountCart } from "~/api/cart";

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

  const loadCountCart = async () => {
    try {
      const res = await getCountCart();
      if (res.status === 200) {
        count.value = res.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    count,
    setCount,
    increment,
    decrement,
    loadCountCart,
  };
});
