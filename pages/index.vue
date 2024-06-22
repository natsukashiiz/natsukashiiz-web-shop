<script setup lang="ts">
// const scroll = () => {
//   window.onscroll = async () => {
//     let bottomOfWindow =
//       Math.round(
//         Math.max(
//           window.scrollY,
//           document.documentElement.scrollTop,
//           document.body.scrollTop
//         ) + window.innerHeight
//       ) === document.documentElement.offsetHeight;

//     if (bottomOfWindow) {
//       if (products.value.length < pagination.total) {
//         pagination.page++;
//         await loadData();
//       }
//     }
//   };
// };
</script>
<template>
  <Head>
    <title>หน้าหลัก</title>
  </Head>
  <UContainer class="flex flex-col gap-y-2 p-5">
    <div class="max-w-3xl mx-auto mb-5">
      <!-- carousel -->
      <ACarousel />
    </div>
    <div class="mb-5 md:hidden">
      <a-product-search type="input" />
    </div>
    <!-- category -->
    <div class="mb-5">
      <UDivider
        label="หมวดหมู่"
        class="pb-4"
        size="xs"
        :ui="{ label: 'text-xl' }"
      />

      <ACategoryList />
    </div>
    <UDivider
      label="สินค้าแนะนำ"
      class="mb-4"
      size="xs"
      :ui="{ label: 'text-xl' }"
    />
    <AProductList />
  </UContainer>
</template>
