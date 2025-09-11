import { Monitor, MapPin } from "lucide-react";

interface Props {
  onSubmit: (type: "Physical" | "Online") => void;
  onBack: () => void;
}

export function MeetingTypeForm({ onSubmit, onBack }: Props) {
  return (
    <div className="surface max-w-md mx-auto space-y-6">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSubmit("Online")}
          className="option-card w-full text-left"
        >
          <Monitor className="w-5 h-5" />
          <div>
            <p className="font-medium">Online Meeting</p>
            <p className="text-xs text-gray-500">Video call via Zoom/Teams</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onSubmit("Physical")}
          className="option-card w-full text-left"
        >
          <MapPin className="w-5 h-5" />
          <div>
            <p className="font-medium">In-Person Meeting</p>
            <p className="text-xs text-gray-500">Physical location</p>
          </div>
        </button>
      </div>
      <div className="flex justify-between gap-2">
        <button onClick={onBack} type="button" className="slot-btn flex-1">
          Back
        </button>
      </div>
    </div>
  );
}
