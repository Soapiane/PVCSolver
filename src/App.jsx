import React, { useState, useEffect } from "react";
import PVCSolver from "./PVCSolver.ts";

const App = () => {
  const [nbVertex, setNbVertex] = useState(4);
  const [edges, setEdges] = useState([]);
  const [exactResult, setExactResult] = useState(null);
  const [heuristicResult, setHeuristicResult] = useState(null);

  // Reset edges when the number of vertices changes
  useEffect(() => {
    setEdges([]);
  }, [nbVertex]);

  const handleAddEdge = (i, j, weight) => {
    setEdges((prevEdges) => {
      // Remove any existing edge between i and j
      const filteredEdges = prevEdges.filter(
        (edge) => !(edge.i === i && edge.j === j)
      );
      // Add the new edge if weight is valid
      if (!isNaN(weight)) {
        return [...filteredEdges, { i, j, weight }];
      } else {
        return filteredEdges;
      }
    });
  };

  const solve = () => {
    // Initialize solver with current number of vertices
    const newSolver = new PVCSolver({ nbVertex });
    // Set the edges
    edges.forEach(({ i, j, weight }) => {
      newSolver.setEdgeWeight({ i, j, weight });
    });

    // Solve exactly and measure execution time
    const exactStartTime = performance.now();
    const exactRes = newSolver.solveExact();
    const exactEndTime = performance.now();
    exactRes.executionTime = exactEndTime - exactStartTime;

    // Solve heuristically and measure execution time
    const heuristicStartTime = performance.now();
    const heuristicRes = newSolver.solveHeuristic();
    const heuristicEndTime = performance.now();
    heuristicRes.executionTime = heuristicEndTime - heuristicStartTime;

    // Update state
    setExactResult(exactRes);
    setHeuristicResult(heuristicRes);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Traveling Salesperson Solver
        </h1>

        {/* Input Graph */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step 1: Input Graph</h2>
          <label className="block mb-2">
            Number of Vertices:
            <input
              type="number"
              value={nbVertex}
              onChange={(e) => setNbVertex(parseInt(e.target.value, 10))}
              min="2"
              className="ml-2 border border-gray-300 rounded-md p-1"
            />
          </label>
        </div>

        {/* Add Edges */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step 2: Add Edges</h2>
          {Array.from({ length: nbVertex }, (_, i) =>
            Array.from({ length: nbVertex }, (_, j) =>
              i < j ? (
                <div key={`${i}-${j}`} className="mb-2">
                  <label>
                    Edge ({i} ↔ {j}):
                    <input
                      type="number"
                      placeholder="Weight"
                      onBlur={(e) => {
                        const weight = parseInt(e.target.value, 10);
                        if (!isNaN(weight)) {
                          handleAddEdge(i, j, weight);
                        }
                      }}
                      className="ml-2 border border-gray-300 rounded-md p-1"
                    />
                  </label>
                </div>
              ) : null
            )
          )}
        </div>

        {/* Solve */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step 3: Solve</h2>
          <button
            onClick={solve}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Solve
          </button>
        </div>

        {/* Exact Solution */}
        {exactResult && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Exact Solution</h2>
            <p className="mb-1">
              <strong>Minimum Cost:</strong> {exactResult.minCost}
            </p>
            <p className="mb-1">
              <strong>Path:</strong> {exactResult.minCostPath.join(" → ")}
            </p>
            <p className="mb-1">
              <strong>Execution Time:</strong>{" "}
              {exactResult.executionTime.toFixed(2)} ms
            </p>
          </div>
        )}

        {/* Heuristic Solution */}
        {heuristicResult && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Heuristic Solution</h2>
            <p className="mb-1">
              <strong>Minimum Cost:</strong> {heuristicResult.minCost}
            </p>
            <p className="mb-1">
              <strong>Path:</strong>{" "}
              {heuristicResult.minCostPath
                .map((arc) => `${arc.i} ↔ ${arc.j}`)
                .join(", ")}
            </p>
            <p className="mb-1">
              <strong>Execution Time:</strong>{" "}
              {heuristicResult.executionTime.toFixed(2)} ms
            </p>
          </div>
        )}

        {/* Display Edges */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Edges</h2>
          <ul className="list-disc pl-5">
            {edges.map((edge, index) => (
              <li key={index}>
                {edge.i} ↔ {edge.j}: {edge.weight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;