"""Point d'entrée WSGI — utilisé par les serveurs de production (Gunicorn…)."""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "financetracker.settings.production")

application = get_wsgi_application()
