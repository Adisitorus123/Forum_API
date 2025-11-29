const LikeUnlikeUseCase = require('../LikeUnlikeUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');

describe('a LikeUnlikeUseCase use case', () => {
  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentById = jest.fn().mockResolvedValue();
    mockLikeRepository.checkLikeComment = jest.fn().mockResolvedValue(true); // sudah like
    mockLikeRepository.unlikeComment = jest.fn().mockResolvedValue();

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(result).toEqual({ status: 'success' });
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableCommentById).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.unlikeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentById = jest.fn().mockResolvedValue();
    mockLikeRepository.checkLikeComment = jest.fn().mockResolvedValue(false); // belum like
    mockLikeRepository.likeComment = jest.fn().mockResolvedValue();

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(result).toEqual({ status: 'success' });
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableCommentById).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.likeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });
});