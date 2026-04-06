import requests
SUPABASE_URL = "https://uycasuilllmwuqjkauou.supabase.co"
SUPABASE_KEY = "sb_publishable_5iMKJSMVnh5ckzbU6z2YVw_qPBxXWTr"
HEADERS = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
res = requests.get(f"{SUPABASE_URL}/rest/v1/properties?select=title,image_url", headers=HEADERS)
for p in res.json():
    img = "HAS IMAGE" if p.get("image_url") else "NO IMAGE"
    print(img, "-", p["title"])
