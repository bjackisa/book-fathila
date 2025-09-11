import { useState } from "react";

interface Props {
  onSubmit: (info: {
    locationOption: string;
    address: string;
    district: string;
    country: string;
  }) => void;
}

export function LocationForm({ onSubmit }: Props) {
  const [choice, setChoice] = useState<"office" | "other" | "">("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (choice === "office") {
      onSubmit({
        locationOption: "office",
        address: "Kigobe Rd, Ntinda, Kampala",
        district: "",
        country: "Uganda",
      });
    } else {
      onSubmit({
        locationOption: "other",
        address,
        district,
        country,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface max-w-md mx-auto space-y-4">
      <p className="font-medium">Where would you like to meet?</p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="loc"
            value="office"
            checked={choice === "office"}
            onChange={() => setChoice("office")}
            required
          />
          <span>My office - Kigobe Rd, Ntinda, Kampala</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="loc"
            value="other"
            checked={choice === "other"}
            onChange={() => setChoice("other")}
          />
          <span>Meeting point of your choice</span>
        </label>
      </div>
      {choice === "other" && (
        <div className="space-y-2">
          <p className="text-sm italic">
            Note: At the moment you are unable to meet persons outside of Uganda physically.
          </p>
          <input
            className="input-field"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
      )}
      <button type="submit" className="btn-accent w-full">
        Next
      </button>
    </form>
  );
}
