/* eslint-disable radix */
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {});
    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
    });

    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('checkLikeComment function', () => {
      it('should return true if comment is liked', async () => {
        // arrange
        const payload = { commentId: 'comment-123', userId: 'user-123' };
        await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // action
        const isLiked = await likeRepositoryPostgres.checkLikeComment(payload);

        // assert
        expect(isLiked).toBe(true);
      });

      it('should return false if comment is not liked', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
        const isLiked = await likeRepositoryPostgres.checkLikeComment({ commentId: 'comment-123', userId: 'user-x' });
        expect(isLiked).toBe(false);
      });
    });

    describe('likeComment function', () => {
      it('should add like to comment', async () => {
        const payload = { commentId: 'comment-123', userId: 'user-123' };
        const fakeIdGenerator = () => '123';
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        await likeRepositoryPostgres.likeComment(payload);

        const likes = await LikesTableTestHelper.getLikeById('like-123');
        expect(likes).toHaveLength(1);
        expect(likes[0].comment_id).toEqual('comment-123');
        expect(likes[0].user_id).toEqual('user-123');
      });
    });

    describe('unlikeComment function', () => {
      it('should remove like from comment', async () => {
        const payload = { commentId: 'comment-123', userId: 'user-123' };
        await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        await likeRepositoryPostgres.unlikeComment(payload);

        const likes = await LikesTableTestHelper.getLikeById('like-123');
        expect(likes).toHaveLength(0);
      });
    });

    describe('getLikeCountComment function', () => {
      it('should return like count of a comment', async () => {
        const payload = { commentId: 'comment-123' };
        await UsersTableTestHelper.addUser({ id: 'user-321', username: 'jhon_doe' });
        await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
        await LikesTableTestHelper.addLike({ id: 'like-124', commentId: 'comment-123', userId: 'user-321' });
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const likeCount = await likeRepositoryPostgres.getLikeCountComment(payload);

        expect(likeCount).toEqual(2);
      });
    });
  });
});