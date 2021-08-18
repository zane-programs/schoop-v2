import React from "react";

// interface DummyLinkProps {
//   children: ReactNode;
// }

export default function DummyLink(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) {
  return (
    <a href="#/" onClick={(e) => e.preventDefault()} {...props} role="button">
      {props.children}
    </a>
  );
}
