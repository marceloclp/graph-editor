import { ComponentProps } from "react";

export function EdgeMoveIcon(props: ComponentProps<"svg">) {
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
        d="M14.7731 14.7731L9 9M14.7731 14.7731C14.2678 15.2784 11.8846 14.7834 11.1649 14.7731M14.7731 14.7731C15.2784 14.2678 14.7834 11.8846 14.7731 11.1649"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
