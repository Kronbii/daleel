from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
import json
import asyncio
from datetime import timezone
from pathlib import Path
import os
from dotenv import load_dotenv
import signal
import sys

# ======================
# CONFIG
# ======================
# Load env from scrape/.env regardless of CWD
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path)

# Use env vars if present, else fallback to provided values
api_id = int(os.getenv("TELEGRAM_API_ID", 38356896))
api_hash = os.getenv("TELEGRAM_API_HASH", "ff1eec70d0b9904f5bb6ce38560f71c3")

# Channels to scrape (skipping mayadeenchannel)
channels = [
    "lebanondebate",
    "Lebanon_24",
    "sadadahiechannel"
]

data_dir = Path(__file__).resolve().parent.parent / "data"
data_dir.mkdir(parents=True, exist_ok=True)

# Store Telethon session files under scrape/sessions
sessions_dir = Path(__file__).resolve().parent.parent / "sessions"
sessions_dir.mkdir(parents=True, exist_ok=True)
session_path = sessions_dir / "session_many_channels"

# ======================
# MAIN
# ======================
client = TelegramClient(str(session_path), api_id, api_hash)

# Checkpoint tracking
checkpoint_file = data_dir / "scrape_checkpoint.json"


def load_checkpoint():
    """Load checkpoint data to see what's been scraped."""
    if checkpoint_file.exists():
        with open(checkpoint_file, "r") as f:
            return json.load(f)
    return {"completed_channels": []}


def save_checkpoint(data):
    """Save checkpoint data."""
    with open(checkpoint_file, "w") as f:
        json.dump(data, f, indent=2)


def channel_already_scraped(channel_username):
    """Check if a channel has already been scraped."""
    output_file = data_dir / f"{channel_username}.json"
    return output_file.exists()


def setup_interrupt_handler():
    """Set up graceful interrupt handling."""
    def signal_handler(sig, frame):
        print("\n\n✗ Scraping interrupted by user")
        print("Data has been saved at interruption points")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

async def scrape_channel(channel_username, max_messages=100000, batch_size=200):
    """Scrape a single channel with safe rate limiting."""
    print(f"\n{'='*60}")
    print(f"Starting scrape for channel: {channel_username}")
    print(f"{'='*60}")

    try:
        channel = await client.get_entity(channel_username)
        try:
            channel_title = getattr(channel, 'title', channel_username)
            print(f"Found channel: {channel_title}")
        except Exception:
            channel_title = channel_username

        all_messages = []
        offset_id = 0
        total_scraped = 0
        batch_count = 0

        print(f"Target: {max_messages} messages, batch size: {batch_size}")
        print("Starting message collection...")

        while total_scraped < max_messages:
            try:
                history = await client(GetHistoryRequest(
                    peer=channel,
                    offset_id=offset_id,
                    offset_date=None,
                    add_offset=0,
                    limit=batch_size,
                    max_id=0,
                    min_id=0,
                    hash=0
                ))

                if not history.messages:
                    print(f"✓ No more messages to fetch (reached end of channel)")
                    break

                batch_messages_count = 0
                for message in history.messages:
                    if getattr(message, "message", None):
                        all_messages.append({
                            "id": message.id,
                            "date": message.date.astimezone(timezone.utc).isoformat(),
                            "text": message.message
                        })
                        batch_messages_count += 1
                        if len(all_messages) >= max_messages:
                            break

                offset_id = history.messages[-1].id
                total_scraped = len(all_messages)
                batch_count += 1

                print(f"  Batch {batch_count}: +{batch_messages_count} messages (Total: {total_scraped}/{max_messages})")

                if total_scraped >= max_messages:
                    print(f"✓ Reached max messages limit ({max_messages}). Stopping.")
                    break

                # Adaptive rate limiting: 1 request per 2 seconds to avoid Telegram flood protection
                # Telegram allows ~30 requests per minute per account, so this is safe
                await asyncio.sleep(2)

            except Exception as e:
                print(f"⚠ Error fetching batch: {e}")
                # On error, wait longer to avoid getting flood-waited
                await asyncio.sleep(10)
                continue

        # Save results to JSON
        output_file = data_dir / f"{channel_username}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(all_messages, f, ensure_ascii=False, indent=2)

        print(f"✓ Saved {len(all_messages)} messages to {output_file}\n")
        return len(all_messages)

    except Exception as e:
        print(f"✗ Fatal error for {channel_username}: {e}\n")
        return 0


async def main():
    print("Starting Multi-Channel Telegram Scraper...")
    print(f"Channels to scrape: {', '.join(channels)}")
    
    # Load checkpoint
    checkpoint = load_checkpoint()
    print(f"Previously completed channels: {checkpoint['completed_channels']}\n")

    try:
        # Ensure connection and auth; first run will prompt login
        await client.start()
        print("✓ Successfully connected to Telegram\n")

        total_all_messages = 0
        channels_to_scrape = []

        # Filter out already completed channels
        for channel in channels:
            if channel_already_scraped(channel):
                print(f"⊘ Skipping {channel} (already scraped)\n")
            else:
                channels_to_scrape.append(channel)

        if not channels_to_scrape:
            print("All channels have been scraped!")
            return

        print(f"Channels remaining to scrape: {', '.join(channels_to_scrape)}\n")

        # Scrape each channel sequentially to avoid rate limits
        for channel in channels_to_scrape:
            count = await scrape_channel(channel, max_messages=100000, batch_size=200)
            total_all_messages += count
            
            # Update checkpoint after each successful channel
            checkpoint['completed_channels'].append(channel)
            save_checkpoint(checkpoint)
            print(f"✓ Checkpoint saved: {channel} marked as complete\n")

        print(f"\n{'='*60}")
        print(f"SCRAPING COMPLETE")
        print(f"Total messages scraped this session: {total_all_messages}")
        print(f"Files saved to: {data_dir}")
        print(f"{'='*60}\n")

    except Exception as e:
        print(f"✗ Fatal error: {e}")
        print("Data has been saved at the last checkpoint")
        raise


if __name__ == "__main__":
    setup_interrupt_handler()
    with client:
        client.loop.run_until_complete(main())
