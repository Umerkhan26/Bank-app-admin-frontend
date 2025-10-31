import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  MessagePayload,
  Messaging,
  deleteToken,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBMPdu0IDUvRODcVEjhrfvUS3aTZw3xpI",
  authDomain: "banks-2acd4.firebaseapp.com",
  projectId: "banks-2acd4",
  storageBucket: "banks-2acd4.appspot.com",
  messagingSenderId: "968623475695",
  appId: "1:968623475695:web:dc189e9498247bea6f441a",
  measurementId: "G-632GTJBXF2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase Messaging
let messaging: Messaging;

const initMessaging = async (): Promise<Messaging | null> => {
  try {
    const isSupportedBrowser = await isSupported();
    if (!isSupportedBrowser) {
      console.warn("[FIREBASE] Messaging not supported in this browser");
      return null;
    }
    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error("[FIREBASE] Error initializing messaging:", error);
    return null;
  }
};

const messagingPromise = initMessaging();

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const messagingInstance = await messagingPromise;
    if (!messagingInstance) {
      console.warn("[FIREBASE] Messaging not available");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" }
    );

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("[FIREBASE] Notification permission denied");
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey:
        "BIsmCNy-LfpUp9Ph5OYephVUe_rPytEnrupacP505O2nD63ieW6Tnd1g-gTQBx4d9mE6IXr-JIcDNHG2M3EJx1I",
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("[FIREBASE] Error getting FCM token:", error);
    return null;
  }
};

export const refreshFcmToken = async (): Promise<string | null> => {
  try {
    const messagingInstance = await messagingPromise;
    if (!messagingInstance) return null;

    // Delete existing token
    await deleteToken(messagingInstance);

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" }
    );

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FIREBASE] Notification permission denied during refresh");
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey:
        "BIsmCNy-LfpUp9Ph5OYephVUe_rPytEnrupacP505O2nD63ieW6Tnd1g-gTQBx4d9mE6IXr-JIcDNHG2M3EJx1I",
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("[FIREBASE] Error refreshing FCM token:", error);
    return null;
  }
};

export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
) => {
  return messagingPromise.then((messagingInstance: Messaging | null) => {
    if (messagingInstance) {
      const unsubscribe = onMessage(messagingInstance, (payload) => {
        callback(payload);

        if (payload.notification) {
          new Notification(payload.notification.title || "New Notification", {
            body: payload.notification.body,
            icon: "/logo192.png",
          });
        }
      });

      return unsubscribe;
    }

    // if no messaging instance, return a no-op unsubscribe
    return () => {};
  });
};

export { messagingPromise, auth };
