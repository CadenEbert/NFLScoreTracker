import './App.css';
import Header from './Header';
import Body from './Body';

function App() {
  return (
    
    <div className="App">
      <Header />
      <main className="main-content">
        <Body />
      </main>
      {/* Footer can be added here if needed */}
    </div>
  );
}

export default App;
