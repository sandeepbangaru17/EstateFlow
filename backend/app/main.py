from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.redis import init_redis_pool, close_redis_pool

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_redis_pool()
    yield
    # Shutdown
    await close_redis_pool()

app = FastAPI(
    title="EstateFlow API",
    description="Backend API for EstateFlow real estate management.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Import the router at the top or inside to avoid circular imports if any, but since we just wrote it:
from app.api import properties

# Include Routers
app.include_router(properties.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to EstateFlow API"}
