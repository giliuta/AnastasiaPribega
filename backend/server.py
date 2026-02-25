from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = ""
    message: str
    language: str = "ru"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str
    language: str = "ru"


class QuizResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    face_shape: str
    brow_density: str
    desired_effect: str
    experience: str
    recommendation: str
    name: Optional[str] = ""
    email: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class QuizCreate(BaseModel):
    face_shape: str
    brow_density: str
    desired_effect: str
    experience: str
    name: Optional[str] = ""
    email: Optional[str] = ""


def get_brow_recommendation(face_shape, brow_density, desired_effect, lang="ru"):
    recommendations = {
        "ru": {
            "natural": "Мы рекомендуем натуральную коррекцию с подчёркиванием вашей природной формы. Процедура ламинирования идеально подойдёт для создания ухоженного, но естественного образа.",
            "defined": "Вам подойдёт архитектурная коррекция с лёгким окрашиванием. Мы создадим чёткую, выразительную форму, которая подчеркнёт геометрию вашего лица.",
            "dramatic": "Рекомендуем комплексную процедуру: коррекция + ламинирование с окрашиванием. Это создаст яркий, выразительный образ с безупречной архитектурой формы."
        },
        "en": {
            "natural": "We recommend natural correction that enhances your natural brow shape. A lamination treatment would be perfect for creating a polished yet natural look.",
            "defined": "An architectural correction with light tinting would suit you. We'll create a precise, expressive shape that accentuates your facial geometry.",
            "dramatic": "We recommend a comprehensive treatment: correction + lamination with tinting. This will create a striking, expressive look with flawless architectural form."
        }
    }
    return recommendations.get(lang, recommendations["en"]).get(desired_effect, recommendations[lang]["natural"])


@api_router.get("/")
async def root():
    return {"message": "PRIBEGA API"}


@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(input_data: ContactCreate):
    submission = ContactSubmission(**input_data.model_dump())
    doc = submission.model_dump()
    await db.contacts.insert_one(doc)
    result = await db.contacts.find_one({"id": doc["id"]}, {"_id": 0})
    return result


@api_router.get("/contacts", response_model=List[ContactSubmission])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    return contacts


@api_router.post("/quiz", response_model=QuizResult)
async def submit_quiz(input_data: QuizCreate):
    recommendation = get_brow_recommendation(
        input_data.face_shape,
        input_data.brow_density,
        input_data.desired_effect
    )
    quiz_result = QuizResult(
        **input_data.model_dump(),
        recommendation=recommendation
    )
    doc = quiz_result.model_dump()
    await db.quiz_results.insert_one(doc)
    result = await db.quiz_results.find_one({"id": doc["id"]}, {"_id": 0})
    return result


@api_router.get("/quiz-results", response_model=List[QuizResult])
async def get_quiz_results():
    results = await db.quiz_results.find({}, {"_id": 0}).to_list(1000)
    return results


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
