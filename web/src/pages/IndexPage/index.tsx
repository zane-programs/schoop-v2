import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: "#305475",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <h1
        style={{
          margin: 0,
          padding: "15px",
          fontFamily: "'Gilroy-ExtraBold', 'Poppins', sans-serif",
          color: "#fff",
          fontSize: "48px",
          position: "absolute",
          top: "calc(50% - 12px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Schoop
      </h1>
    </div>
  );
}
