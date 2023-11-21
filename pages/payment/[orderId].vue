<script setup lang="ts">
import type { OrderResponse, AddressResponse } from "~/types";
import { getOneOrder, payOrder } from "~/api/order";
import { getAllAddress, setMainAddress } from "~/api/address";

useHead({
  title: "ชำระเงิน",
  script: [
    {
      hid: "omise",
      src: "https://cdn.omise.co/omise.js",
      defer: true,
      onload: () => console.log("omise loaded"),
    },
  ],
});

const paymentMethod = ref<
  {
    name: string;
    type: string;
  }[]
>([
  {
    name: "Alipay",
    type: "alipay",
  },
  {
    name: "Line pay",
    type: "rabbit_linepay",
  },
]);

const route = useRoute();

const order = ref<OrderResponse>();
const address = ref<AddressResponse[]>();
const currentAddressId = ref<number>();
const currentPaymentMethod = ref<string>(paymentMethod.value[0].type);

const loadData = async () => {
  const res = await getOneOrder(route.params.orderId as string);
  if (res.status === 200 && res.data) {
    order.value = res.data;
    currentAddressId.value = res.data.address.id;

    if (order.value.status !== "PENDING") {
      const router = useRouter();
      router.push(`/orders/detail/${order.value.orderId}`);
    }
  } else {
    window.alert("Error");
  }
};

const loadAddress = async () => {
  const res = await getAllAddress();
  if (res.status === 200 && res.data) {
    address.value = res.data;
  } else {
    window.alert("Error");
  }
};

const handleSetMainAddress = async () => {
  if (!currentAddressId.value) return;

  const res = await setMainAddress(currentAddressId.value);
  if (res.status === 200 && res.data) {
    await loadAddress();
  } else {
    window.alert("Error");
  }
};

const handelPay = async () => {
  if (!order.value) return;

  const source = await createSource(order.value.totalPay);
  const res = await payOrder({
    orderId: order.value.orderId,
    source: source.id,
  });

  if (res.status === 200 && res.data) {
    window.location.href = res.data.url;
  } else {
    window.alert("Error");
  }
};

const createSource = (amount: number) => {
  Omise.setPublicKey("pkey_test_5un4a0mz82obwpz257q");
  return new Promise((resolve, reject) => {
    Omise.createSource(
      currentPaymentMethod.value,
      {
        amount: amount * 100,
        currency: "THB",
      },
      (statusCode, response) => {
        if (statusCode !== 200) {
          return reject(response);
        }
        resolve(response);
      }
    );
  });
};

onMounted(async () => {
  await loadData();
  await loadAddress();
});
</script>
<template>
  <div
    class="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32"
  ></div>
  <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
    <div class="px-4 pt-8">
      <p class="text-xl font-medium">ออเดอร์ : {{ order?.orderId }}</p>
      <p class="text-gray-400">ตรวจสอบรายละเอียดการสั่งซื้อของคุณ</p>
      <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
        <div
          class="flex flex-col rounded-lg bg-white sm:flex-row"
          v-for="item in order?.items"
          :key="item.optionId"
        >
          <img
            class="m-2 h-24 w-28 rounded-md border object-cover object-center"
            src="https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
          <div class="flex w-full flex-col px-4 py-4">
            <span class="font-semibold">{{ item.productName }}</span>
            <span class="float-right text-gray-400">{{ item.optionName }}</span>
            <span class="float-right text-gray-400"
              >จำนวน {{ item.quantity }} ชิ้น</span
            >
            <p class="text-lg font-bold">฿{{ item.price }}</p>
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
              <p class="text-slate-500 text-sm leading-6">ระยะเวลา: 2-4 วัน</p>
            </div>
          </label>
        </div>
      </form>
      <p class="text-xl font-medium mt-4">ที่อยู่ในการจัดส่ง</p>
      <div class="">
        <label for="email" class="mt-4 mb-2 block text-sm font-medium"
          >ที่อยู่</label
        >
        <select
          class="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
          v-model="currentAddressId"
          @change="handleSetMainAddress"
        >
          <template v-for="addr in address" :key="addr.id">
            <option :value="addr.id" :selected="addr.main">
              ชื่อ {{ addr.firstName }} {{ addr.lastName }} | เบอร์โทร
              {{ addr.mobile }} | ที่อยู่ {{ addr.address }}
            </option>
          </template>
        </select>

        <label for="email" class="mt-4 mb-2 block text-sm font-medium"
          >วิธีชำระเงิน</label
        >
        <select
          class="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
          v-model="currentPaymentMethod"
        >
          <template v-for="method in paymentMethod" :key="method.type">
            <option :value="method.type">{{ method.name }}</option>
          </template>
        </select>

        <!-- Total -->
        <div class="mt-6 border-t border-b py-2">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">ยอดรวม</p>
            <p class="font-semibold text-gray-900">฿{{ order?.totalPay }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400">ค่าขนส่ง</p>
            <p class="text-lg font-semibold text-gray-900">ฟรี</p>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">ยอดที่ต้องชำระ</p>
          <p class="text-2xl font-semibold text-gray-900">
            <span class="text-xs font-normal text-gray-400">THB</span>
            {{ order?.totalPay }}
          </p>
        </div>
      </div>
      <button
        class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
        @click="handelPay"
      >
        ชำระเงิน
      </button>
    </div>
  </div>
</template>
