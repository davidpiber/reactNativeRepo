import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import axios from 'axios';
import style from './style';

class CommentBox extends Component {
   constructor(props){
      super(props);
      this.state = { data: [] };
      this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
      this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
      this.handleCommentDelete = this.handleCommentDelete.bind(this);
      this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
   }

    loadCommentsFromServer() {
       axios.get(this.props.url).then(res => {
            this.setState({ data: res.data });
       });
    }

    handleCommentSubmit(comment) {
        axios.post(this.props.url, comment)
            .catch(err => {
                console.error(err);
            }).then(() => {
            this.loadCommentsFromServer();
        });
    }

    handleCommentDelete(id) {
       axios.delete(`${this.props.url}/${id}`).then(res => {
       }).catch(err => {
           console.error(err);
       }).then(() => {
           this.loadCommentsFromServer();
        });

    }

    handleCommentUpdate(id, comment) {
       axios.put(`${this.props.url}/${id}`, comment).catch(err => {
       }).then(()=> {
           this.loadCommentsFromServer();
           this.setState({ toBeUpdated: !this.state.toBeUpdated });
       });
    }

    componentDidMount(){
        this.loadCommentsFromServer();
    }

   render() {
      return (
         <div style={ style.commentBox }>
            <h2>Comments</h2>
            <CommentList
             onCommentDelete={ this.handleCommentDelete }
             onCommentUpdate={ this.handleCommentUpdate }
             data={ this.state.data }/>
             <h2>Add your Comments</h2>
            <CommentForm onCommentSubmit={ this.handleCommentSubmit }/>
         </div>
      )
   }
}

export default CommentBox;
