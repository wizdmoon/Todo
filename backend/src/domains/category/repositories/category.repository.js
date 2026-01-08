// 공통 DB 설정을 불러옵니다 (경로 주의: 위로 3칸 올라가야 common에 도달)
const pool = require('../../../common/config/database.config');
// const Member = require('../models/member.model');

class CategoryRepository {

  // 전체 회원 조회
  async findAll() {
    const query = 'SELECT * FROM category ORDER BY c_idx ASC';
    const result = await pool.query(query);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows;

    return row;
  }

  // 회원의 카테고리 목록 조회
  async findByUIdx(uidx) {
    const query = 'SELECT * FROM category WHERE u_idx = $1 ORDER BY c_idx ASC';
    const result = await pool.query(query, [uidx]);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows;
    return row;
  }

  async findByIdx(uidx, cidx) {
    const query = 'SELECT * FROM category WHERE u_idx = $1 AND c_idx = $2 ORDER BY c_idx ASC';
    const values = [uidx, cidx]
    const result = await pool.query(query, values);
    
    // 결과가 없으면 null 반환
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows;
    return row;
  }

  // 카테고리 추가
  async create(categoryData) {
    const query = 'INSERT INTO category (u_idx, c_name) VALUES ($1, $2)';
    const values = [categoryData.uidx, categoryData.cname];

    try {
      const result = await pool.query(query, values);
      console.log(result);
      return result.rows[0];
    } catch (error) {
      console.error('CategoryRepository create 에러:', error);
      throw error;
    }

  }

  // 카테고리 수정
  async update(cidx, categoryData) {
    const query = 'UPDATE category SET c_name = $1, updated_at = NOW() WHERE u_idx = $2 AND c_idx = $3';
    const values = [categoryData.cname, categoryData.uidx, cidx];

    try {
      const result = await pool.query(query, values);
      
      return result;
    } catch (error) {
      console.error('CategoryRepository update 에러:', error);
      throw error;
    }
  }

  // 카테고리 삭제
  async delete(cidx, uidx) {
    const query = 'DELETE FROM category WHERE c_idx = $1 AND u_idx = $2';
    const values = [cidx, uidx];
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return false; 
      }
      return true;

    } catch (error) {
      console.error('CategoryRepository delete 에러:', error);
      throw error;
    }
  }
}

module.exports = CategoryRepository;