import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
    >
      ← Back
    </button>
  );
}
