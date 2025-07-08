from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase_client import get_tasks, add_task, delete_task, update_task
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class Task(BaseModel):
    title: str
    description: str
    status: str = "pending"

@app.get("/tasks")
async def read_tasks():
    tasks = await get_tasks()
    return tasks

@app.post("/tasks")
async def create_task(task: Task):
    print("Incoming Task:", task.dict())
    result = await add_task(task.title, task.description, task.status)
    print("Supabase Response:", result)

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result.get("text", "Unknown error"))

    return {"message": "Task added successfully!", "data": result}

@app.delete("/tasks/{task_id}")
async def remove_task(task_id: int):
    result = await delete_task(task_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result.get("text", "Unknown error"))
    return result

@app.put("/tasks/{task_id}")
async def modify_task(task_id: int, task: Task):
    result = await update_task(task_id, task.title, task.description, task.status)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result.get("text", "Unknown error"))
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)