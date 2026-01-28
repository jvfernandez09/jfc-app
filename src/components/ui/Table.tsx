import React from "react";

export type TableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  title?: string;
  actionButton?: React.ReactNode;
  columns: TableColumn<T>[];
  rows: T[];
  emptyText?: string;

  notice?: React.ReactNode;
};

export default function Table<T>({
  title,
  actionButton,
  columns,
  rows,
  emptyText = "No records found.",
  notice,
}: Props<T>) {
  const hasTopRow = Boolean(title || actionButton || notice);

  return (
    <div className="bg-white p-6 shadow sm:rounded-lg sm:p-8">
      {hasTopRow && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}

            {notice && <div className="min-w-0">{notice}</div>}
          </div>

          {actionButton && <div className="cursor-pointer">{actionButton}</div>}
        </div>
      )}

      <div className="overflow-hidden border-gray-200 bg-white">
        <table className="min-w-250 w-full table-auto">
          <thead>
            <tr className="bg-blue-300">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "px-6 py-4 text-sm font-semibold text-gray-900",
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left",
                    "border-r border-white/40 last:border-r-0",
                  ].join(" ")}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-gray-200">
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        "px-6 py-3 text-sm text-gray-900",
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left",
                      ].join(" ")}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
