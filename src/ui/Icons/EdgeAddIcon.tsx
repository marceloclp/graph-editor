import { ComponentProps } from "react";

export function EdgeAddIcon(props: ComponentProps<"svg">) {
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
      <circle
        cx="19"
        cy="4"
        r="2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="5"
        cy="20"
        r="2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M5 18C5 10 10 4 17 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        transform="translate(4, 4)"
        d="M12 8V16M16 12L8 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
