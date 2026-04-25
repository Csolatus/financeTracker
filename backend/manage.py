#!/usr/bin/env python3
"""Point d'entrée Django pour les commandes en ligne (migrations, serveur…)."""

import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "financetracker.settings.development")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django n'est pas installé ou le venv n'est pas activé."
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
