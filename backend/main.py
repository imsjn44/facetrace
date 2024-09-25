from fastapi import FastAPI, WebSocket, HTTPException, Request, Depends, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import cv2
import base64  
from pymongo import MongoClient
import numpy as np 
import utils, json, pprint, time
from bson import ObjectId
from schemas import serialize_victim,  serialize_found_person
import os
from db import db
from fastapi.security import  OAuth2PasswordRequestForm
from authenticate import Token,  authenticate_user, create_access_token, UserInDB, get_password_hash, get_authorised_user
from datetime import datetime, timedelta
from typing import Annotated


origins = [
    "http://localhost:3000",
]

app = FastAPI()

# MongoDB connection
# client = MongoClient("mongodb+srv://dhakalnabin209:facetrace@cluster0.paiud41.mongodb.net/")

# db = client["facetrace"]         present in db.py
victims_collection = db["victims"]
senders_collection = db["senders"]
found_collection = db["found"]
users_collection = db["users"]

facetrace_model = None
async def startup_event():
    global facetrace_model
    facetrace_model = utils.get_model()
    print("model loaded")

@app.on_event("startup")
async def on_startup():
    await startup_event()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():

    return {"message": "hi"}



#Register and Login
ACCESS_TOKEN_EXPIRE_MINUTES = 30
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm= Depends()):
    user = authenticate_user(users_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class Registration(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str

@app.post("/register/")
async def register(data: Registration):
    data = data.dict()
    password = data.pop('password')
    if users_collection.find_one({'username': data['username']}):
        raise HTTPException(status_code=503, detail="User already registered")
    hashed_password = get_password_hash(password)
    user = UserInDB(**data, hashed_password=hashed_password)
    
    users_collection.insert_one(user.dict())
    return {'status':'successfully registered'}



@app.post("/api/victim-submit/")
async def form_submit(data: dict):
    victim_details = data.get('victim_details')
    sender_details = data.get('sender_details')
    victim_image = victim_details.pop('victim_image')
    sender_citizenship = sender_details.pop('citizenship_card')

    verification_data= {
        'firstname': victim_details['firstname'],
        'lastname': victim_details['lastname'],
        'gender': victim_details['gender'],
        'age': victim_details['age']
    }
    if victims_collection.find_one(verification_data):
        raise HTTPException(status_code=503, detail="Victim already registered")

    sender_details =  senders_collection.insert_one(sender_details)
    sender_id = sender_details.inserted_id
    victim_details['sender_id'] = sender_id
    victim_details['status'] = 'pending'
    victim_details =  victims_collection.insert_one(victim_details)
    victim_id = victim_details.inserted_id

    utils.save_image(victim_image, victim_id, folder='victims')
    utils.save_image(sender_citizenship, sender_id, folder='senders')


    return {'status':'successfully registered'}





class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int
    confidence: int

@app.websocket("/ws/face-detect/")
async def facedetect(websocket: WebSocket):
    await websocket.accept()
    while True:
        req = await websocket.receive_text()
        req  = json.loads(req)

        if req.get('type') == 'init':
            print(req)

        elif req.get('type') == 'image':
            data = req.get('value')
            date_time = req.get('datetime')
            encoded_data = data.split(',')[1]
            binary_data = base64.b64decode(encoded_data)
            image = np.frombuffer(binary_data, dtype=np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            match = await utils.get_bounding_boxes(image, socket=websocket, model=facetrace_model, victims_collection=victims_collection)
            if match:
                victim_id, match_img = match   #match_img is from webcam
                #after match remove the image from positive images
                # positive_path = os.path.join('static','positive_images', victim_id + '.jpg')
                # if os.path.exists():
                #     os.remove(positive_path)


                victim = victims_collection.find_one({'_id': ObjectId(victim_id)})

                if victim and victim.get('status') == 'matched':
                    print('already matched')
                    continue
                print('first match')
                victims_collection.update_one({'_id': ObjectId(victim_id)}, {'$set': {'status': 'matched'}})
                found_collection.insert_one({'victim_id': victim_id, 'sender_id': victim.get('sender_id'), 'found_datetime': date_time})
                anchor_img = cv2.imread(f'static/positive_images/{victim_id}.jpg')                                
                anchor_img = utils.get_base_64_image(anchor_img)
                match_img = utils.get_base_64_image(match_img)

                await websocket.send_json({'type': 'match', 'victim_img': anchor_img, 'match_img': match_img, 'datetime':date_time})
            








@app.post("/accept-victim/")
async def accept_person(id:dict[str, str]):
    id = id.get('id')
    
    #crop and save in positive images
    filename = id + '.jpg'
    image = cv2.imread(os.path.join('static','victims',filename))
    if image is None:
        raise HTTPException(status_code=400, detail="Bad Request")
    face = utils.crop_face(image)
    if len(face):
        cv2.imwrite(os.path.join('static','positive_images', filename), face)
    victims_collection.find_one_and_update({'_id': ObjectId(id)}, {'$set': {'status': 'accepted'}})
    return{'status':'successfully accepted'}


@app.get('/api/found-victims/')
async def get_found_victims(request: Request):
    if not found_collection.count_documents({}):
        print('no found victims')
        return []
    found_victims = found_collection.find()
    # return []
    response_data = []
    for victim in found_victims:
        data = serialize_found_person(victim, victims_collection, senders_collection, request) 
        if data:
            response_data.append(data)
   
    return  response_data

@app.post("/api/delete-victim/")
async def delete_victim(id:dict[str, str]):
  id = id.get('id')

  victim = victims_collection.find_one({'_id': ObjectId(id)})
  sender_id = victim.get('sender_id')
  status = victim.get('status')

  if status == 'matched': #for matched person only
      found_collection.find_one_and_delete({'victim_id': id})

  remove_image = utils.remove_image(id, sender_id)
  if not remove_image:
      raise HTTPException(status_code=400, detail="Bad Request")
  victims_collection.find_one_and_delete({'_id': ObjectId(id)})
  senders_collection.find_one_and_delete({'_id': ObjectId(sender_id)})
  return{'status':'successfully deleted'}

@app.post("/api/victims")
async def incoming_victims(data:dict[str,str], request: Request, user:UserInDB=Depends(get_authorised_user)):
    status = data.get('status')
    print('getting data', status)
    pending_victims = victims_collection.find({'status': status})
    if not pending_victims:
        return []
    pending_victims = [
        serialize_victim(victim,senders_collection, request) for victim in pending_victims
    ]
   
    return  pending_victims
            







