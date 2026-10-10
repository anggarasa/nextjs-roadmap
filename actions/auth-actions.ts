"use server";

import {
  loginAction as _loginAction,
  logoutAction as _logoutAction,
  storeAuthTokens as _storeAuthTokens,
  refreshAuthTokens as _refreshAuthTokens,
  simulateLoginRole as _simulateLoginRole,
} from "@/app/actions/auth-actions";

export async function loginAction(prevState: any, formData: FormData) {
  return _loginAction(prevState, formData);
}

export async function logoutAction() {
  return _logoutAction();
}

export async function storeAuthTokens(accessToken: string, refreshToken: string) {
  return _storeAuthTokens(accessToken, refreshToken);
}

export async function refreshAuthTokens() {
  return _refreshAuthTokens();
}

export async function simulateLoginRole(role: "ADMIN" | "USER") {
  return _simulateLoginRole(role);
}
