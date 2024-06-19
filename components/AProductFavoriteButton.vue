<script setup lang="ts">
import { favoriteProduct, isProductFavorite } from "~/api/product";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const toast = useToast();

const isFavorite = ref(false);

const loadData = async () => {
  try {
    const res = await isProductFavorite(props.productId);
    if (res.status === 200) {
      isFavorite.value = res.data;
    }
  } catch (error) {
    alert("เกิดข้อผิดพลาด");
  }
};

const handleToggleFavorite = async () => {
  toast.clear();
  try {
    const res = await favoriteProduct(props.productId);
    if (res.status === 200) {
      isFavorite.value = res.data;
      toast.add({
        title: isFavorite.value
          ? "เพิ่มไปยังรายการโปรดแล้ว"
          : "ลบออกจากรายการโปรดแล้ว",
      });
    }
  } catch (error) {
    alert("เกิดข้อผิดพลาด");
  }
};

onMounted(() => {
  loadData();
});

onActivated(() => {
  loadData();
});
</script>

<template>
  <UTooltip text="เพิ่มไปยังรายการโปรด">
    <UIcon
      :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
      class="text-gray-500 hover:text-red-500 cursor-pointer text-3xl"
      :class="{ 'text-red-500': isFavorite }"
      @click="handleToggleFavorite"
    />
  </UTooltip>
</template>
