class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    let comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const formattedComments = await this._formatCommentsWithLikeCount(comments);
    const formattedReplies = this._formatReplies(replies);

    const commentsWithReplies = this._insertRepliesIntoComments(formattedComments, formattedReplies);

    return {
      ...thread,  
      comments: commentsWithReplies,
    };
  }

  async _formatCommentsWithLikeCount(comments) {
    return Promise.all(
      comments.map(async (comment) => {
        const likeCount = await this._likeRepository.getLikeCountComment({ commentId: comment.id }); 
        return {
          id: comment.id,
          username: comment.username,
          date: new Date(comment.date).toISOString(),
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          likeCount,
          replies: [], // default kosong, nanti diisi oleh _insertRepliesIntoComments
        };
      })
    );
  }

  _formatReplies(replies) {
    return replies.map((reply) => ({
      id: reply.id,
      username: reply.username,
      date: new Date(reply.date).toISOString(),
      comment_id: reply.comment_id,
      content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
    }));
  }

  _insertRepliesIntoComments(comments, replies) {
    return comments.map((comment) => ({
      ...comment,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(({ comment_id, ...rest }) => rest),
    }));
  }
}

module.exports = DetailThreadUseCase;