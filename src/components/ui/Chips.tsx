import React from "react";

type Props = {
  items: string[];
};

export default function Chips({ items }: Props) {
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((x) => (
        <span
          key={x}
          className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800"
        >
          {x}
        </span>
      ))}
    </div>
  );
}
