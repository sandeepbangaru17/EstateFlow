from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    location: str
    type: str
    image_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class InquiryCreate(BaseModel):
    user_email: str
    message: str

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    type: Optional[str] = None
    approved: Optional[bool] = None

class PropertyInDB(PropertyBase):
    id: str  # UUID
    owner_id: Optional[str] = None
    approved: Optional[bool] = None
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class PropertyResponse(PropertyInDB):
    pass
