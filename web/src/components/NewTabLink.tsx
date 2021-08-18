import React from "react";

export default function NewTabLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}
