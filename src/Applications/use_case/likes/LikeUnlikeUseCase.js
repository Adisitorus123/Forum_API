class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    
    await this._threadRepository.verifyAvailableThreadById(threadId);
    await this._commentRepository.verifyAvailableCommentById(commentId, threadId);

    const isLiked = await this._likeRepository.checkLikeComment({ commentId, userId });

    if (isLiked) {
      await this._likeRepository.unlikeComment({ commentId, userId });
    } else {
      await this._likeRepository.likeComment({ commentId, userId });
    }

    return { status: 'success' };
  }
}

module.exports = LikeUnlikeUseCase;