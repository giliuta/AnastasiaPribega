from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import shutil
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
FRONTEND_BUILD = ROOT_DIR.parent / "frontend" / "build"

load_dotenv(ROOT_DIR / '.env')

# Railway/Production environment variables
mongo_url = os.environ.get('MONGO_URL') or os.environ.get('MONGODB_URL') or 'mongodb://localhost:27017'
db_name = os.environ.get('DB_NAME', 'pribega')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

TELEGRAM_BOT_TOKEN = "8250726160:AAECX4YHCIbT2LDBhMLUE_6hj13CUBRIMFM"
ADMIN_USERNAME = "Admin"
ADMIN_PASSWORD = "Admin"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============== TELEGRAM ==============
async def send_telegram_message(text: str):
    try:
        settings = await db.settings.find_one({"key": "telegram"}, {"_id": 0})
        chat_id = settings.get("chat_id") if settings else None
        if not chat_id:
            return False
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"}, timeout=10.0)
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Telegram error: {e}")
        return False

# ============== AUTH ==============
def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Basic"})
    return credentials.username

# ============== MODELS ==============
class ContactCreate(BaseModel):
    name: str
    phone: Optional[str] = ""
    source: Optional[str] = "website"
    language: str = "ru"

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text_ru: str
    text_en: str
    author: str
    rating: int = 5

class SocialLink(BaseModel):
    platform: str
    url: str
    enabled: bool = True

class ServiceItem(BaseModel):
    name: str
    price: str

class ServiceCategory(BaseModel):
    id: str
    title_ru: str
    title_en: str
    items: List[ServiceItem]

class SiteContent(BaseModel):
    # Hero
    hero_video: str = ""
    hero_title: str = "PRIBEGA"
    hero_subtitle_ru: str = "PRIVATE BROW & LASH STUDIO"
    hero_subtitle_en: str = "PRIVATE BROW & LASH STUDIO"
    hero_tagline_ru: str = "Только по записи"
    hero_tagline_en: str = "By appointment only"
    
    # Contact Info
    phone: str = "+357 97463797"
    phone_display: str = "+357 97 463 797"
    address_ru: str = "Пафос, Кипр"
    address_en: str = "Paphos, Cyprus"
    working_hours: str = "08:00 — 20:00"
    working_hours_label_ru: str = "ежедневно"
    working_hours_label_en: str = "daily"
    
    # About Page
    about_title_ru: str = "Анастасия Прибега"
    about_title_en: str = "Anastasia Pribega"
    about_text_ru: str = ""
    about_text_en: str = ""
    about_image: str = ""
    
    # Academy Page
    academy_title: str = "PRIBEGA ACADEMY"
    academy_description_ru: str = ""
    academy_description_en: str = ""
    academy_videos: List[str] = []
    academy_days_ru: List[str] = []
    academy_days_en: List[str] = []
    academy_includes_ru: List[str] = []
    academy_includes_en: List[str] = []
    
    # Stats
    stats_clients: int = 1000
    stats_label_ru: str = "Довольных клиентов"
    stats_label_en: str = "Happy Clients"

# ============== DEFAULT DATA ==============
DEFAULT_CONTENT = {
    "hero_video": "https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/q9bjmbbj_IMG_7319.MP4",
    "hero_title": "PRIBEGA",
    "hero_subtitle_ru": "PRIVATE BROW & LASH STUDIO",
    "hero_subtitle_en": "PRIVATE BROW & LASH STUDIO",
    "hero_tagline_ru": "Только по записи",
    "hero_tagline_en": "By appointment only",
    "phone": "+35797463797",
    "phone_display": "+357 97 463 797",
    "address_ru": "Пафос, Кипр",
    "address_en": "Paphos, Cyprus",
    "working_hours": "08:00 — 20:00",
    "working_hours_label_ru": "ежедневно",
    "working_hours_label_en": "daily",
    "about_title_ru": "Анастасия Прибега",
    "about_title_en": "Anastasia Pribega",
    "about_text_ru": "Мастер-бровист с многолетним опытом. Создаю идеальную архитектуру бровей, подчеркивающую вашу естественную красоту.",
    "about_text_en": "Brow artist with years of experience. I create perfect brow architecture that enhances your natural beauty.",
    "about_image": "",
    "academy_title": "PRIBEGA ACADEMY",
    "academy_description_ru": "Индивидуальное обучение по коррекции и окрашиванию бровей от Анастасии Прибеги. 3 дня интенсива — теория, демонстрация и полная практика на моделях.",
    "academy_description_en": "Individual brow correction and tinting training by Anastasia Pribega. 3 days of intensive study — theory, demonstration, and full hands-on practice.",
    "academy_videos": [
        "https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/f95gyrcp_1%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C.mp4",
        "https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/c3l5wvef_2%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C.mp4",
        "https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/3vxnzlah_3%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C.mp4",
        "https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/yizm8h9d_4%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C.mp4"
    ],
    "academy_days_ru": [
        "Теория: строение волоса, типы кожи, колористика, формы лица и подбор формы бровей",
        "Демонстрация на модели: полный процесс коррекции и окрашивания",
        "Практика: самостоятельная работа на 2-3 моделях под руководством"
    ],
    "academy_days_en": [
        "Theory: hair structure, skin types, color science, face shapes and brow shaping",
        "Demonstration on model: full correction and tinting process",
        "Practice: independent work on 2-3 models under supervision"
    ],
    "academy_includes_ru": [
        "Индивидуальное обучение",
        "Все материалы включены",
        "Сертификат по окончании",
        "Фото для портфолио",
        "Поддержка после обучения",
        "Список рекомендуемых материалов",
        "Секреты и лайфхаки от мастера",
        "Помощь в продвижении"
    ],
    "academy_includes_en": [
        "Individual training",
        "All materials included",
        "Certificate upon completion",
        "Portfolio photos",
        "Post-training support",
        "Recommended materials list",
        "Tips and tricks from the master",
        "Marketing assistance"
    ],
    "stats_clients": 1000,
    "stats_label_ru": "Довольных клиентов",
    "stats_label_en": "Happy Clients"
}

DEFAULT_REVIEWS = [
    {"id": "r1", "text_ru": "Анастасия — настоящий профессионал! Мои брови выглядят естественно и ухоженно.", "text_en": "Anastasia is a true professional! My brows look natural and well-groomed.", "author": "Мария К.", "rating": 5},
    {"id": "r2", "text_ru": "Лучший мастер на Кипре. Хожу уже год и всегда довольна результатом.", "text_en": "Best master in Cyprus. Been coming for a year and always happy with the result.", "author": "Елена С.", "rating": 5},
    {"id": "r3", "text_ru": "Наконец-то нашла своего мастера! Рекомендую всем.", "text_en": "Finally found my master! Recommend to everyone.", "author": "Анна В.", "rating": 5}
]

DEFAULT_SOCIALS = [
    {"platform": "instagram", "url": "https://www.instagram.com/pribega_brows_paphos", "enabled": True},
    {"platform": "tiktok", "url": "https://www.tiktok.com/@pribega_brows", "enabled": True},
    {"platform": "whatsapp", "url": "https://wa.me/35797463797", "enabled": True},
    {"platform": "phone", "url": "tel:+35797463797", "enabled": True},
    {"platform": "maps", "url": "https://maps.app.goo.gl/ipeyHYpxMbJ33gEAA", "enabled": True}
]

DEFAULT_SERVICES = [
    {"id": "brows", "title_ru": "Брови", "title_en": "Brows", "items": [
        {"name": "Коррекция без окрашивания", "price": "30€"},
        {"name": "Коррекция с окрашиванием", "price": "35€"},
        {"name": "Ламинирование без окрашивания", "price": "40€"},
        {"name": "Ламинирование с окрашиванием", "price": "50€"},
    ]},
    {"id": "lashes", "title_ru": "Ресницы", "title_en": "Lashes", "items": [
        {"name": "Окрашивание ресниц", "price": "15€"},
        {"name": "Ламинирование без окрашивания", "price": "20€"},
        {"name": "Ламинирование с окрашиванием", "price": "30€"},
    ]},
    {"id": "complex", "title_ru": "Комплекс", "title_en": "Complex", "items": [
        {"name": "Ламинирование бровей с окрашиванием и коррекцией + ламинирование ресниц с окрашиванием", "price": "70€"},
    ]},
    {"id": "additional", "title_ru": "Дополнительно", "title_en": "Additional", "items": [
        {"name": "Удаление нежелательных волосков", "price": "10€"},
    ]}
]

DEFAULT_PORTFOLIO = [
    {"id": "1", "type": "img", "src": "pvqmbogu_pribega_brows_paphos_1728495274_3475192696521688954_7225780068.jpg"},
    {"id": "2", "type": "img", "src": "x5yz2093_pribega_brows_paphos_1735906546_3537362954963173178_7225780068.jpg"},
    {"id": "3", "type": "vid", "src": "2cjp4h54_pribega_brows_paphos_1744024220_3605458598025928199_7225780068.mp4"},
    {"id": "4", "type": "img", "src": "nh1rw38t_pribega_brows_paphos_1742551484_3593104735692336233_7225780068.jpg"},
    {"id": "5", "type": "img", "src": "03wjrhrp_pribega_brows_paphos_1746122179_3623057898775781846_7225780068.jpg"},
    {"id": "6", "type": "img", "src": "zvwydfwn_pribega_brows_paphos_1746606220_3627118329668659589_7225780068.jpg"},
    {"id": "7", "type": "vid", "src": "5ca010zd_pribega_brows_paphos_1745825571_3620569690473332598_7225780068.mp4"},
    {"id": "8", "type": "img", "src": "8qaolxc5_pribega_brows_paphos_1747055311_3630885575490620422_7225780068.jpg"},
    {"id": "9", "type": "img", "src": "rt4ac7nu_pribega_brows_paphos_1747912864_3638079246262784202_7225780068.jpg"},
    {"id": "10", "type": "img", "src": "27kwzn5v_pribega_brows_paphos_1751438010_3667650317538195564_7225780068.jpg"},
    {"id": "11", "type": "vid", "src": "o78ih1v5_pribega_brows_paphos_1748251085_3640915937742678132_7225780068.mp4"},
    {"id": "12", "type": "img", "src": "adtzj41v_pribega_brows_paphos_1755161280_3698883372948880331_7225780068.jpg"},
    {"id": "13", "type": "img", "src": "b1hm6e36_pribega_brows_paphos_1755248655_3699616324947209652_7225780068.jpg"},
    {"id": "14", "type": "img", "src": "fbh4bs1b_pribega_brows_paphos_1756204128_3707631417343088414_7225780068.jpg"},
    {"id": "15", "type": "img", "src": "7uytkg8w_pribega_brows_paphos_1757324649_3717031024350748519_7225780068.jpg"},
    {"id": "16", "type": "img", "src": "hj6wj4q9_pribega_brows_paphos_1758702170_3728586510959151692_7225780068.jpg"},
    {"id": "17", "type": "img", "src": "zl2sl36w_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg"},
    {"id": "18", "type": "img", "src": "eq761617_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg"},
]

DEFAULT_INSTAGRAM = [
    {"id": "i1", "type": "img", "src": "pvqmbogu_pribega_brows_paphos_1728495274_3475192696521688954_7225780068.jpg"},
    {"id": "i2", "type": "img", "src": "zl2sl36w_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg"},
    {"id": "i3", "type": "img", "src": "wze3e18a_pribega_brows_paphos_1758702170_3728586510959151692_7225780068.jpg"},
    {"id": "i4", "type": "img", "src": "03wjrhrp_pribega_brows_paphos_1746122179_3623057898775781846_7225780068.jpg"},
    {"id": "i5", "type": "img", "src": "zvwydfwn_pribega_brows_paphos_1746606220_3627118329668659589_7225780068.jpg"},
    {"id": "i6", "type": "img", "src": "8qaolxc5_pribega_brows_paphos_1747055311_3630885575490620422_7225780068.jpg"},
    {"id": "i7", "type": "img", "src": "rt4ac7nu_pribega_brows_paphos_1747912864_3638079246262784202_7225780068.jpg"},
    {"id": "i8", "type": "img", "src": "27kwzn5v_pribega_brows_paphos_1751438010_3667650317538195564_7225780068.jpg"},
]

# ============== PUBLIC API ==============
@api_router.get("/")
async def root():
    return {"message": "PRIBEGA API"}

@api_router.post("/contact")
async def submit_contact(data: ContactCreate):
    contact = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "phone": data.phone,
        "source": data.source,
        "language": data.language,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new"
    }
    await db.contacts.insert_one(contact)
    
    source_text = {"website": "Сайт", "academy": "Академия", "homepage": "Главная", "contact": "Контакты"}.get(data.source, data.source)
    await send_telegram_message(f"<b>Новая заявка PRIBEGA</b>\n\n<b>Имя:</b> {data.name}\n<b>Телефон:</b> {data.phone or 'Не указан'}\n<b>Источник:</b> {source_text}\n<b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}")
    
    return {"id": contact["id"], "status": "success"}

@api_router.get("/content")
async def get_content():
    content = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    return content or DEFAULT_CONTENT

@api_router.get("/reviews")
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(100)
    return reviews if reviews else DEFAULT_REVIEWS

@api_router.get("/socials")
async def get_socials():
    socials = await db.socials.find({}, {"_id": 0}).to_list(100)
    return socials if socials else DEFAULT_SOCIALS

@api_router.get("/services")
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services if services else DEFAULT_SERVICES

@api_router.get("/media")
async def get_media():
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    return {
        "portfolio": media.get("portfolio", DEFAULT_PORTFOLIO) if media else DEFAULT_PORTFOLIO,
        "instagram": media.get("instagram", DEFAULT_INSTAGRAM) if media else DEFAULT_INSTAGRAM
    }

# ============== ADMIN API ==============
@api_router.post("/admin/login")
async def admin_login(credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(credentials)
    return {"status": "success"}

@api_router.get("/admin/stats")
async def admin_stats(username: str = Depends(verify_admin)):
    total_contacts = await db.contacts.count_documents({})
    new_contacts = await db.contacts.count_documents({"status": "new"})
    return {"total_contacts": total_contacts, "new_contacts": new_contacts}

@api_router.get("/admin/contacts")
async def admin_get_contacts(username: str = Depends(verify_admin)):
    return await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api_router.patch("/admin/contacts/{contact_id}")
async def admin_update_contact(contact_id: str, status: str, username: str = Depends(verify_admin)):
    await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status}})
    return {"status": "updated"}

@api_router.delete("/admin/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, username: str = Depends(verify_admin)):
    await db.contacts.delete_one({"id": contact_id})
    return {"status": "deleted"}

# Content Management
@api_router.get("/admin/content")
async def admin_get_content(username: str = Depends(verify_admin)):
    content = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    return content or DEFAULT_CONTENT

@api_router.put("/admin/content")
async def admin_update_content(content: dict, username: str = Depends(verify_admin)):
    content["key"] = "main"
    content["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.site_content.update_one({"key": "main"}, {"$set": content}, upsert=True)
    return {"status": "updated"}

# Reviews Management
@api_router.get("/admin/reviews")
async def admin_get_reviews(username: str = Depends(verify_admin)):
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(100)
    return reviews if reviews else DEFAULT_REVIEWS

@api_router.put("/admin/reviews")
async def admin_update_reviews(reviews: List[Review], username: str = Depends(verify_admin)):
    await db.reviews.delete_many({})
    for r in reviews:
        await db.reviews.insert_one(r.model_dump())
    return {"status": "updated"}

@api_router.post("/admin/reviews")
async def admin_add_review(review: Review, username: str = Depends(verify_admin)):
    await db.reviews.insert_one(review.model_dump())
    return {"status": "added", "id": review.id}

@api_router.delete("/admin/reviews/{review_id}")
async def admin_delete_review(review_id: str, username: str = Depends(verify_admin)):
    await db.reviews.delete_one({"id": review_id})
    return {"status": "deleted"}

# Socials Management
@api_router.get("/admin/socials")
async def admin_get_socials(username: str = Depends(verify_admin)):
    socials = await db.socials.find({}, {"_id": 0}).to_list(100)
    return socials if socials else DEFAULT_SOCIALS

@api_router.put("/admin/socials")
async def admin_update_socials(socials: List[SocialLink], username: str = Depends(verify_admin)):
    await db.socials.delete_many({})
    for s in socials:
        await db.socials.insert_one(s.model_dump())
    return {"status": "updated"}

# Services Management
@api_router.get("/admin/services")
async def admin_get_services(username: str = Depends(verify_admin)):
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services if services else DEFAULT_SERVICES

@api_router.put("/admin/services")
async def admin_update_services(services: List[ServiceCategory], username: str = Depends(verify_admin)):
    await db.services.delete_many({})
    for s in services:
        await db.services.insert_one(s.model_dump())
    return {"status": "updated"}

# Media Management
@api_router.get("/admin/media")
async def admin_get_media(username: str = Depends(verify_admin)):
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    return {
        "portfolio": media.get("portfolio", DEFAULT_PORTFOLIO) if media else DEFAULT_PORTFOLIO,
        "instagram": media.get("instagram", DEFAULT_INSTAGRAM) if media else DEFAULT_INSTAGRAM
    }

@api_router.put("/admin/media")
async def admin_update_media(media: dict, username: str = Depends(verify_admin)):
    media["key"] = "media"
    media["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.media_config.update_one({"key": "media"}, {"$set": media}, upsert=True)
    return {"status": "updated"}

@api_router.put("/admin/media/instagram/{position}")
async def admin_update_instagram_photo(position: int, src: str, username: str = Depends(verify_admin)):
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    instagram = media.get("instagram", DEFAULT_INSTAGRAM) if media else DEFAULT_INSTAGRAM
    if 0 <= position < len(instagram):
        instagram[position]["src"] = src
        await db.media_config.update_one({"key": "media"}, {"$set": {"instagram": instagram}}, upsert=True)
        return {"status": "updated"}
    raise HTTPException(status_code=400, detail="Invalid position")

@api_router.put("/admin/media/portfolio/{position}")
async def admin_update_portfolio_photo(position: int, src: str, username: str = Depends(verify_admin)):
    media = await db.media_config.find_one({"key": "media"}, {"_id": 0})
    portfolio = media.get("portfolio", DEFAULT_PORTFOLIO) if media else DEFAULT_PORTFOLIO
    if 0 <= position < len(portfolio):
        portfolio[position]["src"] = src
        await db.media_config.update_one({"key": "media"}, {"$set": {"portfolio": portfolio}}, upsert=True)
        return {"status": "updated"}
    raise HTTPException(status_code=400, detail="Invalid position")

# Settings Management
@api_router.get("/admin/settings")
async def admin_get_settings(username: str = Depends(verify_admin)):
    settings = await db.settings.find_one({"key": "telegram"}, {"_id": 0})
    return settings or {"chat_id": ""}

@api_router.put("/admin/settings")
async def admin_update_settings(settings: dict, username: str = Depends(verify_admin)):
    if "telegram_chat_id" in settings:
        await db.settings.update_one({"key": "telegram"}, {"$set": {"key": "telegram", "chat_id": settings["telegram_chat_id"]}}, upsert=True)
    return {"status": "updated"}

@api_router.post("/admin/test-telegram")
async def admin_test_telegram(username: str = Depends(verify_admin)):
    success = await send_telegram_message("Тестовое сообщение от PRIBEGA Admin Panel")
    return {"success": success}

# File Upload
@api_router.post("/admin/upload")
async def admin_upload_file(file: UploadFile = File(...), username: str = Depends(verify_admin)):
    """Upload image/video file"""
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {allowed_extensions}")
    
    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = UPLOADS_DIR / unique_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": unique_name, "url": f"/api/uploads/{unique_name}"}

# ============== APP SETUP ==============
app.include_router(api_router)

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React frontend (for production)
if FRONTEND_BUILD.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_BUILD / "static")), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        # Serve index.html for all non-API routes (React Router)
        file_path = FRONTEND_BUILD / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_BUILD / "index.html")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

