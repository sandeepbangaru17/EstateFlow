import os
from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Initializes and returns a Supabase client.
    Uses the URL and Anon Key from the environment/config.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_KEY
    supabase: Client = create_client(url, key)
    return supabase

# Provide a global instance for convenience
supabase_client = get_supabase_client()
