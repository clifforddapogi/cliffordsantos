from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, Response, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


# ---------- helpers ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return user


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- pydantic models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class SiteContent(BaseModel):
    hero_eyebrow: str
    hero_name: str
    hero_title: str
    hero_tagline: str
    about_heading: str
    about_paragraphs: List[str]
    headshot_url: str
    location: str
    email: EmailStr
    phone: str
    resume_url: str
    socials: dict  # {facebook, twitter, linkedin, deviantart, instagram}
    footer_cta: str


class Project(BaseModel):
    id: Optional[str] = None
    title: str
    category: str  # "Logo" | "Web" | "Branding"
    description: str
    image_url: str
    year: Optional[str] = ""
    role: Optional[str] = ""
    tools: Optional[List[str]] = []
    featured: Optional[bool] = False
    order: Optional[int] = 0


class Experience(BaseModel):
    id: Optional[str] = None
    company: str
    title: str
    location: str
    start_date: str
    end_date: str
    bullets: List[str]
    order: Optional[int] = 0


class Education(BaseModel):
    id: Optional[str] = None
    institution: str
    degree: str
    location: str
    dates: str
    order: Optional[int] = 0


class SkillsGroup(BaseModel):
    groups: List[dict]  # [{name, items: []}]


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: str


# ---------- seeding ----------
DEFAULT_SITE = {
    "hero_eyebrow": "Toronto · Available for select work",
    "hero_name": "Clifford Santos",
    "hero_title": "Graphic Designer & Front-End Developer",
    "hero_tagline": "I make brands look sharp and websites feel inevitable. 10+ years of pixel-pushing across logos, landing pages, and ad-network platforms.",
    "about_heading": "Designer who codes. Coder who designs.",
    "about_paragraphs": [
        "I'm Clifford — a Toronto-based graphic designer and front-end developer with over a decade of experience inside one of the busiest ad-network environments in North America.",
        "At Bridge View Strategies (Grand Slam Media), I served as in-house designer for Adnium — a self-serve ad platform spanning dating, gaming, gambling, nutra, tube and AI verticals. I designed and shipped landing pages, brand systems, email campaigns, push notifications, tradeshow collateral, and product UX feedback — all while keeping the lights on as tier-2 tech support.",
        "I've been building websites since I made my first one in Notepad on Windows 98. I still chase that same feeling — the moment a layout clicks and a brand finds its voice.",
    ],
    "headshot_url": "https://images.unsplash.com/photo-1633625510483-c177f4308f33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjcmVhdGl2ZSUyMGdyYXBoaWMlMjBkZXNpZ25lciUyMG1hbGUlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDB8fHx8MTc3NzY3OTY0N3ww&ixlib=rb-4.1.0&q=85",
    "location": "Toronto, ON · Canada",
    "email": "clifforddapogi@gmail.com",
    "phone": "(647) 667-2183",
    "resume_url": "https://customer-assets.emergentagent.com/job_e4d7429d-db0c-444f-b5bb-7e19643073a7/artifacts/q673t5v6_Clifford%20Santos%20-%20Resume%202026.pdf",
    "socials": {
        "linkedin": "https://ca.linkedin.com/in/cliffordsantos",
        "facebook": "https://www.facebook.com/cliffordpangilinansantos",
        "twitter": "https://twitter.com/clifforddapogi",
        "deviantart": "http://clifforddapogi.deviantart.com/",
        "instagram": "",
    },
    "footer_cta": "Let's make something good.",
}

DEFAULT_EXPERIENCES = [
    {
        "id": str(uuid.uuid4()),
        "company": "Bridge View Strategies Inc. (Grand Slam Media)",
        "title": "In-House Graphic Designer / Customer Experience Associate",
        "location": "Toronto, ON",
        "start_date": "Mar 2016",
        "end_date": "Jan 2026",
        "bullets": [
            "Designed and coded landing pages with HTML5, CSS3, Bootstrap and WordPress for Adnium affiliate campaigns.",
            "Managed design production for SFW and NSFW campaigns while maintaining brand compliance.",
            "Built brand identities and visual systems for in-house products and partner companies.",
            "Implemented Zoho CRM and Mailchimp/Intercom email campaigns for publisher onboarding.",
            "Scheduled OneSignal push notification campaigns for affiliate marketing.",
            "Produced video loops, mailers, merchandise, and tradeshow materials.",
            "Provided tier-2 technical support and contributed UX insights during platform QA.",
        ],
        "order": 1,
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Lokeel",
        "title": "Digital Media & Marketing, Regional Lead",
        "location": "Toronto, ON",
        "start_date": "Mar 2015",
        "end_date": "Mar 2016",
        "bullets": [
            "Directed digital media strategy for a community discovery platform serving Toronto residents.",
            "Managed content creation and multi-channel marketing programs.",
        ],
        "order": 2,
    },
    {
        "id": str(uuid.uuid4()),
        "company": "Custom Virtual Solutions (Allied Web Design)",
        "title": "Front-End Web Developer",
        "location": "Baguio City, Philippines",
        "start_date": "Feb 2010",
        "end_date": "2011",
        "bullets": [
            "Converted Photoshop & Fireworks mockups into W3C-compliant semantic HTML/CSS sites.",
            "Built PHP-based contact forms and basic server-side integrations.",
            "Enhanced UX with custom JavaScript implementations.",
        ],
        "order": 3,
    },
    {
        "id": str(uuid.uuid4()),
        "company": "BCWebLab Inc.",
        "title": "Paid Intern · Junior Designer",
        "location": "Baguio City, Philippines",
        "start_date": "Aug 2008",
        "end_date": "Jun 2009",
        "bullets": [
            "Assisted in the creation, design, and redesign of websites.",
            "Contributed to logo development and branding projects.",
            "Collaborated with senior designers to deliver client-focused solutions.",
        ],
        "order": 4,
    },
]

DEFAULT_EDUCATION = [
    {
        "id": str(uuid.uuid4()),
        "institution": "Seneca Polytechnic",
        "degree": "Digital Graphic Design Certificate",
        "location": "Toronto, ON",
        "dates": "2015",
        "order": 1,
    },
    {
        "id": str(uuid.uuid4()),
        "institution": "Saint Louis University",
        "degree": "BS in Information Technology",
        "location": "Baguio City, Philippines",
        "dates": "2003 – 2008",
        "order": 2,
    },
    {
        "id": str(uuid.uuid4()),
        "institution": "University of Cordillera",
        "degree": "MS in Information Technology (incomplete)",
        "location": "Baguio City, Philippines",
        "dates": "2009 – 2011",
        "order": 3,
    },
]

DEFAULT_SKILLS = {
    "groups": [
        {"name": "Design", "items": ["Photoshop", "Illustrator", "InDesign", "Acrobat Pro", "Canva", "CapCut", "Biteable"]},
        {"name": "Development", "items": ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap", "PHP", "MySQL", "WordPress", "VS Code"]},
        {"name": "Marketing", "items": ["OneSignal", "Mailchimp", "Google Analytics", "Microsoft Clarity"]},
        {"name": "CRM & Support", "items": ["Intercom", "Zoho CRM"]},
        {"name": "AI Tools", "items": ["ChatGPT", "Claude", "Gemini"]},
        {"name": "Workflow", "items": ["Asana", "Trello", "Microsoft 365", "Google Workspace", "macOS", "Windows", "Ubuntu"]},
    ]
}


def _legacy(slug: str) -> str:
    return f"https://cliffordsantos.com/cliffordsantos/img/portfolio/thumb/{slug}"


DEFAULT_PROJECTS = [
    {"id": str(uuid.uuid4()), "title": "Jenny Gausto", "category": "Logo & Identity", "description": "A custom monogram and personal brand identity built around a flowing 'JG' ligature — feminine, confident, classic.", "image_url": _legacy("JFLogo.png"), "year": "2018", "role": "Brand Identity", "tools": ["Illustrator", "Photoshop"], "featured": False, "order": 1},
    {"id": str(uuid.uuid4()), "title": "Bakers Roofing", "category": "Logo & Identity", "description": "A bold, trade-friendly mark for a Toronto-area roofing company. Built to read clearly on trucks, signage, and uniforms.", "image_url": _legacy("BKLogoVer1.png"), "year": "2017", "role": "Brand Identity", "tools": ["Illustrator"], "featured": False, "order": 2},
    {"id": str(uuid.uuid4()), "title": "Guans Auto Service", "category": "Logo & Identity", "description": "A masculine, mechanical wordmark with chunky geometric forms — designed for a multi-bay auto shop.", "image_url": _legacy("GuansAutoServiceLogo.png"), "year": "2017", "role": "Brand Identity", "tools": ["Illustrator"], "featured": False, "order": 3},
    {"id": str(uuid.uuid4()), "title": "Bakers Roofing — Website", "category": "Web Design", "description": "Responsive WordPress website with custom landing sections, lead capture, and gallery for a roofing services company.", "image_url": _legacy("BKWebDesignSpecSpot.png"), "year": "2018", "role": "Design + Build", "tools": ["WordPress", "HTML5", "CSS3", "Bootstrap"], "featured": True, "order": 4},
    {"id": str(uuid.uuid4()), "title": "Guans Auto — Website", "category": "Web Design", "description": "Service-focused website with appointment booking and clear pricing — built on a custom WordPress theme.", "image_url": _legacy("GuansAutoServiceWebsite.png"), "year": "2018", "role": "Design + Build", "tools": ["WordPress", "HTML5", "CSS3"], "featured": True, "order": 5},
    {"id": str(uuid.uuid4()), "title": "Beverly Ann Dagulo", "category": "Logo & Identity", "description": "A modern personal monogram for a creative professional — refined letterforms with a soft hand-finished feel.", "image_url": _legacy("BADLogo.png"), "year": "2017", "role": "Brand Identity", "tools": ["Illustrator"], "featured": False, "order": 6},
    {"id": str(uuid.uuid4()), "title": "CS Self-Monogram", "category": "Logo & Identity", "description": "My personal mark — an interlocking 'C' and 'S' built on geometric grids. The reference point I keep coming back to.", "image_url": _legacy("SelfMonogramLogo.png"), "year": "2015", "role": "Self-Brand", "tools": ["Illustrator"], "featured": True, "order": 7},
    {"id": str(uuid.uuid4()), "title": "Numeral 9", "category": "Logo & Identity", "description": "A typographic study turned brand mark — exploring the negative space inside the numeral 9.", "image_url": _legacy("9Logo.png"), "year": "2016", "role": "Concept Mark", "tools": ["Illustrator"], "featured": False, "order": 8},
    {"id": str(uuid.uuid4()), "title": "Ginger Panda", "category": "Illustration", "description": "A character mark blending playful illustration with brand-ready geometry — built for a small lifestyle brand.", "image_url": _legacy("GingerPanda.png"), "year": "2016", "role": "Illustration & Mark", "tools": ["Illustrator", "Photoshop"], "featured": False, "order": 9},
    {"id": str(uuid.uuid4()), "title": "Lead Liger", "category": "Logo & Identity", "description": "A bold animal-mark with strong silhouette and modern typography — built for a marketing agency concept.", "image_url": _legacy("LeadLiger.png"), "year": "2017", "role": "Brand Identity", "tools": ["Illustrator"], "featured": False, "order": 10},
    {"id": str(uuid.uuid4()), "title": "Misty Crystal", "category": "Logo & Identity", "description": "A delicate wordmark with crystalline accents — for a wellness and lifestyle brand.", "image_url": _legacy("MistyCrystal.png"), "year": "2017", "role": "Brand Identity", "tools": ["Illustrator"], "featured": False, "order": 11},
    {"id": str(uuid.uuid4()), "title": "My Logo (Personal)", "category": "Logo & Identity", "description": "An earlier personal mark exploring asymmetry and weight contrast — a study that informed the current CS monogram.", "image_url": _legacy("MyLogo.png"), "year": "2014", "role": "Self-Brand", "tools": ["Illustrator"], "featured": False, "order": 12},
]


async def seed():
    # admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Clifford Santos",
            "role": "admin",
            "created_at": now_iso(),
        })
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )

    # site content
    if await db.site.count_documents({}) == 0:
        await db.site.insert_one({"_id": "main", **DEFAULT_SITE})

    # projects
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many([{**p} for p in DEFAULT_PROJECTS])

    # experience
    if await db.experiences.count_documents({}) == 0:
        await db.experiences.insert_many([{**e} for e in DEFAULT_EXPERIENCES])

    # education
    if await db.education.count_documents({}) == 0:
        await db.education.insert_many([{**e} for e in DEFAULT_EDUCATION])

    # skills
    if await db.skills.count_documents({}) == 0:
        await db.skills.insert_one({"_id": "main", **DEFAULT_SKILLS})

    # indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.projects.create_index("order")
        await db.experiences.create_index("order")
        await db.education.create_index("order")
    except Exception:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


# ---------- AUTH ----------
@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=False,
        samesite="lax", max_age=86400, path="/",
    )
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    }


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


# ---------- PUBLIC CONTENT ----------
@api.get("/site")
async def get_site():
    doc = await db.site.find_one({"_id": "main"})
    if not doc:
        raise HTTPException(404, "Site not initialized")
    doc.pop("_id", None)
    return doc


@api.get("/projects")
async def list_projects():
    cur = db.projects.find({}, {"_id": 0}).sort("order", 1)
    return [p async for p in cur]


@api.get("/experience")
async def list_experience():
    cur = db.experiences.find({}, {"_id": 0}).sort("order", 1)
    return [e async for e in cur]


@api.get("/education")
async def list_education():
    cur = db.education.find({}, {"_id": 0}).sort("order", 1)
    return [e async for e in cur]


@api.get("/skills")
async def get_skills():
    doc = await db.skills.find_one({"_id": "main"})
    if not doc:
        return {"groups": []}
    doc.pop("_id", None)
    return doc


@api.post("/contact")
async def submit_contact(payload: ContactIn):
    msg = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone or "",
        "message": payload.message,
        "created_at": now_iso(),
        "read": False,
    }
    await db.messages.insert_one(msg)
    return {"ok": True, "id": msg["id"]}


# ---------- ADMIN ----------
@api.put("/admin/site")
async def update_site(payload: SiteContent, user=Depends(get_current_admin)):
    data = payload.model_dump()
    await db.site.update_one({"_id": "main"}, {"$set": data}, upsert=True)
    return {"ok": True}


@api.post("/admin/projects")
async def create_project(payload: Project, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = data.get("id") or str(uuid.uuid4())
    await db.projects.insert_one({**data})
    return {"ok": True, "id": data["id"]}


@api.put("/admin/projects/{pid}")
async def update_project(pid: str, payload: Project, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = pid
    await db.projects.update_one({"id": pid}, {"$set": data}, upsert=True)
    return {"ok": True}


@api.delete("/admin/projects/{pid}")
async def delete_project(pid: str, user=Depends(get_current_admin)):
    await db.projects.delete_one({"id": pid})
    return {"ok": True}


@api.post("/admin/experience")
async def create_exp(payload: Experience, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = data.get("id") or str(uuid.uuid4())
    await db.experiences.insert_one({**data})
    return {"ok": True, "id": data["id"]}


@api.put("/admin/experience/{eid}")
async def update_exp(eid: str, payload: Experience, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = eid
    await db.experiences.update_one({"id": eid}, {"$set": data}, upsert=True)
    return {"ok": True}


@api.delete("/admin/experience/{eid}")
async def delete_exp(eid: str, user=Depends(get_current_admin)):
    await db.experiences.delete_one({"id": eid})
    return {"ok": True}


@api.post("/admin/education")
async def create_edu(payload: Education, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = data.get("id") or str(uuid.uuid4())
    await db.education.insert_one({**data})
    return {"ok": True, "id": data["id"]}


@api.put("/admin/education/{eid}")
async def update_edu(eid: str, payload: Education, user=Depends(get_current_admin)):
    data = payload.model_dump()
    data["id"] = eid
    await db.education.update_one({"id": eid}, {"$set": data}, upsert=True)
    return {"ok": True}


@api.delete("/admin/education/{eid}")
async def delete_edu(eid: str, user=Depends(get_current_admin)):
    await db.education.delete_one({"id": eid})
    return {"ok": True}


@api.put("/admin/skills")
async def update_skills(payload: SkillsGroup, user=Depends(get_current_admin)):
    await db.skills.update_one({"_id": "main"}, {"$set": payload.model_dump()}, upsert=True)
    return {"ok": True}


@api.get("/admin/messages")
async def list_messages(user=Depends(get_current_admin)):
    cur = db.messages.find({}, {"_id": 0}).sort("created_at", -1)
    return [m async for m in cur]


@api.delete("/admin/messages/{mid}")
async def delete_message(mid: str, user=Depends(get_current_admin)):
    await db.messages.delete_one({"id": mid})
    return {"ok": True}


@api.put("/admin/messages/{mid}/read")
async def mark_read(mid: str, user=Depends(get_current_admin)):
    await db.messages.update_one({"id": mid}, {"$set": {"read": True}})
    return {"ok": True}


@api.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(api)
