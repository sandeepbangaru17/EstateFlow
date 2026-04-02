import redis.asyncio as redis
from app.core.config import settings

# Global Redis connection pool
redis_pool = None

async def init_redis_pool():
    """
    Initialize the async Redis connection pool.
    Call this during FastAPI startup events.
    """
    global redis_pool
    # Construct connection arguments
    kwargs = {
        "host": settings.REDIS_HOST,
        "port": settings.REDIS_PORT,
        "decode_responses": True, # Automatically decode bytes to str
    }
    if settings.REDIS_PASSWORD:
        kwargs["password"] = settings.REDIS_PASSWORD

    redis_pool = redis.ConnectionPool(**kwargs)
    
async def get_redis_client() -> redis.Redis:
    """
    Dependency to yield an async Redis client from the pool.
    """
    if not redis_pool:
        raise Exception("Redis pool not initialized")
    
    client = redis.Redis(connection_pool=redis_pool)
    try:
        yield client
    finally:
        await client.aclose()

async def close_redis_pool():
    """
    Close the Redis connection pool.
    Call this during FastAPI shutdown events.
    """
    global redis_pool
    if redis_pool:
        await redis_pool.disconnect()
