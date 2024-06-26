<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import type { ChagePasswordRequest } from "~/types";
import { changePassword } from "~/api/profile";

const toast = useToast();
const loading = useLoading();

type Form = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const form = reactive<Form>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const clearForm = () => {
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
};

const handleChangePassword = async (data: ChagePasswordRequest) => {
  toast.clear();
  try {
    const res = await changePassword(data);
    if (res.status === 200) {
      clearForm();
      toast.add({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        timeout: 5000,
      });
    }
  } catch (error: any) {
    const err = error.response.data.error;
    if (err === "account.current.password.invalid") {
      toast.add({
        title: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
        timeout: 5000,
        color: "red",
      });
    } else {
      toast.add({
        title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
        timeout: 5000,
        color: "red",
      });
    }
  }
};

const validateForm = (state: Form): FormError[] => {
  const errors = [];
  if (!state.currentPassword) {
    errors.push({
      path: "currentPassword",
      message: "กรุณากรอกรหัสผ่านปัจจุบัน",
    });
  }
  if (!state.newPassword) {
    errors.push({ path: "newPassword", message: "กรุณากรอกรหัสผ่านใหม่" });
  }
  if (!state.confirmPassword) {
    errors.push({
      path: "confirmPassword",
      message: "กรุณายืนยันรหัสผ่านใหม่",
    });
  }
  if (state.newPassword !== state.confirmPassword) {
    errors.push({
      path: "confirmPassword",
      message: "รหัสผ่านใหม่ไม่ตรงกัน",
    });
  }
  return errors;
};

async function onSubmit(event: FormSubmitEvent<Form>) {
  await handleChangePassword({
    current: event.data.currentPassword,
    latest: event.data.newPassword,
  });
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const disabledChagePassword = computed(() => {
  return validateForm(form).length > 0;
});
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-lg font-semibold text-gray-900"> เปลี่ยนรหัสผ่าน </span>
    </template>

    <template #default>
      <UForm
        :validate="validateForm"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormGroup label="รหัสผ่านปัจจุบัน" name="currentPassword">
          <UInput
            icon="i-heroicons-lock-closed"
            type="password"
            v-model="form.currentPassword"
          />
        </UFormGroup>
        <UFormGroup label="รหัสผ่านใหม่" name="newPassword">
          <UInput
            icon="i-heroicons-lock-closed"
            type="password"
            v-model="form.newPassword"
          />
        </UFormGroup>
        <UFormGroup label="ยืนยันรหัสผ่านใหม่" name="confirmPassword">
          <UInput
            icon="i-heroicons-lock-closed"
            type="password"
            v-model="form.confirmPassword"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="white"
          block
          :disabled="disabledChagePassword"
        >
          เปลี่ยนรหัสผ่าน
        </UButton>
      </UForm>
    </template>
  </UCard>
</template>
