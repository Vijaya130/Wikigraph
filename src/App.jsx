import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from "d3-force";

import "@xyflow/react/dist/style.css";

function App() {
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [layoutNodes, setLayoutNodes] = useState([]);

  // Fetch graph data from backend
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8001/api/nodes").then((res) => res.json()),
      fetch("http://127.0.0.1:8001/api/edges").then((res) => res.json()),
    ]).then(([nodes, edges]) => {
      setAllNodes(nodes);
      setAllEdges(edges);
    });
  }, []);

  // Search suggestions
  const suggestions =
    search.trim() === ""
      ? []
      : allNodes
          .filter((node) =>
            node.title.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6);

  // Find the article matching the search
  const selectedNode =
    search.trim() === ""
      ? null
      : allNodes.find(
          (node) => node.title.toLowerCase() === search.toLowerCase()
        ) ||
        allNodes.find((node) =>
          node.title.toLowerCase().includes(search.toLowerCase())
        );

  const selectedId = selectedNode ? String(selectedNode.id) : null;

  // Find the selected node's direct connections
  const connectedIds = new Set();

  if (selectedId) {
    connectedIds.add(selectedId);

    allEdges.forEach((edge) => {
      const source = String(edge.source);
      const target = String(edge.target);

      if (source === selectedId) {
        connectedIds.add(target);
      }

      if (target === selectedId) {
        connectedIds.add(source);
      }
    });
  }

  const connectedNodes = allNodes.filter((node) =>
    connectedIds.has(String(node.id))
  );

  const visibleEdges = allEdges
    .filter(
      (edge) =>
        String(edge.source) === selectedId ||
        String(edge.target) === selectedId
    )
    .map((edge, index) => ({
      id: `edge-${index}`,
      source: String(edge.source),
      target: String(edge.target),
      className: "graph-edge",
    }));

  // Create force-directed layout
  useEffect(() => {
    if (!selectedId || connectedNodes.length === 0) {
      setLayoutNodes([]);
      return;
    }

    const simulationNodes = connectedNodes.map((node, index) => ({
      id: String(node.id),
      x:
        String(node.id) === selectedId
          ? 0
          : Math.cos(index) * 300,
      y:
        String(node.id) === selectedId
          ? 0
          : Math.sin(index) * 300,
    }));

    const simulationLinks = visibleEdges.map((edge) => ({
      source: String(edge.source),
      target: String(edge.target),
    }));

    const simulation = forceSimulation(simulationNodes)
      .force(
        "link",
        forceLink(simulationLinks)
          .id((node) => node.id)
          .distance(220)
          .strength(0.7)
      )
      .force(
        "charge",
        forceManyBody().strength(-500)
      )
      .force(
        "center",
        forceCenter(0, 0)
      )
      .force(
        "collision",
        forceCollide(90)
      )
      .stop();

    // Run the simulation before displaying it
    for (let i = 0; i < 250; i++) {
      simulation.tick();
    }

    simulation.stop();

    // Keep the selected article exactly in the center
    const mainNode = simulationNodes.find(
      (node) => node.id === selectedId
    );

    const offsetX = mainNode ? mainNode.x : 0;
    const offsetY = mainNode ? mainNode.y : 0;

    const positionedNodes = connectedNodes.map((node) => {
      const simulated = simulationNodes.find(
        (item) => item.id === String(node.id)
      );

      const isSelected = String(node.id) === selectedId;

      return {
        id: String(node.id),
        position: isSelected
          ? { x: 0, y: 0 }
          : {
              x: simulated.x - offsetX,
              y: simulated.y - offsetY,
            },
        data: {
          label: node.title,
        },
        className: isSelected
          ? "main-node"
          : "article-node",
      };
    });

    setLayoutNodes(positionedNodes);
  }, [selectedId, allNodes, allEdges]);

  // Clicking a graph node
  const handleNodeClick = (_, node) => {
    const article = allNodes.find(
      (item) => String(item.id) === String(node.id)
    );

    if (article) {
      setSelectedArticle(article);
      setSearch(article.title);
      setShowSuggestions(false);
    }
  };

  // Clicking a search suggestion
  const handleSuggestionClick = (article) => {
    setSearch(article.title);
    setSelectedArticle(article);
    setShowSuggestions(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>WikiGraph</h1>
          <p>Explore how knowledge connects.</p>
        </div>

        <div className="stats">
          <strong>{allNodes.length}</strong> Articles
          <span>•</span>
          <strong>{allEdges.length}</strong> Connections
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Wikipedia topics..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
            setSelectedArticle(null);
          }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((article) => (
              <button
                key={article.id}
                className="suggestion"
                onClick={() => handleSuggestionClick(article)}
              >
                {article.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <ReactFlow
        nodes={layoutNodes}
        edges={visibleEdges}
        fitView
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedArticle && (
        <aside className="article-panel">
          <button
            className="close-button"
            onClick={() => setSelectedArticle(null)}
          >
            ×
          </button>

          <h2>{selectedArticle.title}</h2>

          {selectedArticle.description && (
            <p className="article-description">
              {selectedArticle.description}
            </p>
          )}

          <p className="connection-count">
            {
              allEdges.filter(
                (edge) =>
                  String(edge.source) === String(selectedArticle.id) ||
                  String(edge.target) === String(selectedArticle.id)
              ).length
            }{" "}
            Connections
          </p>

          {selectedArticle.abstract && (
            <p className="article-abstract">
              {selectedArticle.abstract}
            </p>
          )}

          {selectedArticle.url && (
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noreferrer"
              className="wiki-link"
            >
              Open Wikipedia →
            </a>
          )}
        </aside>
      )}
    </div>
  );
}

export default App;