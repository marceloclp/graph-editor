import { ComponentProps } from "react";

export function VertexMoveIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      color={"#ff0000"}
      fill={"none"}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path
        d="M14.7731 14.7731L9 9M14.7731 14.7731C14.2678 15.2784 11.8846 14.7834 11.1649 14.7731M14.7731 14.7731C15.2784 14.2678 14.7834 11.8846 14.7731 11.1649"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
