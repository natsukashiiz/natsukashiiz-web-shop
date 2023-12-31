<script setup lang="ts">
import type { OrderResponse, AddressResponse } from "~/types";
import { cancelOrder, getOneOrder, payOrder } from "~/api/order";
import { getMainAddress } from "~/api/address";

useHead({
  title: "ชำระเงิน",
  script: [
    {
      hid: "omise",
      src: "https://cdn.omise.co/omise.js",
      defer: true,
    },
  ],
});

interface PaymentMethod {
  name: string;
  type: string;
}

const paymentMethod = ref<PaymentMethod[]>([
  {
    name: "Alipay",
    type: "alipay",
  },
  {
    name: "Line pay",
    type: "rabbit_linepay",
  },
  {
    name: "Prompt pay",
    type: "promptpay",
  },
  {
    name: "TrueMoney",
    type: "truemoney",
  },
]);

const route = useRoute();
const router = useRouter();
const toast = useToast();
const order = ref<OrderResponse>();
const address = ref<AddressResponse>();
const currentPaymentMethod = ref<PaymentMethod>(paymentMethod.value[0]);
const modalCancel = ref<boolean>(false);
const modalPayImage = ref<boolean>(false);
const modalPhoneNumber = ref<boolean>(false);
const payImageUrl = ref<string>();
const phoneNumber = ref<string>();
const loading = ref<boolean>(false);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getOneOrder((route.params as any).orderId as string);
    if (res.status === 200 && res.data) {
      order.value = res.data;

      if (order.value.status !== "PENDING") {
        router.push(`/orders/detail/${order.value.orderId}`);
      }
    } else {
      window.alert("Error");
    }
  } catch (error) {
    window.alert("Error");
  }
  loading.value = false;
};

const loadAddress = async () => {
  const res = await getMainAddress();
  if (res.status === 200 && res.data) {
    address.value = res.data;
  } else {
    window.alert("Error");
  }
};

const invalidPhoneNumber = computed(() => {
  if (!phoneNumber.value) return true;
  if (phoneNumber.value.length !== 10) return true;
  return phoneNumber.value.startsWith("0") ? false : true;
});

const handelPay = async () => {
  if (!order.value) return;

  if (currentPaymentMethod.value.type === "truemoney" && !phoneNumber.value) {
    modalPhoneNumber.value = true;
    return;
  }

  loading.value = true;
  const source = await createSource(order.value.totalPay);

  try {
    const res = await payOrder({
      orderId: order.value.orderId,
      source: source.id,
    });

    if (res.status === 200 && res.data) {
      if (res.data.type === "LINK") {
        window.location.href = res.data.url;
      } else {
        payImageUrl.value = res.data.url;
        modalPayImage.value = true;
      }
    } else {
      window.alert("Error");
    }
  } catch (error) {
    window.alert("Error");
  }

  loading.value = false;
};

const createSource = (amount: number): Promise<{ id: string }> => {
  const Omise = (window as any).Omise;
  Omise.setPublicKey("pkey_test_5un4a0mz82obwpz257q");
  return new Promise((resolve, reject) => {
    Omise.createSource(
      currentPaymentMethod.value.type,
      {
        amount: amount * 100,
        currency: "THB",
        phone_number: phoneNumber.value,
      },
      (statusCode: any, response: any) => {
        if (statusCode !== 200) {
          return reject(response);
        }
        resolve(response);
      }
    );
  });
};

const handleCancel = async () => {
  if (!order.value) return;
  loading.value = true;
  try {
    const res = await cancelOrder(order.value.orderId);
    if (res.status === 200) {
      toast.add({
        id: "cancel",
        title: "ยกเลิกออเดอร์สำเร็จ",
        description: "กรุณารอสักครู่",
        timeout: 1000,
      });
      router.push(`/orders/detail/${order.value.orderId}`);
    } else {
      window.alert("Error");
    }
  } catch (error) {
    window.alert("Error");
  }
  loading.value = false;
};

const payExpireTimeOut = ref<string>("0:00");

const timeOut = () => {
  if (!order.value) return;
  const now = new Date();
  const expire = new Date(order.value.payExpire);
  const diff = expire.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) - minutes * 60;
  payExpireTimeOut.value = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

onMounted(async () => {
  await loadData();
  await loadAddress();

  if (order.value) {
    setInterval(timeOut, 1000);

    const now = new Date();
    const expire = new Date(order.value.payExpire);
    const diff = expire.getTime() - now.getTime();
    setTimeout(() => {
      router.push(`/orders/detail/${order.value?.orderId}`);
    }, diff);
  }
});
</script>
<template>
  <template v-if="order && address">
    <AModal
      :modal="modalPayImage"
      title="ชำระเงิน"
      :image="payImageUrl"
      :footer="false"
      @close="modalPayImage = false"
    />
    <AModal
      :modal="modalPhoneNumber"
      title="กรอกเบอร์โทรศัพท์ TrueMoney"
      @close="
        () => {
          modalPhoneNumber = false;
          phoneNumber = undefined;
        }
      "
      @confirm="handelPay"
      :loading-confirm="loading"
      :disabled-confirm="invalidPhoneNumber"
      confirm-color="primary"
    >
      <UInput
        v-model="phoneNumber"
        placeholder="กรอกเบอร์โทรศัพท์"
        class="w-full"
      />
    </AModal>
    <AModal
      :modal="modalCancel"
      title="ยกเลิกออเดอร์"
      label="คุณต้องการยกเลิกออเดอร์นี้ใช่หรือไม่"
      description="หากยกเลิกออเดอร์แล้ว คุณจะไม่สามารถทำรายการนี้ได้อีก"
      @close="modalCancel = false"
      @confirm="handleCancel"
    />
    <div
      class="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32"
    ></div>
    <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
      <div class="px-4 pt-8">
        <p class="text-xl font-medium">ออเดอร์ : {{ order.orderId }}</p>
        <p class="text-lg font-medium">
          กรุณาชำระเงินภายในเวลา :
          <span class="text-red-500 font-bold">{{ payExpireTimeOut }}</span>
          นาที
        </p>
        <p class="text-gray-400">ตรวจสอบรายละเอียดการสั่งซื้อของคุณ</p>
        <div
          class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6"
        >
          <div
            class="flex flex-col rounded-lg bg-white sm:flex-row"
            v-for="item in order.items"
            :key="item.optionId"
          >
            <img
              class="m-2 h-24 w-28 rounded-md border object-cover object-center"
              src="data:image/jpeg;base64,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"
              alt=""
            />
            <div class="flex w-full flex-col px-4 py-4">
              <span class="font-semibold">{{ item.productName }}</span>
              <span class="float-right text-gray-400">{{
                item.optionName
              }}</span>
              <span class="float-right text-gray-400"
                >จำนวน {{ item.quantity }} ชิ้น</span
              >
              <p class="font-bold">฿<ACurrency :amount="item.price" /></p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
        <p class="text-xl font-medium">วิธีการขนส่ง</p>
        <form class="mt-5 grid gap-6">
          <div class="relative">
            <input
              class="peer hidden"
              id="radio_1"
              type="radio"
              name="radio"
              checked
            />
            <span
              class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"
            ></span>
            <label
              class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
              for="radio_1"
            >
              <div class="ml-5">
                <span class="mt-2 font-semibold">แบบปกติ</span>
                <p class="text-slate-500 text-sm leading-6">
                  ระยะเวลา: 2-4 วัน
                </p>
              </div>
            </label>
          </div>
        </form>
        <p class="text-xl font-medium mt-4">ที่อยู่ในการจัดส่ง</p>
        <div class="">
          <label for="email" class="mt-4 mb-2 block text-sm font-medium"
            >ที่อยู่</label
          >
          <div class="flex space-x-2">
            <span class="text-gray-400">
              {{ address.firstName }} {{ address.lastName }} |
              {{ address.mobile }} | {{ address.address }}</span
            >
            <ULink
              to="/address"
              active-class="text-primary"
              inactive-class="text-blue-500 hover:text-blue-700"
            >
              เปลี่ยน
            </ULink>
          </div>

          <label for="email" class="mt-4 mb-2 block text-sm font-medium"
            >วิธีชำระเงิน</label
          >
          <USelectMenu
            v-model="currentPaymentMethod"
            :options="paymentMethod"
            option-attribute="name"
          />

          <!-- Total -->
          <div class="mt-6 border-t border-b py-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">ยอดรวม</p>
              <p class="font-semibold text-gray-900">
                ฿<ACurrency :amount="order?.totalPay" />
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-400">ค่าขนส่ง</p>
              <p class="text-lg font-semibold text-gray-900">ฟรี</p>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">ยอดที่ต้องชำระ</p>
            <p class="text-2xl font-semibold text-gray-900">
              <ACurrency :amount="order?.totalPay" /> บาท
            </p>
          </div>
        </div>
        <div class="flex flex-col space-y-2 mt-4">
          <UButton block @click="handelPay" :loading="loading">
            ชำระเงิน
          </UButton>
          <UButton
            color="red"
            block
            @click="modalCancel = true"
            :disabled="loading"
          >
            ยกเลิกออเดอร์
          </UButton>
        </div>
      </div>
    </div>
  </template>
</template>
