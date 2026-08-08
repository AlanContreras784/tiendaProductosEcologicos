import { apiClient } from "./apiClient.js";

export function login(datos) {
    return apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(datos)
    });
}
export function registrar(datos) {
    return apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify(datos)
    });
}