from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

nodes_path = os.path.join(DATA_DIR, "nodes.csv")
edges_path = os.path.join(DATA_DIR, "edges.csv")

nodes_df = pd.read_csv(nodes_path)
edges_df = pd.read_csv(edges_path)


@app.get("/")
def home():
    return {"message": "WikiGraph backend is running!"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/nodes")
def get_nodes():
    return nodes_df.to_dict(orient="records")

@app.get("/api/edges")
def get_edges():
    return edges_df.to_dict(orient="records")