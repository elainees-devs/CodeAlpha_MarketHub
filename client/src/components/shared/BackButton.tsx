import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mt-4 mb-4 text-sm font-medium text-gray-700 hover:text-black"
    >
      ← {label}
    </button>
  );
}