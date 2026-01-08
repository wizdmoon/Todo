// 공통 DB 설정을 불러옵니다 (경로 주의: 위로 3칸 올라가야 common에 도달)
const pool = require('../../../common/config/database.config');
const User = require('../models/user.model');

class UserRepository {

  // 전체 회원 조회
  async findAll() {
    const query = 'SELECT * FROM users ORDER BY idx ASC';
    const result = await pool.query(query);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows;
    // DB의 raw 데이터를 모델 객체로 변환해서 반환
    // return new Member(row.idx, row.user_id, row.user_name, row.user_password, row.user_role, row.created_at, row.updated_at);
    return row;
  }

  // 회원 한명 조회
  async findByIdx(idx) {
    const query = 'SELECT * FROM users WHERE idx = $1 ORDER BY idx ASC';
    const result = await pool.query(query, [idx]);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    // DB의 raw 데이터를 모델 객체로 변환해서 반환
    // return new Member(row.idx, row.user_id, row.user_name, row.user_password, row.user_role, row.created_at, row.updated_at);
    return row;
  }

  // 회원 가입
  async create(user) {
    try {
      const query = 'INSERT INTO users (u_id, u_password, u_name) VALUES ($1, $2, $3) RETURNING idx, created_at';
      const values = [user.id, user.password, user.name];
      const result = await pool.query(query, values);
      
      user.idx = result.rows[0].idx;
      user.created_at = result.rows[0].created_at;
      
      return user;
     } catch (error) {
      console.error('UserRepository create 에러:', error);
      throw error;
    }
  }

  // 로그인
  async login(user) {
    try {
      const query = 'SELECT * FROM users WHERE u_id = $1 AND u_password = $2 ORDER BY idx ASC'
      const values = [user.id, user.password];
      const result = await pool.query(query, values);

      return result.rows[0];

    } catch (error) {
      console.error('UserRepository login 에러:', error);
      throw error;
    }
  }

  // 회원 정보 수정
  async update(idx, user) {
    try {
      const query = 'UPDATE users SET u_password = $1, updated_at = NOW() WHERE idx = $2 AND u_id = $3 RETURNING updated_at';
      const values = [user.password, idx, user.id];
      const result = await pool.query(query, values);
      
      user.updated_at = result.rows[0].updated_at;
      
      return user;
    } catch (error) {
      console.error('UserRepository update 에러:', error);
      throw error;
    }
  }

  // 회원 탈퇴
  async delete(idx, user) {
    const query = 'DELETE FROM users WHERE idx = $1 AND u_id = $2';
    const values = [idx, user.id];
    try {
      const result = await pool.query(query, values);

      console.log("result: " , result)
      if (result.rowCount === 0) {
        return false; 
      }
      return true;

    } catch (error) {
      console.error('UserRepository delete 에러:', error);
      throw error;
    }
  }
}

// 클래스 정의 후 내보내기
module.exports = UserRepository;