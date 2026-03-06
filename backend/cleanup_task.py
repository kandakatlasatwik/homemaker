"""
Background task to delete images older than 6 hours from the database
"""
from database import imagegen_collection
from datetime import datetime, timedelta
import asyncio


async def delete_old_images():
    """Delete images older than 6 hours"""
    while True:
        try:
            # Calculate cutoff time (6 hours ago)
            cutoff_time = datetime.utcnow() - timedelta(hours=6)
            
            # Delete old images
            result = imagegen_collection.delete_many({
                "created_at": {"$lt": cutoff_time}
            })
            
            if result.deleted_count > 0:
                print(f"🗑️ Deleted {result.deleted_count} old images (older than 6 hours)")
            
        except Exception as e:
            print(f"❌ Error deleting old images: {e}")
        
        # Run every 30 minutes
        await asyncio.sleep(1800)  # 1800 seconds = 30 minutes


def start_cleanup_task():
    """Start the cleanup background task"""
    asyncio.create_task(delete_old_images())
    print("✅ Started image cleanup background task (runs every 30 minutes)")
