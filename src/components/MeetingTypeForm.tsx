interface Props {
  onSubmit: (type: "Physical" | "Online") => void;
}

export function MeetingTypeForm({ onSubmit }: Props) {
  return (
    <div className="surface max-w-md mx-auto space-y-4">
      <p className="font-medium">Do you prefer a physical or online meeting?</p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSubmit("Physical")}
          className="slot-btn"
        >
          Physical
        </button>
        <button
          type="button"
          onClick={() => onSubmit("Online")}
          className="slot-btn"
        >
          Online
        </button>
      </div>
    </div>
  );
}
