import re
import os

files_to_update = {
    'frontend/src/pages/Reminders.jsx': [
        (">Reminders<", ">{t('reminders.title')}<"),
        (">Manage daily medicine, hydration, and appointments.<", ">{t('reminders.subtitle')}<"),
        (">Add New Reminder<", ">{t('reminders.add_new')}<"),
    ],
    'frontend/src/pages/Games.jsx': [
        (">Brain Games<", ">{t('games.title')}<"),
        (">Keep your mind active with fun exercises.<", ">{t('games.subtitle')}<")
    ],
    'frontend/src/pages/CaregiverDashboard.jsx': [
        (">Caregiver Dashboard<", ">{t('caregiver.title')}<"),
        (">Monitor activity and health metrics<", ">{t('caregiver.subtitle')}<")
    ],
    'frontend/src/components/home/MemorySpotlightCard.jsx': [
        (">Cherished Memory of the Day<", ">{t('memory_spotlight.cherished_memory')}<"),
        (">With:<", ">{t('memory_spotlight.with')}<"),
        (">Listen to Memory<", ">{t('memory_spotlight.listen')}<"),
        ('"Playing Audio Story..."', "t('memory_spotlight.playing_audio')"),
        (">I Remember This!<", ">{t('memory_spotlight.remember_this')}<"),
        (">I Remember!<", ">{t('memory_spotlight.remember')}<"),
    ],
    'frontend/src/components/caregiver/ActivityList.jsx': [
        (">Recent Activity<", ">{t('caregiver.recent_activity')}<")
    ],
    'frontend/src/components/caregiver/PerformanceChart.jsx': [
        (">Performance<", ">{t('caregiver.performance')}<")
    ],
    'frontend/src/components/caregiver/AlertCard.jsx': [
        (">Alerts<", ">{t('caregiver.alerts')}<")
    ],
    'frontend/src/components/caregiver/StatCard.jsx': [
        (">Quick Stats<", ">{t('caregiver.stats')}<")
    ],
    'frontend/src/components/games/GameCard.jsx': [
        (">Play Now<", ">{t('games.play_now')}<")
    ],
    'frontend/src/components/games/DifficultyBadge.jsx': [
        (">Difficulty<", ">{t('games.difficulty')}<")
    ],
    'frontend/src/components/reminders/ReminderCard.jsx': [
        (">Taken<", ">{t('reminders.status_taken')}<"),
        (">Pending<", ">{t('reminders.status_pending')}<")
    ],
    'frontend/src/components/reminders/AddReminderForm.jsx': [
        (">Type<", ">{t('reminders.type')}<"),
        (">Time<", ">{t('reminders.time')}<"),
        (">Medicine Name<", ">{t('reminders.medicine_name')}<"),
        (">Dosage<", ">{t('reminders.dosage')}<"),
        (">Frequency<", ">{t('reminders.frequency')}<"),
        (">Add Reminder<", ">{t('reminders.add_reminder')}<"),
        (">Cancel<", ">{t('reminders.cancel')}<"),
        (">Save<", ">{t('reminders.save')}<")
    ]
}

def apply_i18n():
    for filepath, replacements in files_to_update.items():
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r') as f:
            content = f.read()

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
                content = re.sub(r"(export default function \w+\([^)]*\)\s*\{|const \w+ = \([^)]*\) => \{)", r"\1\n" + hook_str, content, count=1)

            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {filepath}")

apply_i18n()
