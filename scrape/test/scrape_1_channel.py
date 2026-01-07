from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
import json
import asyncio
from datetime import timezone
from pathlib import Path
import os
from dotenv import load_dotenv

# ======================
# CONFIG
# ======================
# Load env from scrape/.env regardless of CWD
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path)

# Use env vars if present, else fallback to provided values
api_id = int(os.getenv("TELEGRAM_API_ID", 38356896))
api_hash = os.getenv("TELEGRAM_API_HASH", "ff1eec70d0b9904f5bb6ce38560f71c3")
channel_username = "lebanonnews2"

data_dir = Path(__file__).resolve().parent.parent / "data"
data_dir.mkdir(parents=True, exist_ok=True)
output_file = data_dir / f"{channel_username}.json"

# Store Telethon session files under scrape/sessions
sessions_dir = Path(__file__).resolve().parent.parent / "sessions"
sessions_dir.mkdir(parents=True, exist_ok=True)
session_path = sessions_dir / "session_lebanonnews2"

# ======================
# MAIN
# ======================
client = TelegramClient(str(session_path), api_id, api_hash)

async def main():
    print("Starting Telegram scraper...")

    try:
        # Ensure connection and auth; first run will prompt login
        await client.start()
        print("Successfully connected to Telegram")

        print(f"Connecting to channel: {channel_username}")
        channel = await client.get_entity(channel_username)
        # channel.title may not exist for private channels; guard access if needed
        try:
            print(f"Found channel: {getattr(channel, 'title', channel_username)}")
        except Exception:
            pass

        all_messages = []
        offset_id = 0
        limit = 100
        total_scraped = 0
        max_messages = 1000

        print("Starting message collection...")

        while True:
            try:
                history = await client(GetHistoryRequest(
                    peer=channel,
                    offset_id=offset_id,
                    offset_date=None,
                    add_offset=0,
                    limit=limit,
                    max_id=0,
                    min_id=0,
                    hash=0
                ))

                if not history.messages:
                    print("No more messages to fetch")
                    break

                batch_size = len(history.messages)
                total_scraped += batch_size

                for message in history.messages:
                    if getattr(message, "message", None):
                        all_messages.append({
                            "id": message.id,
                            "date": message.date.astimezone(timezone.utc).isoformat(),
                            "text": message.message
                        })
                        if len(all_messages) >= max_messages:
                            break

                offset_id = history.messages[-1].id

                total_scraped = len(all_messages)
                print(f"Fetched {batch_size} messages (Total: {total_scraped})")

                if total_scraped >= max_messages:
                    print(f"Reached max messages limit ({max_messages}). Stopping.")
                    break

                # Rate limiting to avoid flood wait
                await asyncio.sleep(1)

            except Exception as e:
                print(f"Error fetching batch: {e}")
                await asyncio.sleep(5)
                continue

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(all_messages, f, ensure_ascii=False, indent=2)

        print(f"Saved {len(all_messages)} messages to {output_file}")

    except Exception as e:
        print(f"Fatal error: {e}")
        raise

if __name__ == "__main__":
    with client:
        client.loop.run_until_complete(main())
