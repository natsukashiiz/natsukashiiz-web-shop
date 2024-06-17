<script setup lang="ts">
import {
  createProductFavorite,
  deleteProductFavorite,
  isProductFavorite,
} from "~/api/product";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const toast = useToast();

const favorite = ref<boolean | null>(null);
const isFavorite = ref(false);

const loadData = async () => {
  try {
    const res = await isProductFavorite(props.productId);
    if (res.status === 200) {
      isFavorite.value = res.data;

      if (favorite.value === null) {
        favorite.value = res.data;
      }
    }
  } catch (error) {
    alert("เกิดข้อผิดพลาด");
  }
};

const handleAddFavorite = async () => {
  try {
    await createProductFavorite(props.productId);
  } catch (error) {
    alert("เกิดข้อผิดพลาด");
  }
};

const handleRemoveFavorite = async () => {
  try {
    await deleteProductFavorite(props.productId);
  } catch (error) {
    alert("เกิดข้อผิดพลาด");
  }
};

const handleToggleFavorite = async () => {
  toast.clear();
  if (isFavorite.value) {
    toast.add({
      title: "เพิ่มสินค้าลงรายการโปรดแล้ว",
    });
  } else {
    toast.add({
      title: "ลบสินค้าออกจากรายการโปรดแล้ว",
    });
  }
  isFavorite.value = !isFavorite.value;
};

onMounted(() => {
  loadData();

  window.onbeforeunload = async () => {
    console.log("onbeforeunload");
    if (favorite.value !== null && isFavorite.value !== favorite.value) {
      if (isFavorite.value) {
        await handleAddFavorite();
      } else {
        await handleRemoveFavorite();
      }
    }
  };
});

onDeactivated(() => {
  if (favorite.value !== null && isFavorite.value !== favorite.value) {
    if (isFavorite.value) {
      handleAddFavorite();
    } else {
      handleRemoveFavorite();
    }
  }
  window.onbeforeunload = null;
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
