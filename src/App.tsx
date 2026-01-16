import { OverlayWindow } from "./components/OverlayWindow";
import "./App.css";

function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <OverlayWindow />
    </div>
  );
}

export default App;
