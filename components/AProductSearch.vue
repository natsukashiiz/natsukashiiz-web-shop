<script setup lang="ts">
const keyword = ref<string>("");
const router = useRouter();

const search = () => {
  console.log(keyword.value);
  if (keyword.value) {
    router.push({ name: "products-search", query: { name: keyword.value } });
  }
};
</script>
<template>
  <UInput
    v-model="keyword"
    name="keyword"
    placeholder="ค้นหาสินค้าที่คุณต้องการ..."
    icon="i-heroicons-magnifying-glass-20-solid"
    autocomplete="off"
    :ui="{ icon: { trailing: { pointer: '' } } }"
    @keyup.enter="search"
    class="w-full"
  >
    <template #trailing>
      <UButton
        v-show="keyword.length > 0"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="keyword = ''"
      />
    </template>
  </UInput>
</template>
