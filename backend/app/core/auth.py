from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings
from pydantic import BaseModel

class TokenData(BaseModel):
    user_id: str
    role: str = "user"

# HTTPBearer automatically extracts the "Authorization: Bearer <token>" header
security = HTTPBearer()

def verify_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Verify using Supabase JWT Secret
        payload = jwt.decode(
            token, 
            settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            options={"verify_aud": False} # Supabase uses "authenticated" audience by default
        )
        
        # Extract the user ID (Supabase uses 'sub' for the UUID)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        # Extract role if we have custom claims, otherwise default to user
        app_metadata = payload.get("app_metadata", {})
        role: str = app_metadata.get("role", "user")
        
        return TokenData(user_id=user_id, role=role)
        
    except JWTError:
        raise credentials_exception

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Dependency to get the current verified user."""
    return verify_token(credentials.credentials)

async def require_admin(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    """Dependency to ensure the user has an admin role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
