<script setup lang="ts">
import type {
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "~/types";
import {
  getAllAddress,
  setMainAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "~/api/address";
import type { FormError, FormSubmitEvent } from "#ui/types";

definePageMeta({
  layout: "auth",
});

const addresses = ref<AddressResponse[]>([]);
const modalForm = ref(false);
const formMode = ref<"add" | "edit">("add");

const columns = [
  {
    key: "main",
    label: "ที่อยู่หลัก",
  },
  {
    key: "name",
    label: "ชื่อ",
  },
  {
    key: "address",
    label: "ที่อยู่",
  },
  {
    key: "mobile",
    label: "เบอร์โทร",
  },
  {
    key: "actions",
  },
];

const items = (row: AddressResponse) => [
  [
    {
      label: "แก้ไข",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        currentId.value = row.id;
        formState.firstName = row.firstName;
        formState.lastName = row.lastName;
        formState.mobile = row.mobile;
        formState.address = row.address;

        formMode.value = "edit";
        modalForm.value = true;
      },
    },
    {
      label: "ลบ",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        if (window.confirm("คุณต้องการลบใช่หรือไม่")) {
          handleDeleteAddress(row.id);
        }
      },
    },
  ],
];

const loadData = async () => {
  const res = await getAllAddress();

  if (res.status === 200 && res.data) {
    addresses.value = res.data;
  }
};

const handleSetMainAddress = async (addressId: number) => {
  const res = await setMainAddress(addressId);
  if (res.status === 200 && res.data) {
    await loadData();
  } else {
    window.alert("Error");
  }
};

const currentId = ref<number | null>(null);
const formState = reactive<CreateAddressRequest>({
  firstName: "",
  lastName: "",
  mobile: "",
  address: "",
});

const validate = (state: CreateAddressRequest): FormError[] => {
  const errors = [];
  if (!state.firstName) {
    errors.push({
      path: "firstName",
      message: "กรุณากรอกชื่อ",
    });
  }
  if (!state.lastName) {
    errors.push({
      path: "lastName",
      message: "กรุณากรอกนามสกุล",
    });
  }
  if (!state.mobile) {
    errors.push({
      path: "mobile",
      message: "กรุณากรอกเบอร์โทร",
    });
  }
  if (!state.address) {
    errors.push({
      path: "address",
      message: "กรุณากรอกที่อยู่",
    });
  }
  return errors;
};

const resetForm = () => {
  formState.firstName = "";
  formState.lastName = "";
  formState.mobile = "";
  formState.address = "";
};

const handleSubmitForm = async (event: FormSubmitEvent<any>) => {
  if (formMode.value === "add") {
    await handleAddAddress(event.data);
  } else {
    await handleEditAddress({
      ...event.data,
      id: currentId.value,
    });
  }
};

const handleAddAddress = async (data: CreateAddressRequest) => {
  const res = await createAddress(data);
  if (res.status === 200 && res.data) {
    await loadData();
    modalForm.value = false;
  } else {
    window.alert("Error");
  }
};

const handleEditAddress = async (data: UpdateAddressRequest) => {
  const res = await updateAddress(data);
  if (res.status === 200 && res.data) {
    await loadData();
    modalForm.value = false;
  } else {
    window.alert("Error");
  }
};

const handleDeleteAddress = async (addressId: number) => {
  const res = await deleteAddress(addressId);
  if (res.status === 200) {
    await loadData();
  } else {
    window.alert("Error");
  }
};

onMounted(async () => {
  await loadData();
});
</script>
<template>
  <div class="flex justify-center mt-10">
    <UModal v-model="modalForm" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ formMode === "add" ? "เพิ่มที่อยู่" : "แก้ไขที่อยู่" }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="
                () => {
                  resetForm();
                  modalForm = false;
                }
              "
            />
          </div>
        </template>

        <UForm
          :validate="validate"
          :state="formState"
          class="space-y-4"
          @submit="handleSubmitForm"
        >
          <UFormGroup label="ชื่อ" name="firstName">
            <UInput v-model="formState.firstName" />
          </UFormGroup>

          <UFormGroup label="นามสกุล" name="lastName">
            <UInput v-model="formState.lastName" />
          </UFormGroup>

          <UFormGroup label="เบอร์โทร" name="mobile">
            <UInput v-model="formState.mobile" />
          </UFormGroup>

          <UFormGroup label="ที่อยู่" name="address">
            <UTextarea v-model="formState.address" />
          </UFormGroup>

          <div class="flex justify-end">
            <div></div>
            <UButton type="submit"> บันทึก </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">ที่อยู่</h1>
          <UButton color="primary" @click="modalForm = true"> เพิ่ม </UButton>
        </div>
      </template>

      <UTable :columns="columns" :rows="addresses" class="max-w-full">
        <template #main-data="{ row }">
          <UButton
            color="pink"
            variant="ghost"
            icon="i-heroicons-home-20-solid"
            disabled
            v-if="row.main"
          />
          <UTooltip text="คลิกเพื่อตั้งเป็นที่อยู่หลัก" v-else>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-home-20-solid"
              @click="() => handleSetMainAddress(row.id)"
            />
          </UTooltip>
        </template>
        <template #name-data="{ row }">
          <span>{{ row.firstName }} {{ row.lastName }}</span>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
