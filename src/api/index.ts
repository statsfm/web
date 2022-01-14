import NProgress from 'nprogress';
import * as toaster from '../components/base/Toaster/api';
import i18n from '~/i18n';

export interface Response<T = any> {
  success: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: any;
  data: T;
}

export default class BacktrackApi {
  static baseUrl: string = 'https://staging.backtrack.dev/api/v1';

  constructor() {}

  /**
   * @param  {string} slug
   * @param  {RequestInit} init?
   * @returns {Promise<Response>} Returns a promise with the {@link Response response}.
   */
  static async request<T>(slug: string, init?: RequestInit): Promise<Response<T>> {
    init = {
      ...init,
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        ...init?.headers
      }
    };

    // @ts-ignore
    if (init.headers['Content-Type'] == null) {
      // @ts-ignore
      delete init.headers['Content-Type'];
    }

    NProgress.start();

    const res = await fetch(`${this.baseUrl}${slug}`, init);
    const newRes: Response = {
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      headers: res.headers,
      data: await res.json()
    };

    NProgress.done();
    if (!newRes.success) {
      switch (newRes.status) {
        case 403:
          toaster.error({ message: i18n.global.t('errors.not_authenticated') });
          break;
        default:
          toaster.error({
            message: newRes.data.message
          });
      }
    }

    return newRes;
  }

  /**
   * @param  {string} slug
   * @param  {RequestInit} options?
   * @returns {Promise<Response>} Returns a promise with the {@link Response response}.
   */
  static async get<T>(slug: string, options?: RequestInit): Promise<Response<T>> {
    return await this.request<T>(slug, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * @param  {string} slug
   * @param  {RequestInit} options?
   * @returns {Promise<Response>} Returns a promise with the {@link Response response}.
   */
  static async post<T>(slug: string, options?: RequestInit): Promise<Response<T>> {
    return await this.request<T>(slug, {
      ...options,
      method: 'POST'
    });
  }

  /**
   * @param  {string} slug
   * @param  {RequestInit} options?
   * @returns {Promise<Response>} Returns a promise with the {@link Response response}.
   */
  static async put<T>(slug: string, options?: RequestInit): Promise<Response<T>> {
    return await this.request<T>(slug, {
      ...options,
      method: 'PUT'
    });
  }

  /**
   * @param  {string} slug
   * @param  {RequestInit} options?
   * @returns {Promise<Response>} Returns a promise with the {@link Response response}.
   */
  static async delete<T>(slug: string, options?: RequestInit): Promise<Response<T>> {
    return await this.request<T>(slug, {
      ...options,
      method: 'DELETE'
    });
  }
}
