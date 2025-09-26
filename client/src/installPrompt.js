let deferredPrompt = null;

export function setupInstallPrompt(buttonId = "installBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.style.display = "inline-block";
  });

  btn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // outcome: 'accepted' | 'dismissed'
    deferredPrompt = null;
    btn.style.display = "none";
  });
}
