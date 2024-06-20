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

      if (order.value && order.value.status !== "PENDING") {
        router.replace({
          name: "profile-history-orders-orderId",
          params: {
            orderId: order.value.orderId,
          },
        });
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
        amount: Math.floor(amount * 100),
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
  modalCancel.value = false;
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
      router.replace({
        name: "profile-history-orders-orderId",
        params: {
          orderId: order.value.orderId,
        },
      });
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

onActivated(async () => {
  await loadData();
  await loadAddress();

  if (order.value) {
    setInterval(timeOut, 1000);

    const now = new Date();
    const expire = new Date(order.value.payExpire);
    const timeout = expire.getTime() - now.getTime();
    setTimeout(() => {
      router.push({
        name: "profile-history-orders-orderId",
        params: {
          orderId: order.value!!.orderId,
        },
      });
    }, timeout);
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
              :src="item.productThumbnail"
              :alt="item.productName"
            />
            <div class="flex w-full flex-col px-4 py-4">
              <span class="font-semibold line-clamp-1">
                {{ item.productName }}
              </span>
              <span class="float-right text-gray-400 line-clamp-1">
                {{ item.optionName }}
              </span>
              <span class="float-right text-gray-400">
                จำนวน {{ item.quantity }} ชิ้น
              </span>
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
            <p class="text-lg sm:text-2xl font-semibold text-gray-900">
              <ACurrency :amount="order?.totalPay" /> บาท
            </p>
          </div>
        </div>
        <div class="flex flex-col space-y-2 mt-4">
          <UButton color="green" block @click="handelPay" :loading="loading">
            ชำระเงิน
          </UButton>
          <UButton
            color="gray"
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
