import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { API } from "../api/axios";
import Cookies from "js-cookie";
import { getDeviceHeaders } from "../api/header";
import { setLocalStorage } from "@/utils/localStorage";

/**
 * =========================
 * Providers Setup
 * =========================
 */

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Apple Provider
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

/**
 * =========================
 * Social Login (Google / Apple)
 * =========================
 */

export const socialLogin = async (
  type: "google" | "apple"
) => {
  try {
    let provider;

    // Select provider based on type
    if (type === "google") {
      provider = googleProvider;
    } else if (type === "apple") {
      provider = appleProvider;
    } else {
      throw new Error("Unsupported login type");
    }

    /**
     * 1. Firebase Popup Login
     */
    const result = await signInWithPopup(auth, provider);

    if (!result?.user) {
      throw new Error("Firebase user not found");
    }

    /**
     * 2. Get Firebase ID Token
     */
    const firebaseToken = await result.user.getIdToken();
    console.log(result.user,"email")
    const user = result?.user
    setLocalStorage("user",user)
    


    /**
     * 3. Send token to backend
     */
    const response = await API.post("/auth", {
      method: type,
      idToken: firebaseToken,
      role: "partner",
    }, {
      headers: {
        ...getDeviceHeaders()
      }
    });

    /**
     * 4. Extract backend auth token
     */
    const authToken = response.data?.data?.token;
    console.log(authToken, 'authToken');
    if (!authToken) {
      throw new Error("Auth token not received from backend");
    }

    /**
     * 5. Save token in cookies
     */
    Cookies.set("authToken", authToken, {
      expires: 7,
      sameSite: "strict",
    });

    return response.data;
  } catch (error: any) {
    console.error(`${type} login failed:`, error);
    throw error;
  }
};

/**
 * =========================
 * Firebase Logout + Backend Logout
 * =========================
 */

export const logout = async () => {
  try {
    /**
     * 1. Call backend logout (optional but recommended)
     */
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout error:", error);
  } finally {
    /**
     * 2. Clear cookies
     */
    Cookies.remove("authToken");
    Cookies.remove("resetToken");

    /**
     * 3. Firebase logout
     */
    await signOut(auth);
  }
};