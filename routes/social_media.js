const express = require('express');
const router = express.Router();

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postId: {type: String, required: true},
  content: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: moment(Date.now()).format('DD/MM/YYYY') },
  likes: { type: Number, default: 0 },
  comments: [{ 
    user: { type: String, required: false },
    content: { type: String, required: false },
    timestamp: { type: Date, default: moment(Date.now()).format('DD/MM/YYYY') }
  }],
  image: [{ type: String }]
});

const Post = mongoose.model('Post', postSchema);

router.post('/addPost', (req, res, next) => {
  const { id, content, user, image } = req.body;

  new Post({ 
    postId: id,
    content: content, 
    user: user, 
    image: image || []
  })
    .save()
    .then(result => {
      console.log('Post saved to database');
      res.json({ success: true });
    })
    .catch(err => {
      console.log('Failed to add post: ' + err);
      res.json({ success: false, theError: err });
    });
});


router.post('/', (req, res, next) => {
  Post.find()
    .then(posts => {
      res.json({ success: true, posts: posts });
    })
    .catch(err => {
      console.log('Failed to find posts: ' + err);
      res.json({ success: false, theError: err });
    });
});

router.post('/getSpecificPost', (req, res, next) => {
  const { id } = req.body;
  Post.find({ postId: id })
    .then(posts => {
      res.json({ success: true, post: posts[0] });
    })
    .catch(err => {
      console.log('Failed to find post: ' + err);
      res.json({ success: false, theError: err });
    });
});

router.post('/deleteSpecificPost', (req, res, next) => {
  const { id } = req.body;
  Post.findOneAndRemove({ postId: id })
    .then(resp => {
      res.json({ success: true });
    })
    .catch(err => {
      console.log('Failed to delete post: ' + err);
      res.send('Post not found');
    });
});

// router.post('/updateSpecificPost', (req, res, next) => {
//   const { id, content, likes, comments } = req.body;

//   Post.findById(id)
//     .then(post => {
//       if (post) {
//         post.content = content || post.content;
//         post.likes = likes || post.likes;
//         post.comments = comments || post.comments;

//         post.save()
//           .then(updatedPost => {
//             res.json({ success: true, post: updatedPost });
//           })
//           .catch(err => {
//             res.json({ success: false, theError: err });
//           });
//       } else {
//         res.json({ success: false, message: 'Post not found' });
//       }
//     })
//     .catch(err => {
//       console.log('Error updating post: ' + err);
//       res.json({ success: false, theError: err });
//     });
// });

module.exports = router;
