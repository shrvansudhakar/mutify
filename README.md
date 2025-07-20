# 🔇 Mutify

**Mutify** is a lightweight Chrome extension that helps you avoid embarrassing moments during Google Meet by adding a floating, draggable microphone toggle button which is always visible and synced with your real time native mic state.

Whether you're speaking or just listening in, Mutify ensures you're never caught saying something accidentally with your mic on.

---

## 🚀 Features

-   🎤 **Draggable mic toggle button**: Move it anywhere on the screen.
-   🔄 **Live sync with Google Meet**: Reflects your actual mute/unmute status in real-time.
-   ⚡ **Fast and lightweight**: Built with React, Vite, and TypeScript.
-   🔐 **Privacy-respecting**: Runs only on Google Meet (`https://meet.google.com/*`) with no data tracking.

---

## 🛠️ Tech Stack

-   React, TypeScript, CSS, Vite

---

## 🧑‍💻 How It Works

1. When you join a Google Meet call, Mutify injects a custom mic toggle button.
2. It tracks mic state changes using `MutationObserver` on the Meet UI.
3. The button updates in real time to reflect your mute/unmute status.
4. Clicking the button triggers the same event as manually toggling the mic.

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/shrvansudhakar/mutify.git
cd mutify
npm run build
```
