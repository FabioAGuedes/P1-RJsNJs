import { Component } from 'react';

import './styles.css';

import { Posts } from '../../components/Posts/index'; 
import { loadPosts } from'../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';



export class Home extends Component { // funciona sem o export
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    searchValue: ''
  };

  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);
    
    this.setState ({ posts, page: nextPage});
  }


  
  async componentDidMount(){
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    });

  }

  handleChange = (e) => {
    const {value} = e.target;
    this.setState({ searchValue: value });

  }



  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!searchValue ? 
    allPosts.filter(post => {
      return post.title.toLowerCase().includes(
        searchValue.toLowerCase()
      );
    })
    : posts;

    return (
      <section className="container">
        <div class="search-container">
        {!!searchValue && ( //se tiver searchValue
          <h1>Search value: {searchValue}</h1>        
        )}

        <TextInput 
        searchValue={searchValue} 
        handleChange={this.handleChange} />
        </div>


         {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
         )}

         {filteredPosts.length === 0 && (
          <p>Não existem posts =(</p>
         )}

        <Posts posts={filteredPosts} />

        <div className="button-container">
          {!searchValue && (
        <Button 
        text="Load more posts"
        onClick={this.loadMorePosts}
        disabled={noMorePosts}       
        />
          )}



        </div>



      </section>
    );
  }
}

export default Home;
