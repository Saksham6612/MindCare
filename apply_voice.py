import re

filepath = 'frontend/src/pages/VoiceAssistant.jsx'

with open(filepath, 'r') as f:
    content = f.read()

if "useTranslation" not in content:
    content = re.sub(r"(import React.*?;\n)", r"\1import { useTranslation } from 'react-i18next';\n", content, count=1)
    
hook_str = "  const { t } = useTranslation();\n"
if "const { t } =" not in content:
    content = re.sub(r"(export default function \w+\([^)]*\)\s*\{)", r"\1\n" + hook_str, content, count=1)

replacements = [
    (">Back to Home<", ">{t('voice.back_to_home')}<"),
    (">Voice Companion<", ">{t('voice.title')}<"),
    (">Tap the big purple microphone below and speak naturally.<", ">{t('voice.subtitle')}<"),
    (">MindCare Assistant<", ">{t('voice.assistant_title')}<"),
    ('"Stop listening"', 't("voice.stop_listening")'),
    ('"Start speaking to assistant"', 't("voice.start_speaking")'),
    ('"Listening... Speak now"', 't("voice.listening_status")'),
    ('"Tap Microphone to Speak"', 't("voice.tap_to_speak")'),
    ("Or tap any common question below:", "{t('voice.suggested_title')}")
]

for old, new in replacements:
    content = content.replace(old, new)
    
with open(filepath, 'w') as f:
    f.write(content)

print("VoiceAssistant.jsx updated")
