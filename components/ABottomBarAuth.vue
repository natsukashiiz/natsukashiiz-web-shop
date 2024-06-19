<script setup lang="ts"></script>

<template>
  <div class="fixed bottom-0 w-full z-30">
    <div
      class="flex justify-center items-center bg-slate-50 py-2 px-5 h-16 border-slate-200 gap-4"
    >
      <UButton
        icon="i-heroicons-home"
        color="gray"
        size="xl"
        :to="{ name: 'index' }"
      />
      <UButton
        icon="i-heroicons-ticket"
        color="gray"
        size="xl"
        :to="{ name: 'vouchers' }"
      />
      <UChip>
        <UButton
          icon="i-heroicons-shopping-cart"
          color="gray"
          size="xl"
          :to="{ name: 'cart' }"
        />
      </UChip>
      <UButton
        icon="i-heroicons-user"
        color="gray"
        size="xl"
        :to="{ name: 'profile' }"
      />
    </div>
  </div>
</template>
