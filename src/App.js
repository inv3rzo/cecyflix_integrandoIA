import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoDescripcion, setModoDescripcion] = useState(false);
  const [recomendacion, setRecomendacion] = useState('');

  useEffect(() => {
    fetch('https://cecyflix-integrandoia.onrender.com/api/peliculas')
      .then(res => res.json())
      .then(data => {
        setPeliculas(data);
        setPeliculasFiltradas(data);
      })
      .catch(err => console.error('Error al cargar películas:', err));
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    const texto = busqueda.toLowerCase();

    const resultado = peliculas.filter( p =>
      p.titulo.toLowerCase().includes(texto) ||
      p.genero.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().startsWith(texto)
    );

    setPeliculasFiltradas(resultado);
    setRecomendacion('');
  };

  const handleBuscarDescripcion = async () => {
    try {
      const res = await  fetch('https://recomendaciones-backend.onrender.com/api/recomendaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Dame una recomendación basada en esta descripción:
          ${busqueda}. Usa solo películas de este catálogo: 
          ${peliculas.map(p => p.titulo).join(', ')}.`
        })
      });

      const data = await res.json();
      setRecomendacion(data.recomendacion);

      const seleccionadas = peliculas.filter((p, index, self) =>
  data.recomendacion.toLowerCase().includes(p.titulo.toLowerCase()) &&
  index === self.findIndex(other => other.titulo === p.titulo)
    );


      if (seleccionadas.length > 0) {
        setPeliculasFiltradas(seleccionadas);
      }
    } catch (error) {
      console.error('Error al obtener recomendación IA:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="titulo">CECYFLIX</h1>

      <form className="buscador" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder={modoDescripcion ? 'Describe la peli que buscas...' : 'Busca por título, género o descripción...'}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleBuscarDescripcion} className="btn-ia">
   Buscar por descripción</button>
      </form>

      {recomendacion && (
        <div className="bloque-recomendaciones">
          <h2>✨ IA sugiere:</h2>
          <p>{recomendacion}</p>
        </div>
      )}
    {peliculasFiltradas.length > 0 && (
      <div className="galeria">
        <h2> Películas recomendadas por IA</h2>
        <div className="grid">
          {peliculasFiltradas.map((p, i) => (
            <div className="tarjeta" key={i}>
              <img src={p.poster} alt={p.titulo} />
              <div className="info">
                <h3>{p.titulo}</h3>
                <p>{p.genero}</p>
                <span>{p.descripcion?.slice(0, 60)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
      {peliculasFiltradas.length === 0 && (
        <div className="galeria">
          <h2>Todas las películas</h2>
          <div className="grid">
            {peliculas.map((p, i) => (
              <div className="tarjeta" key={i}>
                <img src={p.poster} alt={p.titulo} />
                <div className="info">
                  <h3>{p.titulo}</h3>
                  <p>{p.genero}</p>
                  <span>{p.descripcion?.slice(0, 60)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

  );
}

export default App;








 /*const [input, setInput] = useState('');
 const [peliculasFiltradas, setPeliculasFiltradas] = useState(peliculas);
 const [recomendacionIA, setRecomendacionIA] = useState('');
 const [peliculasRecomendadas, setPeliculasRecomendadas] = useState([]);
 //Función para búsqueda tradicional
  const handleBuscarTexto = () => {
 const texto = input.toLowerCase();
 const filtradas = peliculas.filter((peli) =>
 peli.titulo.toLowerCase().includes(texto) ||
 peli.genero.toLowerCase().includes(texto) ||
 peli.titulo.toLowerCase().startsWith(texto)
 );
 setPeliculasFiltradas(filtradas);
 setPeliculasRecomendadas([]);
 setRecomendacionIA('');
 };
//Función para buscar por descripción (IA)
  const handleBuscarDescripcion = async () => {
 setRecomendacionIA('Pensando...');
 setPeliculasRecomendadas([]);
 setPeliculasFiltradas([]);
 try {
 const response = await fetch('/api/recomendaciones', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
  prompt : `Tengo una base de datos con estas películas: ${peliculas.map(p => p.titulo).join(', ')}.
Quiero que me recomiendes solo los títulos que coincidan con esta descripción: "${input}".
Devuélveme únicamente los títulos separados por comas, sin explicaciones.`
  /*
 prompt: `Tengo una base de datos con estas películas: ${peliculas.
 map(p => p.titulo).join(', ')}. 
Quiero que me digas solo los títulos de las películas que coincidan con esta 
descripción: "${input}". 
Devuélveme únicamente los títulos separados por comas.`////
 }),
 });
 const data = await response.json();
 const textoIA = data.recomendacion.toLowerCase();
 setRecomendacionIA(data.recomendacion);
 const coincidencias = peliculas.filter((peli) =>
 textoIA.includes(peli.titulo.toLowerCase())
 );
 setPeliculasRecomendadas(coincidencias);
 } catch (err) {
 setRecomendacionIA('❌ Error al obtener recomendación IA.');
 }
 };
 //Interfaz visual (inputs y resultados)
  return (
    <div className="App">
      <h1 className="titulo">CECYFLIX</h1>
      <div className="buscador">
        <input
          type="text"
          placeholder="¿Qué te gustaría ver hoy?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button onClick={handleBuscarTexto}>Buscar</button>
        <button onClick={handleBuscarDescripcion} className="btn-ia">
   Buscar por descripción</button>
      </div>
      {recomendacionIA && (
        <div className="bloque-recomendaciones">
          <h2>✨ Recomendación IA</h2>
          <p>{recomendacionIA}</p>
        </div>
      )}
      {peliculasRecomendadas.length > 0 && (
        <div className="galeria">
          <h2> Películas recomendadas por IA</h2>
          <div className="grid">
            {peliculasRecomendadas.map((peli) => (
              <div className="tarjeta" key={peli.id}>
                <img src={peli.poster} alt={peli.titulo} />
                <div className="info">
                  <h3>{peli.titulo}</h3>
                  <p>{peli.descripcion}</p>
                  <span>{peli.genero}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} 
       {peliculasFiltradas.length > 0 && (
        <div className="galeria">
          <h2> Todas las películas</h2>
          <div className="grid">
            {peliculasFiltradas.map((peli) => (
              <div className="tarjeta" key={peli.id}>
                <img src={peli.poster} alt={peli.titulo} />
                <div className="info">
                  <h3>{peli.titulo}</h3>
                  <p>{peli.descripcion}</p>
                  <span>{peli.genero}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  */
