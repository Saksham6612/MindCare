import re
import os

filepath = 'frontend/src/pages/Games.jsx'

with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (">Games<", ">{t('games.title')}<"),
    (">Loading games...<", ">{t('common.loading')}<"),
    (">Cognitive Games<", ">{t('games.title')}<"),
    (">Choose a game to exercise your mind.<", ">{t('games.subtitle')}<"),
    (">Play Game<", ">{t('games.play_now')}<")
]

changed = False
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        changed = True

if changed:
    if "useTranslation" not in content:
        content = re.sub(r"(import React.*?;\n)", r"\1import { useTranslation } from 'react-i18next';\n", content, count=1)
        
    hook_str = "  const { t } = useTranslation();\n"
    if "const { t } =" not in content:
        content = re.sub(r"(export default function \w+\([^)]*\)\s*\{)", r"\1\n" + hook_str, content, count=1)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated {filepath}")
