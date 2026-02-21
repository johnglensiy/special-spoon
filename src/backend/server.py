from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper import scrape_data 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/results")
def get_results():
    data = scrape_data()
    return data