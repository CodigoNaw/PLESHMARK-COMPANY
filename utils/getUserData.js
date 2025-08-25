import { jwtDecode } from "jwt-decode";

/**
 * Devuelve los datos del usuario. Prioriza userData (perfil persistido),
 * si no existe, cae al token JWT.
 */
export function getUserData() {
  try {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      return JSON.parse(userDataStr);
    }

    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("getUserData error:", error);
    return null;
  }
}
