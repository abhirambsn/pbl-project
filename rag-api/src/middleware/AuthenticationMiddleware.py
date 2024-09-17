from fastapi.security import OAuth2AuthorizationCodeBearer
from typing import Annotated
from fastapi import Depends, HTTPException

from jwt import PyJWKClient
import jwt

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    tokenUrl="http://localhost:8080/realms/pbl-api/protocol/openid-connect/token",
    authorizationUrl="http://localhost:8080/realms/pbl-api/protocol/openid-connect/auth",
    refreshUrl="http://localhost:8080/realms/pbl-api/protocol/openid-connect/token"
)

async def valid_access_token(
        access_token: Annotated[str, Depends(oauth2_scheme)]
):
    url = "http://localhost:8080/realms/pbl-api/protocol/openid-connect/certs"
    jwks_client = PyJWKClient(url)

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(access_token)
        data = jwt.decode(
            access_token,
            signing_key.key,
            algorithms=["RS256"],
            audience="account",
            options={"verify_exp": True}
        )
        return data
    except jwt.exceptions.InvalidTokenError as error:
        print(error)
        raise HTTPException(status_code=401, detail="Not Authenticated")
