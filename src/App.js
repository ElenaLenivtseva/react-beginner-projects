import React from "react";
import {useState, useEffect} from "react";
import { Collection } from "./Collection.jsx";
import "./index.scss";

const categories = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];
function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searhValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState([]);
 
  useEffect(() => {
    setIsLoading(true);
    const category = categoryId ? `category=${categoryId}` : ''; 
    
    fetch(`https://65bbb77d52189914b5bcee99.mockapi.io/collections?page=${page}&limit=3&${category}`)
      .then((res) => res.json())
      .then((json) => {
        if (json) {
          setCollections(json);
        }       
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных");
      }).finally(()=> setIsLoading(false));
  }, [categoryId, page ]);
  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((obj, idx) => (
            <li onClick={()=>setCategoryId(idx)} className={categoryId === idx ? "active" : ""} key={obj.name}>
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searhValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (<h3>Идет загрузка...</h3>) : (collections.filter(obj => obj.name.toLowerCase().includes(searhValue.toLowerCase())).map((obj, index)=><Collection key={index} name={obj.name} images={obj.photos}/>))}
        
      </div>
      <ul className="pagination">
        {/* MockAPI не может посчитать макс кол-во страниц сам, поэтому hardcode */}
        {
          [...Array(5)].map((_, idx)=> <li onClick={()=>setPage(idx+1)} className={page===idx+1 ? 'active' : ''}>{idx+1}</li>)
        }
      </ul>
    </div>
  );
}

export default App;
