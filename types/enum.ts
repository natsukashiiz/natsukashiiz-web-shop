export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  SHIPPING = "shipping",
  SUCCESSFUL = "successful",
  FAILED = "failed",
  SELF_CANCELED = "self_canceled",
  SELLER_CANCELED = "seller_canceled",
  SYSTEM_CANCELED = "system_canceled",
}

export enum PayUrlType {
  LINK = "link",
  IMAGE = "image",
}

export enum DiscountType {
  PERCENT = "percent",
  AMOUNT = "amount",
}

export enum SocialProviders {
  FACEBOOK = "facebook",
  GOOGLE = "google",
}
