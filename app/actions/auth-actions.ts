"use server";

import {
  storeAuthTokens as _storeAuthTokens,
  logoutAction as _logoutAction,
  loginAction as _loginAction,
  refreshAuthTokens as _refreshAuthTokens,
} from "@/actions/auth-actions";

/**
 * Menyimpan Access Token dan Refresh Token ke dalam HttpOnly Cookies yang aman.
 */
export async function storeAuthTokens(accessToken: string, refreshToken: string) {
  return _storeAuthTokens(accessToken, refreshToken);
}

/**
 * Menjalankan logout bersih: mencabut sesi di database Nest.js lalu memusnahkan cookies.
 */
export async function logoutAction() {
  return _logoutAction();
}

/**
 * Rotasi token otomatis ke backend Nest.js (/auth/refresh)
 */
export async function refreshAuthTokens() {
  return _refreshAuthTokens();
}

/**
 * Validasi login dan simpan token ke HttpOnly Cookies
 */
export async function loginAction(credentials: { email: string; password: string }) {
  return _loginAction(credentials);
}
