const LikeUnlikeUseCase = require('../../../../Applications/use_case/likes/LikeUnlikeUseCase');
const autoBind = require('auto-bind');

class LikesHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async putLikeUnlikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const likeUnlikeUseCase = this._container.getInstance(LikeUnlikeUseCase.name);

    await likeUnlikeUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;