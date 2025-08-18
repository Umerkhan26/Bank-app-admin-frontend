// Enhanced Firebase Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

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
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Configure notification appearance
const NOTIFICATION_ICON = "/logo192.png";
const NOTIFICATION_BADGE = "/badge.png";

// Enhanced background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Received background message:", {
    ...payload,
    notification: payload.notification,
    data: payload.data,
  });

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_BADGE,
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: "open_app", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  // Show notification
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  if (event.action === "open_app") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Check if there's already a window/tab open
        const matchingClient = windowClients.find(
          (client) => client.url === urlToOpen
        );

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Service Worker Lifecycle
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");
  event.waitUntil(clients.claim());
});

// Periodic sync for background updates (optional)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-notifications") {
    console.log("[SW] Periodic sync for notifications");
    event.waitUntil(handlePeriodicSync());
  }
});

async function handlePeriodicSync() {
  // Implement background sync logic if needed
}
