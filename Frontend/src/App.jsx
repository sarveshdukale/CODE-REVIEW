import { useState } from "react";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import RawEditor from "react-simple-code-editor";

import "./App.css";

const Editor = RawEditor.default || RawEditor;

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function reviewCode() {
    if (!code.trim()) {
      setError("Please enter some code to review.");
      setReview("");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-response",
        { code },
      );

      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || "Code review failed.");
      }

      // Supports either a string response or an object response.
      const result =
        typeof data === "string"
          ? data
          : typeof data.review === "string"
            ? data.review
            : typeof data.review?.review === "string"
              ? data.review.review
              : "";

      if (!result) {
        throw new Error("The AI returned an empty review.");
      }

      setReview(result);
    } catch (err) {
      console.error("Review error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to review your code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>AI Code Reviewer</h1>
          <p>Write code, find issues, and improve your code quality.</p>
        </div>
        <span className="status">
          <span className="status-dot" />
          AI Reviewer
        </span>
      </header>

      <section className="workspace">
        <div className="panel editor-panel">
          <div className="panel-header">
            <h2> Your Code </h2>
          </div>

          <div className="code-editor">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(value) =>
                highlight(value, languages.javascript || languages.js)
              }
              padding={18}
              placeholder={"// Write or paste your code here...\n"}
              textareaId="code-input"
              preClassName="editor-pre"
              style={{
                fontFamily: '"Fira Code", Consolas, monospace',
                fontSize: 14,
                lineHeight: 1.7,
                minHeight: "350px",
                color: "#e5e7eb",
                background: "transparent",
                outline: "none",
              }}
            />
          </div>

          <button className="reviewBtn" onClick={reviewCode} disabled={loading}>
            {loading ? "Reviewing your code..." : "Review Code"}
          </button>

          <p className="editor-hint">
            Tip: Include the complete function or code snippet for a more useful
            review.
          </p>
        </div>

        <div className="panel result-panel">
          <div className="panel-header">
            <h2>Review Results</h2>
            {review && <span className="result-badge">Completed</span>}
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <h3>Analyzing your code...</h3>
              <p>Checking for bugs, security risks, and improvements.</p>
            </div>
          )}

          {!loading && error && (
            <div className="error-state">
              <h3>Review unsuccessful</h3>
              <p>{error}</p>
              <button onClick={reviewCode}>Try Again</button>
            </div>
          )}

          {!loading && !error && !review && (
            <div className="empty-state">
              <div className="empty-icon">&lt;/&gt;</div>
              <h3>Your review will appear here</h3>
              <p>Enter your code and click Review Code to get started.</p>
            </div>
          )}

          {!loading && review && (
            <article className="review-content">
              <Markdown
                components={{
                  h1: ({ children }) => <h2>{children}</h2>,
                  h2: ({ children }) => <h2>{children}</h2>,
                  h3: ({ children }) => <h3>{children}</h3>,

                  code({ children, className }) {
                    const match = /language-([\w+-]+)/.exec(className || "");

                    if (match) {
                      return (
                        <SyntaxHighlighter
                          language={match[1]}
                          style={vscDarkPlus}
                          showLineNumbers
                          wrapLongLines
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }

                    return <code className="inline-code">{children}</code>;
                  },

                  pre: ({ children }) => <>{children}</>,
                }}
              >
                {review}
              </Markdown>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
