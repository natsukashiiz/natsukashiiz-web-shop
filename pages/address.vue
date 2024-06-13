<script setup lang="ts">
import type {
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "~/types";
import {
  getAllAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "~/api/address";
import type { FormError, FormSubmitEvent } from "#ui/types";

const tost = useToast();

const addresses = ref<AddressResponse[]>([]);
const modalForm = ref(false);
const modalDelete = ref(false);
const formMode = ref<"add" | "edit">("add");
const currentId = ref<number | null>(null);

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
        currentId.value = row.id;
        modalDelete.value = true;
      },
      disabled: row.main,
    },
  ],
];

const loadData = async () => {
  const res = await getAllAddress();

  if (res.status === 200 && res.data) {
    addresses.value = res.data;
  }
};

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
  formMode.value = "add";
};

const handleSetMainAddress = async (address: AddressResponse) => {
  await handleEditAddress({
    ...address,
    main: true,
  });
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
    tost.add({
      id: "create-address",
      title: "เพิ่มที่อยู่สำเร็จ",
      description: "ที่อยู่ของคุณถูกเพิ่มสำเร็จ",
    });
  } else {
    window.alert("Error");
  }
};

const handleEditAddress = async (data: UpdateAddressRequest) => {
  const res = await updateAddress(data);
  if (res.status === 200 && res.data) {
    await loadData();
    modalForm.value = false;
    tost.add({
      id: "update-address",
      title: "แก้ไขที่อยู่สำเร็จ",
      description: "ที่อยู่ของคุณถูกแก้ไขสำเร็จ",
    });
  } else {
    window.alert("Error");
  }
};

const handleDeleteAddress = async () => {
  if (!currentId.value) return;

  const res = await deleteAddress(currentId.value);
  if (res.status === 200) {
    await loadData();
    tost.add({
      id: "delete-address",
      title: "ลบที่อยู่สำเร็จ",
      description: "ที่อยู่ของคุณถูกลบสำเร็จ",
    });
  } else {
    window.alert("Error");
  }
};

onActivated(() => {
  loadData();
});
</script>
<template>
  <div class="flex justify-center mt-10">
    <AModal
      :modal="modalDelete"
      title="ลบที่อยู่"
      description="คุณต้องการลบที่อยู่ใช่หรือไม่"
      @close="
        () => {
          modalDelete = false;
          currentId = null;
        }
      "
      @confirm="() => handleDeleteAddress()"
    />
    <AModal
      :modal="modalForm"
      :title="formMode === 'add' ? 'เพิ่มที่อยู่' : 'แก้ไขที่อยู่'"
      @close="
        () => {
          modalForm = false;
          resetForm();
        }
      "
      :footer="false"
    >
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
    </AModal>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">ที่อยู่</h1>
          <UButton color="white" variant="solid" @click="modalForm = true">
            เพิ่ม
          </UButton>
        </div>
      </template>

      <UTable :columns="columns" :rows="addresses" class="min-w-[700px]">
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
              @click="() => handleSetMainAddress(row)"
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
