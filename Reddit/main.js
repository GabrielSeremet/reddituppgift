document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('create-post-button').addEventListener('click', createPost);

  // Load existing posts from local storage
  const existingPosts = getPostsFromLocalStorage();
  if (existingPosts) {
    existingPosts.forEach(post => renderPost(post));
  }
});

function addTags() {
  return ['Hobbies', 'Science', 'Stories', 'advice', 'Entertainment'];
}

function createPost() {
  const titleInput = document.getElementById('create-post-title');
  const bodyInput = document.getElementById('create-post-body');
  const tagSelect = document.getElementById('choose-post-tag');

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const selectedTag = tagSelect.value.trim();

  if (title && body && selectedTag) {
    const newPost = {
      id: Date.now(),
      title,
      body,
      tag: selectedTag,
      votes: 0,
    };

    renderPost(newPost);

    titleInput.value = '';
    bodyInput.value = '';
    tagSelect.value = 'Choose a tag';

    savePostToLocalStorage(newPost);
  } else {
    alert('Please enter both title, tag, and body.');
  }
}

function savePostToLocalStorage(post) {
  const existingPosts = getPostsFromLocalStorage() || [];
  existingPosts.push(post);
  localStorage.setItem('posts', JSON.stringify(existingPosts));
}

function getPostsFromLocalStorage() {
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : null;
}

fetch('https://dummyjson.com/posts')
  .then(res => res.json())
  .then(data => {
    data.posts.forEach(post => {
      const votes = post.votes !== undefined ? post.votes : 0;
      const tag = post.tag || getRandomTag();
      renderPost({ ...post, votes, tag });
    });
  })
  .catch(error => console.error('Error fetching data:', error));


function renderPost(post) {
  const postContainer = document.createElement('div');
  postContainer.classList.add('post-container');

  const postTitle = document.createElement('h2');
  postTitle.textContent = post.title;

  const postBody = document.createElement('p');
  postBody.textContent = post.body;

  const tag = document.createElement('span');
  tag.textContent = `Tag: ${post.tag}`;

  const voteContainer = document.createElement('div');
  voteContainer.classList.add('vote-container');

  const upvoteButton = createButton('Upvote', () => handleVote(post.id, 1));
  const downvoteButton = createButton('Downvote', () => handleVote(post.id, -1));

  const voteCount = document.createElement('span');
  voteCount.textContent = `Votes: ${post.votes}`;

  function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.classList.add('vote-button');
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
  }

  function handleVote(postId, value) {
    const updatedVotes = post.votes + value;
    updateVoteCount(updatedVotes);

  }

  function updateVoteCount(updatedVotes) {
    voteCount.textContent = `Votes: ${updatedVotes}`;
  }

  voteContainer.appendChild(upvoteButton);
  voteContainer.appendChild(voteCount);
  voteContainer.appendChild(downvoteButton);

  postContainer.appendChild(postTitle);
  postContainer.appendChild(postBody);
  postContainer.appendChild(tag);
  postContainer.appendChild(voteContainer);

  document.body.appendChild(postContainer);
}

function getRandomTag() {
  const tags = addTags(); 
  return tags[Math.floor(Math.random() * tags.length)];
}
