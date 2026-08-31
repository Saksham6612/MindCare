import json

en_file = 'frontend/src/locales/en/translation.json'
as_file = 'frontend/src/locales/as/translation.json'

with open(en_file, 'r') as f:
    en_data = json.load(f)

with open(as_file, 'r') as f:
    as_data = json.load(f)

en_additions = {
    "mockData": {
        "Calcium_Tablet_with_Lunch": "Calcium Tablet with Lunch",
        "Take_1_Calcium_tablet_after_warm_rice,_dal,_and_boiled_vegetables.": "Take 1 Calcium tablet after warm rice, dal, and boiled vegetables.",
        "Gentle_Verandah_Walk": "Gentle Verandah Walk",
        "15_minutes_of_slow_walking_in_the_garden_or_verandah_for_joint_health.": "15 minutes of slow walking in the garden or verandah for joint health.",
        "Night_Memory_Medicine": "Night Memory Medicine",
        "Take_Donepezil_5mg_tablet_with_warm_water_before_going_to_bed.": "Take Donepezil 5mg tablet with warm water before going to bed."
    }
}

as_additions = {
    "mockData": {
        "Calcium_Tablet_with_Lunch": "দুপৰীয়াৰ আহাৰৰ সৈতে কেলচিয়ামৰ বড়ি",
        "Take_1_Calcium_tablet_after_warm_rice,_dal,_and_boiled_vegetables.": "গৰম ভাত, দাইল আৰু সিজোৱা শাক-পাচলিৰ পিছত ১ টা কেলচিয়ামৰ বড়ি খাওক।",
        "Gentle_Verandah_Walk": "বাৰাণ্ডাত লাহে লাহে খোজকঢ়া",
        "15_minutes_of_slow_walking_in_the_garden_or_verandah_for_joint_health.": "গাঁঠিৰ স্বাস্থ্যৰ বাবে বাগিচা বা বাৰাণ্ডাত ১৫ মিনিট লাহে লাহে খোজ কাঢ়ক।",
        "Night_Memory_Medicine": "ৰাতিৰ স্মৃতিশক্তিৰ ঔষধ",
        "Take_Donepezil_5mg_tablet_with_warm_water_before_going_to_bed.": "শুবলৈ যোৱাৰ আগতে গৰম পানীৰে ডনেপেজিল 5mg বড়ি খাওক।"
    }
}

if "mockData" not in en_data:
    en_data["mockData"] = {}
en_data["mockData"].update(en_additions["mockData"])

if "mockData" not in as_data:
    as_data["mockData"] = {}
as_data["mockData"].update(as_additions["mockData"])

with open(en_file, 'w') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open(as_file, 'w') as f:
    json.dump(as_data, f, indent=2, ensure_ascii=False)

print("MockData JSONs updated.")
