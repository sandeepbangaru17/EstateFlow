import json
from typing import Optional, Any
from app.core.redis import redis_pool
import redis.asyncio as redis

def _get_cache_client() -> redis.Redis:
    if not redis_pool:
        raise Exception("Redis pool not initialized")
    return redis.Redis(connection_pool=redis_pool)

async def get_cache(key: str) -> Optional[Any]:
    client = _get_cache_client()
    try:
        data = await client.get(key)
        if data:
            return json.loads(data)
        return None
    finally:
        await client.aclose()

async def set_cache(key: str, value: Any, expire_seconds: int = 3600):
    client = _get_cache_client()
    try:
        # We use default=str to safely serialize UUIDs and datetime objects
        await client.setex(key, expire_seconds, json.dumps(value, default=str))
    finally:
        await client.aclose()

async def invalidate_cache(key: str):
    client = _get_cache_client()
    try:
        await client.delete(key)
    finally:
        await client.aclose()

async def invalidate_cache_pattern(pattern: str):
    client = _get_cache_client()
    try:
        keys = await client.keys(pattern)
        if keys:
            await client.delete(*keys)
    finally:
        await client.aclose()
