import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_HEADERS = {
    "apikey" : SUPABASE_KEY,
    "Authorization" : f"Bearer {SUPABASE_KEY}",
    "Content-Type" : "application/json"
}

async def get_tasks():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SUPABASE_URL}/rest/v1/tasks?order=id.asc", headers=SUPABASE_HEADERS)
        return response.json()


async def add_task(title: str, description: str, status: str = "pending"):
    payload = {
        "title": title,
        "description": description,
        "status": status
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/tasks",
            headers=SUPABASE_HEADERS,
            json=payload
        )

    # Safely handle response
    if response.status_code == 201:
        try:
            return response.json()
        except Exception:
            return {"message": "Task added successfully, but Supabase returned no JSON."}
    else:
        return {
            "error": "Supabase error",
            "status": response.status_code,
            "text": response.text
        }


async def delete_task(task_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/tasks?id=eq.{task_id}",
            headers=SUPABASE_HEADERS
        )

    if response.status_code == 204:
        return {"message": "Task deleted successfully"}
    else:
        return {
            "error": "Failed to delete task",
            "status": response.status_code,
            "text": response.text
        }


async def update_task(task_id: int, title: str, description: str, status: str):
    payload = {
        "title": title,
        "description": description,
        "status": status
    }

    async with httpx.AsyncClient() as client:
        response = await client.patch(
            f"{SUPABASE_URL}/rest/v1/tasks?id=eq.{task_id}",
            headers=SUPABASE_HEADERS,
            json=payload
        )

    if response.status_code == 204:
        return {"message": "Task updated successfully"}
    else:
        return {
            "error": "Failed to update task",
            "status": response.status_code,
            "text": response.text
        }
