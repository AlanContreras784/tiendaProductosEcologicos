import { apiClient } from "./apiClient.js";

export function obtenerCategorias() {

    return apiClient("/categorias");

}