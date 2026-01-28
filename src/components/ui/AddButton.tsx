import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
};

export default function AddButton({ label, onClick, href }: Props) {
  const className =
    "cursor-pointer inline-flex h-10 items-center rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-5";

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
