import { useState } from "react";

interface Props {
  onSubmit: (size: string) => void;
  onBack: () => void;
}

export function AttendeeForm({ onSubmit, onBack }: Props) {
  const [size, setSize] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(String(size));
  };

  return (
    <form onSubmit={handleSubmit} className="surface max-w-md mx-auto space-y-6 text-center">
      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          min={1}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value) || 1)}
          className="input-field w-24 text-center"
        />
        <span className="text-sm">people</span>
      </div>
      <div className="flex justify-between gap-2">
        <button type="button" onClick={onBack} className="slot-btn flex-1">
          Back
        </button>
        <button type="submit" className="btn-accent flex-1">
          Next
        </button>
      </div>
    </form>
  );
}
