"""Backend API tests for Clifford Santos Portfolio."""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv

# Load credentials from backend .env (kept out of git via .gitignore patterns)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else os.environ.get("BACKEND_URL", "http://localhost:8001").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


# ---------- HEALTH ----------
class TestHealth:
    def test_health(self, api):
        r = api.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}


# ---------- PUBLIC CONTENT ----------
class TestPublicContent:
    def test_site(self, api):
        r = api.get(f"{BASE_URL}/api/site")
        assert r.status_code == 200
        d = r.json()
        assert d["hero_name"] == "Clifford Santos"
        assert d["email"] == "clifforddapogi@gmail.com"
        assert "_id" not in d
        assert isinstance(d["about_paragraphs"], list)
        assert "socials" in d

    def test_projects_12(self, api):
        r = api.get(f"{BASE_URL}/api/projects")
        assert r.status_code == 200
        projects = r.json()
        assert len(projects) >= 12, f"Expected >=12, got {len(projects)}"
        for p in projects:
            assert "_id" not in p
            assert "id" in p
            assert "title" in p

    def test_experience_4(self, api):
        r = api.get(f"{BASE_URL}/api/experience")
        assert r.status_code == 200
        exps = r.json()
        assert len(exps) >= 4
        for e in exps:
            assert "_id" not in e
            assert "company" in e

    def test_education_3(self, api):
        r = api.get(f"{BASE_URL}/api/education")
        assert r.status_code == 200
        eds = r.json()
        assert len(eds) >= 3

    def test_skills_6(self, api):
        r = api.get(f"{BASE_URL}/api/skills")
        assert r.status_code == 200
        d = r.json()
        assert "groups" in d
        assert len(d["groups"]) >= 6


# ---------- CONTACT ----------
class TestContact:
    def test_submit_contact(self, api, auth_headers):
        payload = {
            "name": "TEST_Contact User",
            "email": "test_contact@example.com",
            "phone": "555-1234",
            "message": "TEST message from automated tests",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] == True  # noqa: E712
        msg_id = body["id"]

        # Verify it appears in admin messages
        r2 = requests.get(f"{BASE_URL}/api/admin/messages", headers=auth_headers)
        assert r2.status_code == 200
        msgs = r2.json()
        assert any(m["id"] == msg_id and m["name"] == "TEST_Contact User" for m in msgs)

        # cleanup
        requests.delete(f"{BASE_URL}/api/admin/messages/{msg_id}", headers=auth_headers)

    def test_contact_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={"name": "x", "email": "notanemail", "message": "x"})
        assert r.status_code == 422


# ---------- AUTH ----------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert "token" in d
        assert d["user"]["email"] == ADMIN_EMAIL
        assert d["user"]["role"] == "admin"
        # cookie set
        assert "access_token" in r.cookies

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, api, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401


# ---------- ADMIN PROTECTED ----------
class TestAdminProtection:
    def test_put_site_unauth(self):
        r = requests.put(f"{BASE_URL}/api/admin/site", json={})
        assert r.status_code == 401

    def test_create_project_unauth(self):
        r = requests.post(f"{BASE_URL}/api/admin/projects", json={})
        assert r.status_code == 401

    def test_messages_unauth(self):
        r = requests.get(f"{BASE_URL}/api/admin/messages")
        assert r.status_code == 401


# ---------- ADMIN CRUD ----------
class TestAdminProjectsCRUD:
    def test_create_update_delete_project(self, auth_headers):
        # Create
        new_p = {
            "title": "TEST_Project_" + uuid.uuid4().hex[:6],
            "category": "Logo",
            "description": "Test description",
            "image_url": "https://example.com/img.png",
            "year": "2026",
            "role": "Test",
            "tools": ["Figma"],
            "featured": False,
            "order": 99,
        }
        r = requests.post(f"{BASE_URL}/api/admin/projects", headers=auth_headers, json=new_p)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]

        # Verify in public list
        r2 = requests.get(f"{BASE_URL}/api/projects")
        assert any(p["id"] == pid for p in r2.json())

        # Update
        new_p["title"] = "TEST_Project_Updated"
        r3 = requests.put(f"{BASE_URL}/api/admin/projects/{pid}", headers=auth_headers, json=new_p)
        assert r3.status_code == 200

        r4 = requests.get(f"{BASE_URL}/api/projects")
        updated = next(p for p in r4.json() if p["id"] == pid)
        assert updated["title"] == "TEST_Project_Updated"

        # Delete
        r5 = requests.delete(f"{BASE_URL}/api/admin/projects/{pid}", headers=auth_headers)
        assert r5.status_code == 200
        r6 = requests.get(f"{BASE_URL}/api/projects")
        assert not any(p["id"] == pid for p in r6.json())


class TestAdminSiteUpdate:
    def test_update_site(self, auth_headers):
        # fetch
        cur = requests.get(f"{BASE_URL}/api/site").json()
        original_eyebrow = cur["hero_eyebrow"]
        cur["hero_eyebrow"] = "TEST_eyebrow"
        r = requests.put(f"{BASE_URL}/api/admin/site", headers=auth_headers, json=cur)
        assert r.status_code == 200, r.text
        # verify
        new = requests.get(f"{BASE_URL}/api/site").json()
        assert new["hero_eyebrow"] == "TEST_eyebrow"
        # restore
        new["hero_eyebrow"] = original_eyebrow
        requests.put(f"{BASE_URL}/api/admin/site", headers=auth_headers, json=new)


class TestAdminSkillsUpdate:
    def test_update_skills(self, auth_headers):
        cur = requests.get(f"{BASE_URL}/api/skills").json()
        original = cur["groups"]
        new_groups = original + [{"name": "TEST_Group", "items": ["x"]}]
        r = requests.put(f"{BASE_URL}/api/admin/skills", headers=auth_headers, json={"groups": new_groups})
        assert r.status_code == 200
        after = requests.get(f"{BASE_URL}/api/skills").json()
        assert any(g["name"] == "TEST_Group" for g in after["groups"])
        # restore
        requests.put(f"{BASE_URL}/api/admin/skills", headers=auth_headers, json={"groups": original})


class TestAdminMessagesCRUD:
    def test_messages_lifecycle(self, auth_headers):
        # create via contact
        payload = {"name": "TEST_msg", "email": "msg@test.com", "phone": "", "message": "hello"}
        r = requests.post(f"{BASE_URL}/api/contact", json=payload)
        mid = r.json()["id"]
        # mark read
        r2 = requests.put(f"{BASE_URL}/api/admin/messages/{mid}/read", headers=auth_headers)
        assert r2.status_code == 200
        msgs = requests.get(f"{BASE_URL}/api/admin/messages", headers=auth_headers).json()
        m = next(m for m in msgs if m["id"] == mid)
        assert m["read"] == True  # noqa: E712
        # delete
        r3 = requests.delete(f"{BASE_URL}/api/admin/messages/{mid}", headers=auth_headers)
        assert r3.status_code == 200
