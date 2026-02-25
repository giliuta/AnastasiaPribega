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
import httpx
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

INSTAGRAM_USERNAME = "pribega_brows_paphos"


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    message: Optional[str] = ""
    language: str = "ru"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactCreate(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    message: Optional[str] = ""
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


# Instagram Feed API
class InstagramPost(BaseModel):
    image_url: str
    thumbnail_url: Optional[str] = ""
    permalink: str
    caption: Optional[str] = ""
    media_type: str = "IMAGE"

class InstagramFeed(BaseModel):
    posts: List[InstagramPost]
    username: str
    last_updated: str


@api_router.get("/instagram/feed")
async def get_instagram_feed():
    """
    Fetch Instagram feed for PRIBEGA account.
    Uses scraping approach with fallback to cached/static data.
    """
    try:
        # Try to get cached data first
        cached = await db.instagram_cache.find_one({"username": INSTAGRAM_USERNAME}, {"_id": 0})
        
        # Check if cache is fresh (less than 1 hour old)
        if cached:
            cache_time = datetime.fromisoformat(cached.get("last_updated", "2000-01-01"))
            if (datetime.now(timezone.utc) - cache_time.replace(tzinfo=timezone.utc)).total_seconds() < 3600:
                return cached
        
        # Try to fetch fresh data
        async with httpx.AsyncClient() as http_client:
            # Use Instagram's public API endpoint for profile data
            response = await http_client.get(
                f"https://www.instagram.com/api/v1/users/web_profile_info/?username={INSTAGRAM_USERNAME}",
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "X-IG-App-ID": "936619743392459",
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                user_data = data.get("data", {}).get("user", {})
                edges = user_data.get("edge_owner_to_timeline_media", {}).get("edges", [])
                
                posts = []
                for edge in edges[:12]:
                    node = edge.get("node", {})
                    posts.append({
                        "image_url": node.get("display_url", ""),
                        "thumbnail_url": node.get("thumbnail_src", ""),
                        "permalink": f"https://www.instagram.com/p/{node.get('shortcode', '')}/",
                        "caption": (node.get("edge_media_to_caption", {}).get("edges", [{}])[0].get("node", {}).get("text", ""))[:100] if node.get("edge_media_to_caption", {}).get("edges") else "",
                        "media_type": node.get("__typename", "GraphImage").replace("Graph", "").upper()
                    })
                
                if posts:
                    feed_data = {
                        "posts": posts,
                        "username": INSTAGRAM_USERNAME,
                        "last_updated": datetime.now(timezone.utc).isoformat()
                    }
                    
                    # Update cache
                    await db.instagram_cache.update_one(
                        {"username": INSTAGRAM_USERNAME},
                        {"$set": feed_data},
                        upsert=True
                    )
                    
                    return feed_data
        
        # Return cached data if fresh fetch failed
        if cached:
            return cached
            
    except Exception as e:
        logger.error(f"Instagram fetch error: {e}")
        
        # Return cached data on error
        cached = await db.instagram_cache.find_one({"username": INSTAGRAM_USERNAME}, {"_id": 0})
        if cached:
            return cached
    
    # Final fallback - return empty
    return {
        "posts": [],
        "username": INSTAGRAM_USERNAME,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "error": "Could not fetch Instagram feed"
    }


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
