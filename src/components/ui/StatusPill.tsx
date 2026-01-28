export default function StatusPill({ done }: { done: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        done ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800",
      ].join(" ")}
    >
      {done ? "Completed" : "Open"}
    </span>
  );
}
