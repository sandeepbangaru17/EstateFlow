import json
from typing import Optional, Any
from app.core.redis import redis_pool
import redis.asyncio as redis

def _get_cache_client() -> Optional[redis.Redis]:
    """Returns a Redis client or None if pool is not initialized."""
    if not redis_pool:
        return None
    return redis.Redis(connection_pool=redis_pool)

async def get_cache(key: str) -> Optional[Any]:
    client = _get_cache_client()
    if not client:
        return None  # Cache miss — fallback to DB
    try:
        data = await client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception:
        return None  # Redis error — fallback to DB
    finally:
        await client.aclose()

async def set_cache(key: str, value: Any, expire_seconds: int = 3600):
    client = _get_cache_client()
    if not client:
        return  # Skip caching gracefully
    try:
        await client.setex(key, expire_seconds, json.dumps(value, default=str))
    except Exception:
        pass  # Redis error — continue without cache
    finally:
        await client.aclose()

async def invalidate_cache(key: str):
    client = _get_cache_client()
    if not client:
        return
    try:
        await client.delete(key)
    except Exception:
        pass
    finally:
        await client.aclose()

async def invalidate_cache_pattern(pattern: str):
    client = _get_cache_client()
    if not client:
        return
    try:
        keys = await client.keys(pattern)
        if keys:
            await client.delete(*keys)
    except Exception:
        pass
    finally:
        await client.aclose()
