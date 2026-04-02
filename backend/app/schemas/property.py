from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    location: str
    type: str

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    type: Optional[str] = None
    approved: Optional[bool] = None

class PropertyInDB(PropertyBase):
    id: str  # UUID
    owner_id: str
    approved: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PropertyResponse(PropertyInDB):
    pass
