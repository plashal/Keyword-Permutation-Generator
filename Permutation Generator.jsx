import React, { useState } from "react";

function PermutationGenerator() {
  const [list1, setList1] = useState("");
  const [list2, setList2] = useState("");
  const [list3, setList3] = useState("");
  const [results, setResults] = useState([]);
  const [matchType, setMatchType] = useState("broad");

  const parseList = (text) =>
    text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

  const formatMatch = (text) => {
    if (matchType === "phrase") return `\"${text}\"`;
    if (matchType === "exact") return `[${text}]`;
    return text; // broad match
  };

  const generatePermutations = () => {
    const a = parseList(list1).length ? parseList(list1) : [""];
    const b = parseList(list2).length ? parseList(list2) : [""];
    const c = parseList(list3).length ? parseList(list3) : [""];

    const combinations = [];

    for (const i of a) {
      for (const j of b) {
        for (const k of c) {
          const phrase = [i, j, k]
            .map((x) => x.trim())
            .filter((x) => x !== "")
            .join(" ");
          combinations.push(formatMatch(phrase));
        }
      }
    }

    setResults(combinations);
  };

  const downloadCSV = () => {
    const csv = results.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date();
    const fileName = `permutation_${date.toLocaleDateString("en-US").replace(/\//g, "-")}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileImport = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target.result);
    };
    reader.readAsText(file);
  };

  const clearForm = () => {
    setList1("");
    setList2("");
    setList3("");
    setResults([]);
    setMatchType("broad");
  };

  const textAreaStyle = {
    border: "1px solid #000"
  };

  const shineButtonStyle = {
    backgroundColor: "#111",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    // backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    transition: "all 0.3s ease"
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Google Ads & SEO Keyword Permutation Generator</h1>
      <div>
        <p>by Andrés Plashal</p>
        <br/><br/>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", marginTop: "1rem" }}>
        {[{ label: "Keyword List 1 (one per line)", val: list1, set: setList1 },
          { label: "Keyword List 2 (one per line)", val: list2, set: setList2 },
          { label: "Keyword List 3 (one per line)", val: list3, set: setList3 }].map((list, index) => (
          <div key={index}>
            <textarea
              rows={8}
              cols={40}
              placeholder={list.label}
              value={list.val}
              onChange={(e) => list.set(e.target.value)}
              style={textAreaStyle}
            />
            <input
              type="file"
              accept=".txt"
              onChange={(e) => handleFileImport(e, list.set)}
              style={{ marginTop: "0.5rem" }}
            />
          </div>
        ))}
      </div>
      <br/><br/>
      
        <label>Match Type: </label>
        <select value={matchType} onChange={(e) => setMatchType(e.target.value)}>
          <option value="broad">Broad</option>
          <option value="phrase">Phrase</option>
          <option value="exact">Exact</option>
        </select>
      </div>
      <button onClick={generatePermutations} style={{ ...shineButtonStyle, marginRight: "1rem" }}>
        Generate Permutations
      </button>
      <button onClick={downloadCSV} disabled={results.length === 0}>
        Download CSV
      </button>
      <button onClick={clearForm} style={{ marginLeft: "1rem" }}>
        Clear Form
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>Results:</h3>
        <textarea
          readOnly
          value={results.join("\n")}
          rows={Math.max(results.length, 10)}
          cols={60}
          style={textAreaStyle}
        />
      </div>
    </div>
  );
}

export default PermutationGenerator;
