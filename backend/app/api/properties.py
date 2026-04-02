from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse, InquiryCreate
from app.services import property_service
from app.core.auth import TokenData, get_current_user, require_admin

router = APIRouter(prefix="/properties", tags=["Properties"])

@router.get("/", response_model=List[PropertyResponse])
async def list_properties(
    location: Optional[str] = Query(None, description="Filter by location"),
    type: Optional[str] = Query(None, description="Filter by property type")
):
    """Get all approved properties (Cached, supports filtering)."""
    return await property_service.get_all_properties(location=location, type=type)

@router.post("/{property_id}/inquire", status_code=status.HTTP_201_CREATED)
async def inquire_property(property_id: str, inquiry: InquiryCreate):
    """Submit an inquiry to contact the agent about a property."""
    success = await property_service.create_inquiry(property_id, inquiry.user_email, inquiry.message)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to send inquiry")
    return {"message": "Inquiry sent successfully"}

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: str):
    """Get a specific property by ID (Cached)."""
    property_data = await property_service.get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data

@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_in: PropertyCreate, 
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new property listing. Requires Authentication."""
    # current_user.user_id is the UUID from Supabase
    return await property_service.create_property(property_in, owner_id=current_user.user_id)

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str, 
    property_in: PropertyUpdate, 
    current_user: TokenData = Depends(get_current_user)
):
    """
    Update a property.
    Note: Full ownership verification logic is simplified here.
    """
    updated_prop = await property_service.update_property(property_id, property_in)
    if not updated_prop:
        raise HTTPException(status_code=404, detail="Property not found or could not update")
    return updated_prop

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: str, 
    # Example of RBAC: only admins can delete for safety in this demo
    admin_user: TokenData = Depends(require_admin) 
):
    """Delete a property. Requires Admin Role."""
    success = await property_service.delete_property(property_id)
    if not success:
        raise HTTPException(status_code=404, detail="Property not found")
