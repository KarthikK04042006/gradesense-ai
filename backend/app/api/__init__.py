from fastapi import APIRouter
from app.api import predict, recommend, history, chat, cost, explain, simulator, feedback

api_router = APIRouter()
api_router.include_router(predict.router)
api_router.include_router(recommend.router)
api_router.include_router(history.router)
api_router.include_router(chat.router)
api_router.include_router(cost.router)
api_router.include_router(explain.router)
api_router.include_router(simulator.router)
api_router.include_router(feedback.router)
