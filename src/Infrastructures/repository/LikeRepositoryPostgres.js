const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkLikeComment({ commentId, userId }) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount > 0; // return boolean
  }

  async likeComment({ commentId, userId }) {
    const id = `like-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id, date) VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, date],
    };

    await this._pool.query(query);
  }

  async unlikeComment({ commentId, userId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikeCountComment({ commentId }) {
    const query = {
      text: 'SELECT COUNT(*) AS like_count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return Number(result.rows[0].like_count);
  }
}

module.exports = LikeRepositoryPostgres;