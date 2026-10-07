// src/components/InterestChips.jsx
import { useState } from "react";
import { INTEREST_MIN, INTEREST_MAX } from "../api/interests";
import Input from "./Input";
import Button from "./Button";

export default function InterestChips({ interests, onChange }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const add = () => {
    const value = text.trim();

    // Length rules come from the backend limits
    if (value.length < INTEREST_MIN) {
      setError(`Write at least ${INTEREST_MIN} characters.`);
      return;
    }
    if (value.length > INTEREST_MAX) {
      setError(`Keep it under ${INTEREST_MAX} characters.`);
      return;
    }
    // Block duplicates, ignoring case
    if (interests.some((i) => i.toLowerCase() === value.toLowerCase())) {
      setError("You already added that one.");
      return;
    }

    onChange([...interests, value]);
    setText("");
    setError("");
  };

  const remove = (index) => {
    onChange(interests.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    // Enter adds the chip and must not submit the parent form
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="What should we look for?"
            placeholder="e.g. Exam date sheet or result announcements"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            error={error}
          />
        </div>
        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>

      {/* Live counter, turns red past the limit */}
      <p
        className={`mt-1 text-xs ${
          text.length > INTEREST_MAX ? "text-red-600" : "text-gray-400"
        }`}
      >
        {text.length}/{INTEREST_MAX}
      </p>

      {/* Added interests */}
      {interests.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <li
              key={interest}
              className="flex max-w-full items-center gap-2 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm"
            >
              <span className="truncate">{interest}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${interest}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}