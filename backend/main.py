from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_DB_URL = "mongodb://127.0.0.1/myLoginRegisterDB"
MONGO_DB_NAME = "myLoginRegisterDB"  


client = AsyncIOMotorClient(MONGO_DB_URL)
db = client[MONGO_DB_NAME]

class UserDetails(BaseModel):
    firstnameuser: str
    lastnameuser: str
    addressuser: str
    numberuser: str

class PersonDetails(BaseModel):
    firstname: str
    lastname: str
    age: str
    height: str
    address: str
    resident: str
    citizenshipnumber: str
    number: str
    moredetails: str

@app.post("/submit-form")
async def submit_form(user_details: UserDetails, person_details: PersonDetails):
    
    user_details_collection = db["user_details"]
    person_details_collection = db["person_details"]

    await user_details_collection.insert_one(user_details.dict())
    await person_details_collection.insert_one(person_details.dict())

    return {"status": "Form submitted successfully"}
