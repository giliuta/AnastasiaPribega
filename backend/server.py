from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

# Configuration
INSTAGRAM_USERNAME = "pribega_brows_paphos"
TELEGRAM_BOT_TOKEN = "8250726160:AAECX4YHCIbT2LDBhMLUE_6hj13CUBRIMFM"
TELEGRAM_CHAT_ID = None  # Will be set dynamically

# Admin credentials
ADMIN_USERNAME = "Admin"
ADMIN_PASSWORD = "Admin"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============== TELEGRAM ==============
async def send_telegram_message(text: str):
    """Send message to Telegram"""
    try:
        # Get chat_id from database or use stored one
        settings = await db.settings.find_one({"key": "telegram"}, {"_id": 0})
        chat_id = settings.get("chat_id") if settings else None
        
        if not chat_id:
            logger.warning("Telegram chat_id not configured")
            return False
            
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(url, json={
                "chat_id": chat_id,
                "text": text,
                "parse_mode": "HTML"
            }, timeout=10.0)
            
            if response.status_code == 200:
                logger.info("Telegram message sent successfully")
                return True
            else:
                logger.error(f"Telegram error: {response.text}")
                return False
    except Exception as e:
        logger.error(f"Telegram send error: {e}")
        return False


# ============== AUTH ==============
def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Basic"})
    return credentials.username


# ============== MODELS ==============
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: Optional[str] = ""
    source: Optional[str] = "website"
    language: str = "ru"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class ContactCreate(BaseModel):
    name: str
    phone: Optional[str] = ""
    source: Optional[str] = "website"
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


class ServiceItem(BaseModel):
    name: str
    price: str


class ServiceCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_ru: str
    title_en: str
    items: List[ServiceItem]


class SettingsUpdate(BaseModel):
    telegram_chat_id: Optional[str] = None


class MediaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str = "img"  # img or vid
    src: str
    position: int = 0


class MediaConfig(BaseModel):
    portfolio: List[MediaItem] = []
    instagram: List[MediaItem] = []


# ============== HELPERS ==============
def get_brow_recommendation(face_shape, brow_density, desired_effect, lang="ru"):
    recommendations = {
        "ru": {
            "natural": "Мы рекомендуем натуральную коррекцию с подчёркиванием вашей природной формы.",
            "defined": "Вам подойдёт архитектурная коррекция с лёгким окрашиванием.",
            "dramatic": "Рекомендуем комплексную процедуру: коррекция + ламинирование с окрашиванием."
        },
        "en": {
            "natural": "We recommend natural correction that enhances your natural brow shape.",
            "defined": "An architectural correction with light tinting would suit you.",
            "dramatic": "We recommend a comprehensive treatment: correction + lamination with tinting."
        }
    }
    return recommendations.get(lang, recommendations["en"]).get(desired_effect, recommendations[lang]["natural"])


# ============== PUBLIC ENDPOINTS ==============
@api_router.get("/")
async def root():
    return {"message": "PRIBEGA API"}


@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(input_data: ContactCreate):
    submission = ContactSubmission(**input_data.model_dump())
    doc = submission.model_dump()
    await db.contacts.insert_one(doc)
    
    # Send to Telegram
    source_text = {
        "website": "Сайт",
        "academy": "Академия",
        "homepage": "Главная"
    }.get(input_data.source, input_data.source)
    
    telegram_msg = f"""
<b>Новая заявка PRIBEGA</b>

<b>Имя:</b> {input_data.name}
<b>Телефон:</b> {input_data.phone or 'Не указан'}
<b>Источник:</b> {source_text}
<b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
"""
    await send_telegram_message(telegram_msg)
    
    result = await db.contacts.find_one({"id": doc["id"]}, {"_id": 0})
    return result


@api_router.get("/contacts", response_model=List[ContactSubmission])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts


@api_router.post("/quiz", response_model=QuizResult)
async def submit_quiz(input_data: QuizCreate):
    recommendation = get_brow_recommendation(
        input_data.face_shape,
        input_data.brow_density,
        input_data.desired_effect
    )
    quiz_result = QuizResult(**input_data.model_dump(), recommendation=recommendation)
    doc = quiz_result.model_dump()
    await db.quiz_results.insert_one(doc)
    result = await db.quiz_results.find_one({"id": doc["id"]}, {"_id": 0})
    return result


@api_router.get("/quiz-results", response_model=List[QuizResult])
async def get_quiz_results():
    results = await db.quiz_results.find({}, {"_id": 0}).to_list(1000)
    return results


# ============== ADMIN ENDPOINTS ==============
@api_router.post("/admin/login")
async def admin_login(credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(credentials)
    return {"status": "success", "message": "Logged in"}


@api_router.get("/admin/stats")
async def admin_stats(username: str = Depends(verify_admin)):
    total_contacts = await db.contacts.count_documents({})
    new_contacts = await db.contacts.count_documents({"status": "new"})
    total_quiz = await db.quiz_results.count_documents({})
    
    # Get recent contacts
    recent = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "total_contacts": total_contacts,
        "new_contacts": new_contacts,
        "total_quiz": total_quiz,
        "recent_contacts": recent
    }


@api_router.get("/admin/contacts")
async def admin_get_contacts(username: str = Depends(verify_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts


@api_router.patch("/admin/contacts/{contact_id}")
async def admin_update_contact(contact_id: str, status: str, username: str = Depends(verify_admin)):
    await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status}})
    return {"status": "updated"}


@api_router.delete("/admin/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, username: str = Depends(verify_admin)):
    await db.contacts.delete_one({"id": contact_id})
    return {"status": "deleted"}


@api_router.get("/admin/services")
async def admin_get_services(username: str = Depends(verify_admin)):
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    if not services:
        # Return default services
        return get_default_services()
    return services


@api_router.put("/admin/services")
async def admin_update_services(services: List[ServiceCategory], username: str = Depends(verify_admin)):
    await db.services.delete_many({})
    for service in services:
        await db.services.insert_one(service.model_dump())
    return {"status": "updated"}


@api_router.get("/admin/settings")
async def admin_get_settings(username: str = Depends(verify_admin)):
    settings = await db.settings.find_one({"key": "telegram"}, {"_id": 0})
    return settings or {"key": "telegram", "chat_id": ""}


@api_router.put("/admin/settings")
async def admin_update_settings(settings: SettingsUpdate, username: str = Depends(verify_admin)):
    if settings.telegram_chat_id:
        await db.settings.update_one(
            {"key": "telegram"},
            {"$set": {"key": "telegram", "chat_id": settings.telegram_chat_id}},
            upsert=True
        )
    return {"status": "updated"}


@api_router.post("/admin/test-telegram")
async def admin_test_telegram(username: str = Depends(verify_admin)):
    success = await send_telegram_message("Тестовое сообщение от PRIBEGA Admin Panel")
    return {"success": success}


# ============== MEDIA MANAGEMENT ==============
DEFAULT_PORTFOLIO = [
    {"id": "1", "type": "img", "src": "pvqmbogu_pribega_brows_paphos_1728495274_3475192696521688954_7225780068.jpg", "position": 0},
    {"id": "2", "type": "img", "src": "x5yz2093_pribega_brows_paphos_1735906546_3537362954963173178_7225780068.jpg", "position": 1},
    {"id": "3", "type": "vid", "src": "2cjp4h54_pribega_brows_paphos_1744024220_3605458598025928199_7225780068.mp4", "position": 2},
    {"id": "4", "type": "img", "src": "nh1rw38t_pribega_brows_paphos_1742551484_3593104735692336233_7225780068.jpg", "position": 3},
    {"id": "5", "type": "img", "src": "03wjrhrp_pribega_brows_paphos_1746122179_3623057898775781846_7225780068.jpg", "position": 4},
    {"id": "6", "type": "img", "src": "zvwydfwn_pribega_brows_paphos_1746606220_3627118329668659589_7225780068.jpg", "position": 5},
    {"id": "7", "type": "vid", "src": "5ca010zd_pribega_brows_paphos_1745825571_3620569690473332598_7225780068.mp4", "position": 6},
    {"id": "8", "type": "img", "src": "8qaolxc5_pribega_brows_paphos_1747055311_3630885575490620422_7225780068.jpg", "position": 7},
    {"id": "9", "type": "img", "src": "rt4ac7nu_pribega_brows_paphos_1747912864_3638079246262784202_7225780068.jpg", "position": 8},
    {"id": "10", "type": "img", "src": "27kwzn5v_pribega_brows_paphos_1751438010_3667650317538195564_7225780068.jpg", "position": 9},
    {"id": "11", "type": "vid", "src": "o78ih1v5_pribega_brows_paphos_1748251085_3640915937742678132_7225780068.mp4", "position": 10},
    {"id": "12", "type": "img", "src": "adtzj41v_pribega_brows_paphos_1755161280_3698883372948880331_7225780068.jpg", "position": 11},
    {"id": "13", "type": "img", "src": "b1hm6e36_pribega_brows_paphos_1755248655_3699616324947209652_7225780068.jpg", "position": 12},
    {"id": "14", "type": "img", "src": "fbh4bs1b_pribega_brows_paphos_1756204128_3707631417343088414_7225780068.jpg", "position": 13},
    {"id": "15", "type": "img", "src": "7uytkg8w_pribega_brows_paphos_1757324649_3717031024350748519_7225780068.jpg", "position": 14},
    {"id": "16", "type": "img", "src": "hj6wj4q9_pribega_brows_paphos_1758702170_3728586510959151692_7225780068.jpg", "position": 15},
    {"id": "17", "type": "img", "src": "zl2sl36w_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg", "position": 16},
    {"id": "18", "type": "img", "src": "eq761617_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg", "position": 17},
]

DEFAULT_INSTAGRAM = [
    {"id": "i1", "type": "img", "src": "pvqmbogu_pribega_brows_paphos_1728495274_3475192696521688954_7225780068.jpg", "position": 0},
    {"id": "i2", "type": "img", "src": "zl2sl36w_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg", "position": 1},
    {"id": "i3", "type": "img", "src": "wze3e18a_pribega_brows_paphos_1758702170_3728586510959151692_7225780068.jpg", "position": 2},
    {"id": "i4", "type": "img", "src": "03wjrhrp_pribega_brows_paphos_1746122179_3623057898775781846_7225780068.jpg", "position": 3},
    {"id": "i5", "type": "img", "src": "zvwydfwn_pribega_brows_paphos_1746606220_3627118329668659589_7225780068.jpg", "position": 4},
    {"id": "i6", "type": "img", "src": "8qaolxc5_pribega_brows_paphos_1747055311_3630885575490620422_7225780068.jpg", "position": 5},
    {"id": "i7", "type": "img", "src": "rt4ac7nu_pribega_brows_paphos_1747912864_3638079246262784202_7225780068.jpg", "position": 6},
    {"id": "i8", "type": "img", "src": "27kwzn5v_pribega_brows_paphos_1751438010_3667650317538195564_7225780068.jpg", "position": 7},
]


@api_router.get("/admin/media")
async def admin_get_media(username: str = Depends(verify_admin)):
    """Get all media (portfolio and instagram)"""
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    if not media:
        return {
            "portfolio": DEFAULT_PORTFOLIO,
            "instagram": DEFAULT_INSTAGRAM
        }
    return {
        "portfolio": media.get("portfolio", DEFAULT_PORTFOLIO),
        "instagram": media.get("instagram", DEFAULT_INSTAGRAM)
    }


@api_router.put("/admin/media")
async def admin_update_media(config: MediaConfig, username: str = Depends(verify_admin)):
    """Update media configuration"""
    await db.media_config.update_one(
        {"key": "media"},
        {"$set": {
            "key": "media",
            "portfolio": [item.model_dump() for item in config.portfolio],
            "instagram": [item.model_dump() for item in config.instagram],
            "updated_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    return {"status": "updated"}


@api_router.put("/admin/media/instagram/{position}")
async def admin_update_instagram_photo(position: int, src: str, username: str = Depends(verify_admin)):
    """Update a single Instagram photo by position"""
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    instagram = media.get("instagram", DEFAULT_INSTAGRAM) if media else DEFAULT_INSTAGRAM
    
    if 0 <= position < len(instagram):
        instagram[position]["src"] = src
        await db.media_config.update_one(
            {"key": "media"},
            {"$set": {"instagram": instagram, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )
        return {"status": "updated", "position": position}
    raise HTTPException(status_code=400, detail="Invalid position")


@api_router.put("/admin/media/portfolio/{position}")
async def admin_update_portfolio_photo(position: int, src: str, username: str = Depends(verify_admin)):
    """Update a single portfolio photo by position"""
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    portfolio = media.get("portfolio", DEFAULT_PORTFOLIO) if media else DEFAULT_PORTFOLIO
    
    if 0 <= position < len(portfolio):
        portfolio[position]["src"] = src
        await db.media_config.update_one(
            {"key": "media"},
            {"$set": {"portfolio": portfolio, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )
        return {"status": "updated", "position": position}
    raise HTTPException(status_code=400, detail="Invalid position")


# Public endpoint for frontend to get media
@api_router.get("/media")
async def get_media():
    """Public endpoint - get media for display"""
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    if not media:
        return {
            "portfolio": DEFAULT_PORTFOLIO,
            "instagram": DEFAULT_INSTAGRAM
        }
    return {
        "portfolio": media.get("portfolio", DEFAULT_PORTFOLIO),
        "instagram": media.get("instagram", DEFAULT_INSTAGRAM)
    }


def get_default_services():
    return [
        {
            "id": "brows",
            "title_ru": "Брови",
            "title_en": "Brows",
            "items": [
                {"name": "Прореживание бровей", "price": "30€"},
                {"name": "Коррекция без окрашивания", "price": "30€"},
                {"name": "Коррекция с окрашиванием", "price": "35€"},
                {"name": "Ламинирование без окрашивания", "price": "40€"},
                {"name": "Ламинирование с окрашиванием", "price": "50€"},
            ]
        },
        {
            "id": "lashes",
            "title_ru": "Ресницы",
            "title_en": "Lashes",
            "items": [
                {"name": "Окрашивание ресниц", "price": "15€"},
                {"name": "Ламинирование без окрашивания", "price": "20€"},
                {"name": "Ламинирование с окрашиванием", "price": "30€"},
            ]
        },
        {
            "id": "complex",
            "title_ru": "Комплекс",
            "title_en": "Complex",
            "items": [
                {"name": "Ламинирование бровей + ресниц", "price": "70€"},
            ]
        },
        {
            "id": "additional",
            "title_ru": "Дополнительно",
            "title_en": "Additional",
            "items": [
                {"name": "Удаление нежелательных волосков", "price": "10€"},
            ]
        }
    ]


# ============== INSTAGRAM ==============
@api_router.get("/instagram/feed")
async def get_instagram_feed():
    try:
        cached = await db.instagram_cache.find_one({"username": INSTAGRAM_USERNAME}, {"_id": 0})
        if cached:
            cache_time = datetime.fromisoformat(cached.get("last_updated", "2000-01-01"))
            if (datetime.now(timezone.utc) - cache_time.replace(tzinfo=timezone.utc)).total_seconds() < 3600:
                return cached
        
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(
                f"https://www.instagram.com/api/v1/users/web_profile_info/?username={INSTAGRAM_USERNAME}",
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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
                        "caption": "",
                        "media_type": "IMAGE"
                    })
                
                if posts:
                    feed_data = {
                        "posts": posts,
                        "username": INSTAGRAM_USERNAME,
                        "last_updated": datetime.now(timezone.utc).isoformat()
                    }
                    await db.instagram_cache.update_one(
                        {"username": INSTAGRAM_USERNAME},
                        {"$set": feed_data},
                        upsert=True
                    )
                    return feed_data
        
        if cached:
            return cached
            
    except Exception as e:
        logger.error(f"Instagram fetch error: {e}")
        cached = await db.instagram_cache.find_one({"username": INSTAGRAM_USERNAME}, {"_id": 0})
        if cached:
            return cached
    
    return {
        "posts": [],
        "username": INSTAGRAM_USERNAME,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }


# ============== SERVICES PUBLIC ==============
@api_router.get("/services")
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    if not services:
        return get_default_services()
    return services


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
