const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs')
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

const postSchema = new Schema({
  postId: {type: String, required: true},
  content: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: moment(Date.now()).format('DD/MM/YYYY') },
  likes: { type: Number, default: 0 },
  comments: [{ 
    user: { type: String, required: false },
    content: { type: String, required: false }
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

router.post('/addComment', (req, res, next) => {
  const { postId, comment, user } = req.body;

  Post.findOne({postId: postId})
    .then(post => {
      if (post) {
        post.comments.push({ content: comment, user: user });
        
        post.save()
          .then(updatedPost => {
            console.log(updatedPost)
            res.json({ success: true, comment: updatedPost.comments });
          })
          .catch(err => {
            res.json({ success: false, theError: err });
          });
      } else {
        res.json({ success: false, message: 'Post not found' });
      }
    })
    .catch(err => {
      console.log('Error adding comment: ' + err);
      res.json({ success: false, theError: err });
    });
});

router.post('/addLike', (req, res, next) => {
  const { postId } = req.body;

  Post.findOne({postId: postId})
    .then(post => {
      if (post) {
        post.likes++;

        post.save()
          .then(updatedPost => {
            res.json({ success: true, likes: updatedPost.likes });
          })
          .catch(err => {
            res.json({ success: false, theError: err });
          });
      } else {
        res.json({ success: false, message: 'Post not found' });
      }
    })
    .catch(err => {
      console.log('Error updating likes: ' + err);
      res.json({ success: false, theError: err });
    });
});

router.post('/updateCaption', (req, res, next) => {
  const { postId, content } = req.body;

  Post.findOne({postId: postId})
    .then(post => {
      if (post) {
        post.content = content;

        post.save()
          .then(updatedPost => {
            res.json({ success: true, caption: updatedPost.content });
          })
          .catch(err => {
            res.json({ success: false, theError: err });
          });
      } else {
        res.json({ success: false, message: 'Post not found' });
      }
    })
    .catch(err => {
      console.log('Error updating caption: ' + err);
      res.json({ success: false, theError: err });
    });
});

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  // check if both values exist
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
    new User({ username: username, password: hashedPassword })
      .save()
      .then(result => {
        res.json({success: true, message: 'Added User'})
      })
      .catch(err => {
        res.json({success: false, message: 'Could not add user'})
      })
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.json({success: false, message: 'Incorrect combination of email/password, try again!'});

    const matchOk = await bcrypt.compare(req.body.password, user.password);
    if (!matchOk) return res.json({success: false, message: 'Incorrect combination of email/password, try again!'});

    return res.json({success: true, message: 'Welcome!'});

  } catch (err) {
    console.log(err);
    res.json({success: false, message: 'Could not sign in!'})
  }
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
