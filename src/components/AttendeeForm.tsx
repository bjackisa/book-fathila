import { useState } from "react";

interface Props {
  onSubmit: (size: string) => void;
}

export function AttendeeForm({ onSubmit }: Props) {
  const [size, setSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!size) return;
    onSubmit(size);
  };

  return (
    <form onSubmit={handleSubmit} className="surface max-w-md mx-auto space-y-4">
      <label className="block">
        <span className="block mb-2 font-medium">Size of Attendees</span>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
          className="input-field"
        >
          <option value="" disabled>
            Choose...
          </option>
          <option>Just Me</option>
          <option>2 - 5 People</option>
          <option>6 - 25 People</option>
          <option>26+ People</option>
        </select>
      </label>
      <button type="submit" className="btn-accent w-full">
        Next
      </button>
    </form>
  );
}
