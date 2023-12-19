fetch('https://dummyjson.com/posts')
  .then(res => res.json())
  .then(data => {
    data.posts.forEach(post => {
      // Default to 0 if 'votes' is not present in the response
      const votes = post.votes !== undefined ? post.votes : 0;
      renderPost({ ...post, votes });
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
    // Update the vote count directly on the client side
    const updatedVotes = post.votes + value;
    updateVoteCount(updatedVotes);

    // You may also want to send a request to a server to persist the vote if needed
  }

  function updateVoteCount(updatedVotes) {
    // Update the vote count on the UI
    voteCount.textContent = `Votes: ${updatedVotes}`;
  }

  voteContainer.appendChild(upvoteButton);
  voteContainer.appendChild(voteCount);
  voteContainer.appendChild(downvoteButton);

  postContainer.appendChild(postTitle);
  postContainer.appendChild(postBody);
  postContainer.appendChild(voteContainer);

  document.body.appendChild(postContainer);
}
