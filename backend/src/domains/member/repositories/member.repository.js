// 공통 DB 설정을 불러옵니다 (경로 주의: 위로 3칸 올라가야 common에 도달)
const pool = require('../../../common/config/database.config');
const Member = require('../models/member.model');

class MemberRepository {

  // 전체 회원 조회
  async findAll() {
    const query = 'SELECT * FROM member';
    const result = await pool.query(query);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows;
    // DB의 raw 데이터를 모델 객체로 변환해서 반환
    // return new Member(row.idx, row.member_id, row.member_name, row.member_password, row.member_role, row.created_at, row.updated_at);
    return row;
  }

  // 회원 한명 조회
  async findByIdx(idx) {
    const query = 'SELECT * FROM member WHERE idx = $1';
    const result = await pool.query(query, [idx]);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    // DB의 raw 데이터를 모델 객체로 변환해서 반환
    // return new Member(row.idx, row.member_id, row.member_name, row.member_password, row.member_role, row.created_at, row.updated_at);
    return row;
  }

  // 회원 가입
  async create(member) {
    try {
      const query = 'INSERT INTO member (m_id, m_password, m_name) VALUES ($1, $2, $3) RETURNING idx, created_at';
      const values = [member.id, member.password, member.name];
      const result = await pool.query(query, values);
      
      member.idx = result.rows[0].idx;
      member.created_at = result.rows[0].created_at;
      
      return member;
     } catch (error) {
      console.error('MemberRepository create 에러:', error);
      throw error;
    }
  }

  // 로그인
  async login(member) {
    try {
      const query = 'SELECT * FROM member WHERE m_id = $1 AND m_password = $2'
      const values = [member.id, member.password];
      const result = await pool.query(query, values);

      return result.rows[0];

    } catch (error) {
      console.error('MemberRepository login 에러:', error);
      throw error;
    }
  }

  // 회원 정보 수정
  async update(idx, member) {
    try {
      const query = 'UPDATE member SET m_password = $1, updated_at = NOW() WHERE idx = $2 AND m_id = $3 RETURNING updated_at';
      const values = [member.password, idx, member.id];
      const result = await pool.query(query, values);
      
      member.updated_at = result.rows[0].updated_at;
      
      return member;
    } catch (error) {
      console.error('MemberRepository update 에러:', error);
      throw error;
    }
  }

  // 회원 탈퇴
  async delete(idx, member) {
    const query = 'DELETE FROM member WHERE idx = $1 AND m_id = $2';
    const values = [idx, member.id];
    try {
      const result = await pool.query(query, values);

      console.log("result: " , result)
      if (result.rowCount === 0) {
        return false; 
      }
      return true;

    } catch (error) {
      console.error('MemberRepository delete 에러:', error);
      throw error;
    }
  }
}

// 클래스 정의 후 내보내기
module.exports = MemberRepository;