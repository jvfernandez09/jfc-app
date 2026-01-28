"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RowActions({ onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onEdit}
        className="text-gray-800 hover:text-gray-900 cursor-pointer"
        aria-label="Edit"
      >
        <Pencil className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 cursor-pointer"
        aria-label="Delete"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
