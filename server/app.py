import database
from typing import Dict, List
from fastapi import FastAPI
from starlette.responses import Response
import requests
from commons import config as c
from commons.config import engine
from commons.utils import add_default_user
# Routers
from api.user import user_router

c.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ChainFury",
    description="Transform LLM development with LangChain DB - monitor I/O, evaluate models, and track performance with precision and efficiency using this open-source tool",
    version="0.0.1",
)
add_default_user()

####################################################
################ INITIALIZE ########################
####################################################
# Registering apis.
app.include_router(user_router)

####################################################
################ APIs ##############################
####################################################

# TO CHECK IF SERVER IS ON
@app.get("/test", status_code=200)
def test(response: Response):
    return {"msg": "success"}
