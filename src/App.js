import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MovieList from './components/MovieList';
import Movie from './components/Movie';
import EditMovieForm from './components/EditMovieForm';
import MovieHeader from './components/MovieHeader';
import FavoriteMovieList from './components/FavoriteMovieList';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AddMovieForm from './components/AddMovieForm'
import DeleteMovieModal from "./components/DeleteMovieModal";

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { push } = useHistory();

  useEffect(()=>{
    axios.get('http://localhost:9000/api/movies')
      .then(res => {
        setMovies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const renderMovieModal = (id) => {
    push(`/movies/delete/${id}`)
  }

  const deleteMovie = (id)=> {
    axios.delete(`http://localhost:9000/api/movies/${id}`)
    .then(res => {
        console.log(res.data)
        setMovies(res.data);
        push('/movies');
    })
    .catch(err => {
        console.log(err)
    })
  }

  const addToFavorites = (item) => {
    if(!favoriteMovies.some(newItem => newItem.id === item.id)) {
      console.log(item)
      setFavoriteMovies([
        ...favoriteMovies,
        item
      ])
    }
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand" > HTTP / CRUD Module Project</span>
      </nav>

      <div className="container">
        <MovieHeader/>
        <div className="row ">
          <FavoriteMovieList favoriteMovies={favoriteMovies}/>
        
          <Switch>
            <Route 
              path="/movies/edit/:id" 
              render={() => <EditMovieForm setMovies={setMovies} />}
            >
            </Route>
            
            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies}/>
            </Route>

            <Route path="/movies/delete/:id">
              <DeleteMovieModal deleteMovie={deleteMovie}/>
            </Route>

            <Route path="/movies/:id">
              <Movie renderMovieModal={renderMovieModal} setMovies={setMovies} addToFavorites={addToFavorites} />
            </Route>
            
            <Route path="/movies">
              <MovieList movies={movies}/>
            </Route>

            <Route path="/">
              <Redirect to="/movies"/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};


export default App;