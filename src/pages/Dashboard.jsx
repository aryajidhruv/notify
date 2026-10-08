// src/pages/Dashboard.jsx
import { useState } from "react";
import { addInterests } from "../api/interests";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import InterestChips from "../components/InterestChips";

// Accept only real http(s) URLs
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// 400 -> detail string, 422 -> detail array of { msg }
function getErrorMessage(err) {
  if (!err.response) return "Can't reach the server. Check your connection.";
  const detail = err.response.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return "Something went wrong. Please try again.";
}

export default function Dashboard() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [interests, setInterests] = useState([]);
  const [urlError, setUrlError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUrlError("");
    setFormError("");

    // Client-side checks before hitting the API
    const url = sourceUrl.trim();
    if (!isValidUrl(url)) {
      setUrlError("Enter a full link, starting with http:// or https://");
      return;
    }
    if (interests.length === 0) {
      setFormError("Add at least one interest. Press Enter or click Add after typing.");
      return;
    }

    setLoading(true);
    try {
      await addInterests(url, interests);
      setSubmitted(true);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Reset everything for another source
  const reset = () => {
    setSourceUrl("");
    setInterests([]);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Add a source</h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste a notice-board link and describe what you care about. We'll email you
          when something matches.
        </p>

        {submitted ? (
          // Processing is async on the backend, so we confirm and set expectations
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
            <p className="font-medium text-green-800">Source added.</p>
            <p className="mt-1 text-sm text-green-700">
              You'll get an email when we find something that matches your interests.
            </p>
            <Button variant="secondary" onClick={reset} className="mt-4">
              Add another source
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-lg bg-white p-5 shadow-sm">
           <Input
            label="Page URL"
            type="url"
            placeholder="https://example.com/announcements"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              error={urlError}
            />

            <InterestChips interests={interests} onChange={setInterests} />

            {formError && (
              <p role="alert" className="text-sm text-red-600">
                {formError}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Start watching
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}