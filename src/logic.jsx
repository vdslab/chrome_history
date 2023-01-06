import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <p>いい感じの表示</p>
    </div>
  );
}

createRoot(document.querySelector("#content")).render(<App />);
