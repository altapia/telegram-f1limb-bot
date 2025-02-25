# Telegram Bot for F1Limb

Telegram Bot to interact with F1Limb.

Based on Telegram Bot Vercel Boilerplate based on Node.js and [Telegraf](https://github.com/telegraf/telegraf) framework.

This project was started based on the [Telegram Bot Boilerplate](https://github.com/yakovlevyuri/telegram-bot-boilerplate) for easily deploy to [Vercel](https://vercel.com).

## Before you start

First rename `.env-sample` file to `.env` and fill in all necessary values.

```properties
BOT_TOKEN="<YOUR_BOT_API_TOKEN>" # Token del bot
URL="<URL_WEB>" # URL de la web
URL_API="<URL_API>" # URL de la API
API_TOKEN="<API_TOKEN>" # Token de la API
ADMIN_CHAT_ID="<ADMIN_TELEGRAM_ID>" # CHAT ID del administrador
```

## Start your local server

```bash
pnpm i
pnpm run devWindows #Windows
pnpm run dev #No Windows
```
