<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { CreateProductReviewRequest } from "~/types";
import { createProductReview } from "~/api/product";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["loadReview"]);

const state = reactive<CreateProductReviewRequest>({
  rating: 0,
  content: undefined,
});

const validate = (state: CreateProductReviewRequest): FormError[] => {
  const errors = [];
  if (state.rating === 0) {
    errors.push({ path: "rating", message: "กรุณาเลือกเรตติ้ง" });
  }
  return errors;
};

async function onSubmit(event: FormSubmitEvent<CreateProductReviewRequest>) {
  const errors = validate(state);
  if (errors.length > 0) {
    return;
  }

  try {
    await createProductReview(props.productId, event.data);
    // Reset form
    state.rating = 0;
    state.content = undefined;

    emit("loadReview");
  } catch (error) {
    console.error(error);
  }
}

const disableSubmit = computed(() => {
  return validate(state).length > 0;
});
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="เรตติ้ง" name="rating">
      <ARating v-model="state.rating" />
    </UFormGroup>

    <UFormGroup label="เนื้อหา" name="content">
      <UTextarea v-model="state.content" />
    </UFormGroup>

    <div class="flex justify-end">
      <UButton type="submit" :disabled="disableSubmit">ส่งรีวิว</UButton>
    </div>
  </UForm>
</template>
