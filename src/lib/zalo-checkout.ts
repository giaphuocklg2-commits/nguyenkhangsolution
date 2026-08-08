import { createHmac, timingSafeEqual } from "node:crypto";

export type CheckoutMacValue = string | number | boolean | null | undefined | object;

function privateKey() {
  const key = process.env.ZALO_CHECKOUT_PRIVATE_KEY;
  if (!key) throw new Error("ZALO_CHECKOUT_PRIVATE_KEY is not configured");
  return key;
}

export function serializeMacData(data: Record<string, CheckoutMacValue>) {
  return Object.keys(data).sort().map((key) =>
    `${key}=${typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]}`
  ).join("&");
}

export function createCheckoutMac(data: Record<string, CheckoutMacValue>) {
  return createHmac("sha256", privateKey()).update(serializeMacData(data)).digest("hex");
}

export function verifyCheckoutMac(data: Record<string, CheckoutMacValue>, receivedMac: unknown) {
  if (typeof receivedMac !== "string") return false;
  const expectedBuffer = Buffer.from(createCheckoutMac(data), "utf8");
  const receivedBuffer = Buffer.from(receivedMac, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
