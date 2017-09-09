import React from 'react';
import './App.css';
import * as BooksAPI from './BooksAPI';
import ListBooks from './ListBooks.js';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

class BooksApp extends React.Component {

	state = {
		books: [],
		searchResults: [],
		query: ''
	}

  //Load the books when component is mounted
	componentDidMount(){
		BooksAPI.getAll().then((books) => {
			this.setState({
				books: books
			})
		})
	}

  //Method to be triggered when shelf of a book is changed
	changeShelf = (book,e) => {
		BooksAPI.update(book,e).then((newBook) => {
				book.shelf = e
				this.setState((state) => ({
					books: state.books.filter(x => x.id !== book.id).concat([book])
				}))
		 })

	}

  //Method to be triggered when a new seary query is entered.
	updateQuery = (query) => {
		if(query.trim() !== ''){
			BooksAPI.search(query.trim()).then((result) => {
			//The search API was not returning an empty or null array if there were no books to return hence below check is added
			if(result !== undefined || result.error !== undefined){
				result.forEach((book,index) => {
					let existingBook = this.state.books.find((b) => b.id === book.id); //Update the shelf if book is already present on a shelf
					book.shelf = existingBook ? existingBook.shelf : 'none';
					result[index] = book;
				})
			}
			this.setState({
				searchResults:  result,
				query: query.trim()
				})
			})
		}
		else{
			//No search string provided, hence clearing out search results
			this.setState({
				searchResults: [],
				query: ''
			})
		}
	}

	render() {
		return (
			<div className="app">

				<Route exact path="/" render={() => (
						<div className="list-books">
              <div className="list-books-title">
						    <h1>MyReads</h1>
						  </div>
						<div className="list-books-content">
							<div>
								<div className="bookshelf">
									<h2 className="bookshelf-title">Currently Reading</h2>
									<ListBooks books={this.state.books.filter(x => x.shelf === 'currentlyReading')} onChangeCategory={this.changeShelf} />
								</div>
								<div className="bookshelf">
									<h2 className="bookshelf-title">Want to Read</h2>
									<ListBooks books={this.state.books.filter(x => x.shelf === 'wantToRead')} onChangeCategory={this.changeShelf} />
								</div>
								<div className="bookshelf">
									<h2 className="bookshelf-title">Read</h2>
									<ListBooks books={this.state.books.filter(x => x.shelf === 'read')} onChangeCategory={this.changeShelf} />
								</div>
							</div>
						</div>
						<div className="open-search">
							<Link to="/search">Add a book</Link>
						</div>
					</div>
					)}
					/>

					<Route path="/search" render={() =>(
						<div className="search-books">
							<div className="search-books-bar">
								<Link className="close-search" to="/">Close</Link>
								<div className="search-books-input-wrapper">

								<input type="text" placeholder="Search by title or author"
								onChange={(e) => this.updateQuery(e.target.value)}/>

							 </div>
						  </div>
						  <div className="search-books-results">
						    <ListBooks books={this.state.searchResults} onChangeCategory={this.changeShelf}/>
						  </div>
						</div>
						)}
					/>
			</div>
		)
	}
}

export default BooksApp
