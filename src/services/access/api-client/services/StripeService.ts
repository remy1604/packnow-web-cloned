/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCheckoutSessionRequest } from '../models/CreateCheckoutSessionRequest';
import type { CreateCheckoutSessionResponse } from '../models/CreateCheckoutSessionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StripeService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Create Checkout Session
   * 创建 Stripe checkout session
   *
   * Args:
   * request_body: 包含订单信息的请求体
   * stripe_service: Stripe 服务实例
   *
   * Returns:
   * 包含 session_id, client_secret, order_id 的响应
   * @returns CreateCheckoutSessionResponse Successful Response
   * @throws ApiError
   */
  public createCheckoutSession({
    requestBody,
  }: {
    requestBody: CreateCheckoutSessionRequest,
  }): CancelablePromise<CreateCheckoutSessionResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/access/api/v1/stripe/create-checkout-session',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
