/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 创建 Stripe checkout session 的请求模型
 */
export type CreateCheckoutSessionRequest = {
  email: string;
  notes: string;
  shipping_address_line_1: string;
  shipping_address_line_2: string;
  shipping_city: string;
  shipping_country: string;
  shipping_name: string;
  shipping_phone_code: string;
  shipping_phone_number: string;
  shipping_postal_code: string;
  shipping_state: string;
  total_amount: number;
};

