# WikiGraph 

> Explore how knowledge connects.

WikiGraph is an interactive knowledge graph built from real Wikimedia Structured Contents data.

Instead of simply searching for an article, WikiGraph allows users to explore the relationships between Wikipedia topics through actual article-to-article links. Search for a topic, view its connected articles, and navigate through the knowledge graph interactively.

---
##  Live Demo

**Live Application:** https://wikigraph-app.vercel.app/

The frontend is deployed on Vercel and the FastAPI backend is deployed on Render.

##  Features

-  **Topic Search** — Search available Wikipedia articles using autocomplete.
-  **Interactive Knowledge Graph** — Visualize relationships between Wikipedia articles.
-  **Force-Directed Layout** — Related topics are dynamically arranged using D3 Force.
-  **Click-to-Explore** — Click a connected article to make it the focus of the graph.
-  **Article Information** — View article title, description, abstract, and connection count.
-  **Wikipedia Access** — Open the original Wikipedia article directly.
-  **Graph Statistics** — View the total number of articles and connections.
-  **Real Data** — Uses Wikimedia Structured Contents data instead of dummy or generated data.

---

##  How It Works

WikiGraph transforms structured Wikipedia content into an interactive graph.

```text
Wikimedia Structured Contents
            ↓
      Data Processing
            ↓
    Article Link Extraction
            ↓
       Graph Dataset
       ↙          ↘
   nodes.csv    edges.csv
       ↓            ↓
       FastAPI Backend
             ↓
       React Frontend
             ↓
        Interactive
         WikiGraph
```

The application extracts article-to-article links from Wikipedia section content and uses those relationships to construct the graph.

---

##  Dataset

WikiGraph uses the **Wikimedia Structured Contents** dataset available through Kaggle.

The original dataset is approximately 44 GB, so the complete dataset is not included in this repository.

Instead, the relevant English Wikipedia data was processed to create a compact graph dataset containing selected articles and their connections.

### Final Graph

| Metric | Value |
|---|---:|
| Articles | **106** |
| Connections | **742** |

The processed graph data is stored in:

```text
backend/data/
├── nodes.csv
└── edges.csv
```

### `nodes.csv`

Contains information about the articles in the graph:

- Article ID
- Article title
- Wikipedia URL
- Description
- Abstract

### `edges.csv`

Contains the relationships between articles:

- Source article
- Target article
- Connection information

---

##  Data Processing

The Wikimedia dataset was processed using Python and Polars in a Kaggle notebook.

The processing pipeline consists of:

1. Loading the Wikimedia Structured Contents dataset.
2. Selecting English Wikipedia article shards.
3. Identifying seed topics related to computer science and artificial intelligence.
4. Extracting article links from Wikipedia section content.
5. Identifying connected article titles.
6. Verifying candidate articles across the available Wikipedia shards.
7. Selecting the final set of articles for the graph.
8. Removing duplicate and self-connections.
9. Exporting the resulting graph into `nodes.csv` and `edges.csv`.

### Kaggle Notebook

The complete dataset preparation process is available here:

**[WikiGraph Dataset Preparation — Kaggle](https://www.kaggle.com/code/vijaya130/notebook1ebee481b2)**

---

##  Tech Stack

### Frontend

- React
- Vite
- React Flow
- D3 Force
- CSS

### Backend

- Python
- FastAPI
- Pandas

### Data Processing

- Python
- Polars
- Pandas
- Wikimedia Structured Contents
- Kaggle

---

##  Project Structure

```text
wikigraph/
│
├── backend/
│   ├── data/
│   │   ├── nodes.csv
│   │   └── edges.csv
│   │
│   └── main.py
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
└── README.md
```

---

##  Running Locally

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python 3
- Git

### 1. Clone the Repository

```bash
git https://github.com/Vijaya130/Wikigraph.git
cd wikigraph
```

### 2. Start the Backend

Open a terminal in the `backend` directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

#### Windows

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn pandas
```

Start the backend:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

The backend will run at:

```text
http://127.0.0.1:8001
```

### 3. Start the Frontend

Open another terminal in the project root:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

##  API Endpoints

The FastAPI backend provides the following endpoints:

| Endpoint | Description |
|---|---|
| `/` | Backend status |
| `/api/health` | API health check |
| `/api/nodes` | Returns graph nodes |
| `/api/edges` | Returns graph connections |

The frontend retrieves the processed graph data from these endpoints and renders it using React Flow.

---

##  Example Exploration

A typical WikiGraph exploration looks like:

```text
                Machine Learning
                 /      |      \
                /       |       \
       Deep Learning   AI    Neural Network
             |          |          |
             |          |          |
        Computer     Data Science   ...
         Vision
```

The actual graph layout is generated dynamically using a force-directed simulation.

Selecting a connected article makes that article the new focus of the graph, allowing the user to continue exploring the network.

---

##  Project Goal

Wikipedia contains a vast network of interconnected knowledge.

Traditional search presents articles primarily as individual results. WikiGraph provides a visual approach by showing how concepts are connected to one another.

The goal is to make relationships between topics easier to discover through interactive graph-based exploration.

---

##  Data Source & Attribution

This project uses data derived from the **Wikimedia Structured Contents** dataset.

The processed graph included in this repository is a filtered subset created specifically for the application.

Wikimedia and Wikipedia content remains subject to the applicable Wikimedia licensing and attribution requirements.

---

##  License

This project is provided for educational and demonstration purposes.

The application source code and Wikimedia-derived data may be subject to different licensing and attribution requirements.

##  Live Demo

[WikiGraph](https://wikigraph-app.vercel.app)
