self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const { title, body, type, notificationId, userId } = data;

  let actions = [];
  if (type === "easy_question") {
    actions = [
      { action: "yes", title: "Yes" },
      { action: "no", title: "No" },
      { action: "not_yet", title: "Not yet" },
    ];
  } else if (type === "absence_call" || type === "morning_pulse") {
    actions = [{ action: "reply", title: "Reply", type: "text", placeholder: "What's on your mind..." }];
  }

  event.waitUntil(
    self.registration.showNotification(title || "monk", {
      body: body || "",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      data: { url: data.url || "/think", type, notificationId, userId },
      actions,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { type, notificationId, userId } = event.notification.data || {};

  if (event.action === "reply" && event.reply) {
    event.waitUntil(
      fetch("/api/save-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: event.reply, notificationType: type, notificationId }),
      })
    );
  } else if (["yes", "no", "not_yet"].includes(event.action)) {
    event.waitUntil(
      fetch("/api/save-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: event.action, notificationType: type, notificationId }),
      })
    );
  } else {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((list) => {
        for (const client of list) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        return clients.openWindow("/");
      })
    );
  }
});
