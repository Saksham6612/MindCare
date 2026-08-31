import json
import os
import re

def process_file(filepath, replacements, namespace=""):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add import if needed
    if "useTranslation" not in content:
        content = re.sub(r"(import React.*?;\n)", r"\1import { useTranslation } from 'react-i18next';\n", content, count=1)
    
    # Add hook inside component
    # We find the main component by looking for "export default function" or "export default const"
    # Actually, simpler: find "export default function \w+\(.*\) {"
    hook_str = f"  const {{ t }} = useTranslation();\n"
    content = re.sub(r"(export default function \w+\([^)]*\)\s*\{)", r"\1\n" + hook_str, content, count=1)
    
    # Replace strings
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Ready")
