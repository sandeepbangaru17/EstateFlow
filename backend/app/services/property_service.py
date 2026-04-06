from typing import List, Optional
from app.core.supabase import supabase_client
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyInDB
from app.services.cache_service import get_cache, set_cache, invalidate_cache_pattern, invalidate_cache

CACHE_TTL = 900 # 15 minutes cache for properties

async def get_all_properties(location: Optional[str] = None, type: Optional[str] = None) -> List[PropertyInDB]:
    # Build a deterministic cache key based on filters
    cache_key = f"properties:all:loc={location or 'any'}:type={type or 'any'}"
    cached_data = await get_cache(cache_key)
    if cached_data:
        return [PropertyInDB(**item) for item in cached_data]
    
    # Query Supabase for all properties
    query = supabase_client.table("properties").select("*")
    
    if location and location.lower() != "any":
        query = query.ilike("location", f"%{location}%")
    if type and type != "Any Type":
        query = query.eq("type", type)
        
    response = query.execute()
    properties = response.data
    
    await set_cache(cache_key, properties, CACHE_TTL)
    return [PropertyInDB(**p) for p in properties]

async def create_inquiry(property_id: str, email: str, message: str) -> bool:
    data = {
        "property_id": property_id,
        "user_email": email,
        "message": message
    }
    response = supabase_client.table("inquiries").insert(data).execute()
    return len(response.data) > 0

async def get_property_by_id(property_id: str) -> Optional[PropertyInDB]:
    cache_key = f"property:{property_id}"
    cached_data = await get_cache(cache_key)
    if cached_data:
        return PropertyInDB(**cached_data)

    response = supabase_client.table("properties").select("*").eq("id", property_id).execute()
    data = response.data
    if not data:
        return None
    
    property_data = data[0]
    await set_cache(cache_key, property_data, CACHE_TTL)
    return PropertyInDB(**property_data)

async def create_property(property_data: PropertyCreate, owner_id: str) -> PropertyInDB:
    # Convert Pydantic to dict
    data = property_data.model_dump()
    data["owner_id"] = owner_id
    
    response = supabase_client.table("properties").insert(data).execute()
    new_property = response.data[0]
    
    # Invalidate lists cache so new properties (when approved) show up
    await invalidate_cache_pattern("properties:all*")
    return PropertyInDB(**new_property)

async def update_property(property_id: str, property_data: PropertyUpdate) -> Optional[PropertyInDB]:
    data = property_data.model_dump(exclude_unset=True)
    if not data:
        return await get_property_by_id(property_id)
        
    response = supabase_client.table("properties").update(data).eq("id", property_id).execute()
    if not response.data:
        return None
        
    updated = response.data[0]
    
    # Invalidate both specific property and all properties cache
    await invalidate_cache(f"property:{property_id}")
    await invalidate_cache_pattern("properties:all*")
    
    return PropertyInDB(**updated)

async def delete_property(property_id: str) -> bool:
    response = supabase_client.table("properties").delete().eq("id", property_id).execute()
    
    await invalidate_cache(f"property:{property_id}")
    await invalidate_cache_pattern("properties:all*")
    
    return len(response.data) > 0

async def get_all_inquiries() -> List[dict]:
    """Fetch all inquiries from the Supabase 'inquiries' table."""
    response = supabase_client.table("inquiries").select("*, properties(title)").order("created_at", descending=True).execute()
    return response.data
