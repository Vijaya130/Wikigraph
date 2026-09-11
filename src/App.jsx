import { useEffect, useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function App() {
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch graph data
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8001/api/nodes").then((res) => res.json()),
      fetch("http://127.0.0.1:8001/api/edges").then((res) => res.json()),
    ]).then(([nodes, edges]) => {
      setAllNodes(nodes);
      setAllEdges(edges);
    });
  }, []);

  // Autocomplete suggestions
  const suggestions =
    search.trim() === ""
      ? []
      : allNodes
          .filter((node) =>
            node.title.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6);

  // Find the selected/search article
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

  // Find connected articles
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

  // Create graph nodes
  const visibleNodes = allNodes
    .filter((node) => connectedIds.has(String(node.id)))
    .map((node, index) => {
      const isSelected = String(node.id) === selectedId;

      if (isSelected) {
        return {
          id: String(node.id),
          position: { x: 0, y: 0 },
          data: {
            label: node.title,
          },
          className: "main-node",
        };
      }

      const otherNodesCount = Math.max(connectedIds.size - 1, 1);
      const angle = (index / otherNodesCount) * Math.PI * 2;
      const radius = 400;

      return {
        id: String(node.id),
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: {
          label: node.title,
        },
        className: "article-node",
      };
    });

  // Create graph edges
  const visibleEdges = allEdges
    .filter(
      (edge) =>
        connectedIds.has(String(edge.source)) &&
        connectedIds.has(String(edge.target))
    )
    .map((edge, index) => ({
      id: `edge-${index}`,
      source: String(edge.source),
      target: String(edge.target),
      className: "graph-edge",
    }));

  // Click a node
  const handleNodeClick = (_, node) => {
    const article = allNodes.find(
      (item) => String(item.id) === String(node.id)
    );

    if (article) {
      setSelectedArticle(article);
      setSearch(article.title);
    }
  };

  // Click autocomplete suggestion
  const handleSuggestionClick = (article) => {
    setSearch(article.title);
    setSelectedArticle(article);
  };

  return (
    <div className="app">
      {/* Header */}
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

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Wikipedia topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {suggestions.length > 0 && (
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

      {/* Graph */}
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        fitView
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Article details */}
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