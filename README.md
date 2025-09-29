# vk-quiz-api (Vercel Serverless)

Мини-API для счётчиков теста (читает/пишет `data/stats.json` в репозитории `vk-quiz`).

## Эндпоинты
- `GET /api/stats?slug=detroit` → `{ total, A, B, C, D, E }`
- `POST /api/hit` → `{"slug":"detroit","key":"total"|"A"|"B"|"C"|"D"|"E"}` → `+1` и коммит

## Переменные окружения (Vercel → Project → Settings → Environment Variables)
- `GH_TOKEN`   — GitHub fine-grained token (Contents: Read/Write) для **vk-quiz**
- `GH_OWNER`   — `tessaothuaidh`
- `GH_REPO`    — `vk-quiz`
- `GH_BRANCH`  — `main`
- `STATS_PATH` — `data/stats.json`

## Файл в репозитории
Создай в `vk-quiz/data/stats.json`:
```json
{ "detroit": { "total": 172, "A": 29, "B": 27, "C": 20, "D": 8, "E": 88 } }
```

## CORS
Разрешены любые источники (`*`) — можно вызывать из GitHub Pages.

