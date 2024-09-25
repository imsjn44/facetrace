import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Layer
from fastapi import WebSocket
import base64
from bson import ObjectId
import asyncio



def save_image(image:str, id:str, folder:str) -> str:
    filename = str(id) + '.jpg'
    encoded_data = image.split(',')[1]
    binary_image = base64.b64decode(encoded_data)
    image = np.frombuffer(binary_image, dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    path = os.path.join('static', folder, filename)
    cv2.imwrite(path, image)
    return path

async def get_bounding_boxes(image, socket:WebSocket, model=None, victims_collection=None):
    faces = get_faces(image)
    if not faces:
        print('no face detected')
        return None
    print('face checking')
    positive_paths = get_positive_paths(victims_collection)
    if not positive_paths:
        return 
    for victim_id, img_path in positive_paths.items(): #stored images
        print('ready to run the model hehe')
        img = cv2.imread(img_path)
        img = cv2.resize(img, (224, 224))  # resize to 224x224 remember to change it!!!! IMPORTANT
        img = preprocess_image(img)
        img = np.expand_dims(img, axis=0)

        for face in faces: #faces in current image
            x, y, w, h = face["x"], face["y"], face["w"], face["h"]
            crop = image[y:y + h, x:x + w]
            crop = cv2.resize(crop, (224, 224))
            anchor = preprocess_image(crop)
            anchor = np.expand_dims(anchor, axis=0)
                        

            prediction = model.predict([img, anchor])
            print(prediction)
            
            if int(prediction[0][0]) == 1:
                print('found')
                return (victim_id, crop)




def crop_face(image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    for (x, y, w, h) in faces:
        crop = image[y:y + h, x:x + w]
        crop = cv2.resize(crop, (224, 224))
        return crop

def get_faces(image):
    bounding_boxes = []
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    for (x, y, w, h) in faces:
        # crop = image[y:y + h, x:x + w]
        # cv2.resize(crop, (224, 224))
        # cv2.imwrite("static/positive_images/image_cropped.jpg", crop)
        bounding_boxes.append(
            {
                "x": int(x),  # convert numpy.int32 to int
                "y": int(y),
                "w": int(w),
                "h": int(h),
                "confidence": 0
            }
        )
    if not len(bounding_boxes):
        return None
    return bounding_boxes


    
def get_positive_paths(victims_collection):
    paths = dict()
    root = os.path.join('static\\positive_images')
    for path in os.listdir(root):
        victim_id = path.split('.')[0] 
        victim = victims_collection.find_one({'_id': ObjectId(victim_id)})
        if victim and victim.get('status') == 'matched':
            continue
        paths[victim_id] = os.path.join(root, path)
        # paths.append(os.path.join(root, path))
    
    return paths

def preprocess_image(img):
    img = tf.keras.applications.vgg16.preprocess_input(img)
    return img

def get_model():
    @tf.keras.saving.register_keras_serializable()
    class DistanceLayer(Layer):
        
        def __init__(self, **kwargs):
            super().__init__(**kwargs)
        

        def call(self, source_representation, test_representation):
    #         print(source_representation.shape)
            euclidean_distance = source_representation - test_representation
            euclidean_distance = tf.multiply(euclidean_distance,euclidean_distance)
    #         print(euclidean_distance.shape) 
            euclidean_distance = tf.reduce_sum(euclidean_distance, axis=1)
            euclidean_distance = tf.sqrt(euclidean_distance)
            euclidean_distance = tf.reshape(euclidean_distance, (-1,1))
            return euclidean_distance
        
    @tf.keras.saving.register_keras_serializable()
    class ThresholdLayer(Layer):
        
        def __init__(self, threshold, **kwargs):
            super().__init__(**kwargs)
            self.threshold = threshold
        
        def call(self, distances):
            print(distances)
            return tf.map_fn(fn=lambda t: float(t <= self.threshold), elems=distances)
        print("load_model")
    model = tf.keras.models.load_model('static/model/facetrace1.keras')
    return model

def get_base_64_image(image):
    success, buffer = cv2.imencode('.jpg', image)
    if success:
        image = 'data:image/jpeg;base64,'+ base64.b64encode(buffer).decode('utf-8')
        return image
    return None

def remove_image(id, sender_id):
    victim_paths = [os.path.join('static', 'victims', str(id) + '.jpg'), os.path.join('static', 'positive_images', str(id) + '.jpg')]
    for path in victim_paths:
        if os.path.exists(path):
            os.remove(path)
    sender_path = os.path.join('static', 'senders', str(sender_id) + '.jpg')
    if os.path.exists(sender_path):
        os.remove(sender_path)
        return True

    return False