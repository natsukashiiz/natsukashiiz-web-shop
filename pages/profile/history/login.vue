<script setup lang="ts">
import type { LoginHistoryResponse } from "~/types";
import { getLoginHistory } from "~/api/profile";

const loading = useLoading();
const hitoires = ref<LoginHistoryResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

const columns = [
  {
    key: "createdAt",
    label: "เวลา",
    format: (value: string) => new Date(value).toLocaleString(),
  },
  {
    key: "ip",
    label: "ไอพี",
  },
  {
    key: "device",
    label: "อุปกรณ์",
  },
  {
    key: "os",
    label: "ระบบปฏิบัติการ",
  },
  {
    key: "userAgent",
    label: "User Agent",
  },
];

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getLoginHistory({
      page: pagination.page,
      size: pagination.limit,
      sort: "createdAt,desc",
    });

    if (res.status === 200 && res.data) {
      hitoires.value = res.data.list;
      pagination.total = res.data.total;
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error) {
    console.error(error);
    window.alert("เกิดข้อผิดพลาด");
  }
  loading.value = false;
};

const changePage = async () => {
  await loadData();
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <UContainer class="max-w-5xl py-5">
    <UCard class="py-2">
      <template #header>
        <span class="text-lg font-semibold text-gray-900">
          ประวัติการเข้าสู่ระบบ
        </span>
      </template>
      <UTable
        :columns="columns"
        :rows="hitoires"
        :loading="loading"
        class="w-full"
      />
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200">
        <UPagination
          v-model="pagination.page"
          :page-count="pagination.limit"
          :total="pagination.total"
          @click="changePage"
          :active-button="{ variant: 'outline' }"
          :inactive-button="{ color: 'gray' }"
        />
      </div>
    </UCard>
  </UContainer>
</template>
