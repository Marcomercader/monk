/// <reference lib="webworker" />
export {};
declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// Handle incoming push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "monk", {
      body: data.body ?? "",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      data: { url: data.url ?? "/think" },
      silent: false,
    })
  );
});

// On notification tap — open the app to the think page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const existing = clientList.find((c) => c.url.includes(self.location.origin));
        if (existing) {
          existing.focus();
          existing.navigate(event.notification.data.url);
        } else {
          self.clients.openWindow(event.notification.data.url);
        }
      })
  );
});
