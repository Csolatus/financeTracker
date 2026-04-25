from .base import *

DEBUG = True

# ── Base de données (SQLite pour le dev) ───────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
