import Header from "./components/Header";
import Game from "./components/Game";
import Footer from "./components/Footer";
import NewUser from "./components/NewUser";

function App() {
  return (
    <div className="container">
      <Header />
      <NewUser />
      <Game />
      <Footer />
    </div>
  );
}

export default App;
