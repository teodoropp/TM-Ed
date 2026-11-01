// Auto-limpeza e remoção do Service Worker para não interferir com o Next.js App Router / HMR
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.map((chave) => caches.delete(chave))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clientes) => {
        clientes.forEach((cliente) => {
          if ("navigate" in cliente) {
            cliente.navigate(cliente.url);
          }
        });
      })
  );
});
