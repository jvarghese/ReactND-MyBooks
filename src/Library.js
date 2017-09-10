import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book.js'
import * as BooksAPI from './BooksAPI';
///import BookShelf from './BookShelf.js';
import { Link } from 'react-router-dom';

class Library extends React.Component{
	static PropTypes = {
		addToShelf: PropTypes.func.isRequired,
		myBooks: PropTypes.object.isRequired
	}
	state = {
		query:'',
		searchResults: []
	}

	updateQuery = (query) => {
    	if(query.trim() !== ''){
    		BooksAPI.search(query.trim(),5).then((result) => {
    		alert(JSON.stringify(result))
            if(!result.error){
                result.forEach((book,index) => {
                    let existingBook = this.props.myBooks.find((b) => b.id === book.id); //Update the shelf if book is already present on a shelf
                    book.shelf = existingBook ? existingBook.shelf : 'none';
                    result[index] = book;
                })
            }else{
            	result = []
            }
            this.setState({
                searchResults: result,
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

	render(){
		return(
			<div className="search-books">
				<div className="search-books-bar">
					<Link className="close-search" to="/">Close</Link>
					<div className="search-books-input-wrapper">
						<input type="text" placeholder="Search by title or author"
							onChange={(e) => this.updateQuery(e.target.value)} />
					</div>
				</div>
				<div className="search-books-results">
					<div className="bookshelf-books">
						<ol className="books-grid">
						{
                    		this.state.searchResults.map((book) => (
                        		<Book key={book.id} book={book} onChangeShelf={this.props.onChangeShelf}/>
                    		))
                		}
						</ol>
					</div>
				</div>
			</div>
		)
	}
}

export default Library