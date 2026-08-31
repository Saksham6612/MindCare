import re

filepath = 'frontend/src/pages/Reminders.jsx'

with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (">Back to Home<", ">{t('voice.back_to_home')}<"),
    (">Today's Reminders<", ">{t('reminders.title')}<"),
    (">Add Reminder<", ">{t('reminders.add_reminder')}<"),
    (">Daily Progress<", ">{t('reminders.progress', { defaultValue: 'Daily Progress' })}<"),
    ("> done<", "> {t('reminders.done', { defaultValue: 'done' })}<"),
    ("No reminders for today yet.", "{t('reminders.empty_all', { defaultValue: 'No reminders for today yet.' })}"),
    ('Tap "Add Reminder" above to create one.', "{t('reminders.empty_sub', { defaultValue: 'Tap \"Add Reminder\" above to create one.' })}")
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
