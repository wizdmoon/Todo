const pool = require('../../../common/config/database.config');

class TodoRepository {

    async create(todoData) {
        const query = 'INSERT INTO todo (u_idx, c_idx, t_name, t_content, target_date) VALUES ($1, $2, $3, $4, $5)';
        const values = [todoData.midx, todoData.cidx, todoData.tname, todoData.tcontent, todoData.date];

        try {
            const result = await pool.query(query, values);
            console.log(result);
            return result.rows[0];
        } catch (error) {
            console.log('TodoRepository create 에러: ', error);
            throw error;
        }

    }

    // Todo 수정
    async update(tidx, todoData) {
        const query = 'UPDATE todo SET t_name = $1, t_content = $2, target_date = $3, updated_at = NOW() WHERE t_idx = $4 AND u_idx = $5';
        const values = [todoData.tname, todoData.tcontent, todoData.date, tidx, todoData.midx];

        try {
            const result = await pool.query(query, values);
            return result;
        } catch (error) {
            console.error('CategoryRepository update 에러:', error);
            throw error;
        }
    }

    // Todo 상태 변경
    async updateState(tidx, todoData) {
        const query = 'UPDATE todo SET t_state = $1, updated_at = NOW() WHERE t_idx = $2 AND u_idx = $3';
        const values = [todoData.state, tidx, todoData.midx];

        try {
            const result = await pool.query(query, values);
            return result;
        } catch (error) {
            console.error('TodoRepository updateState 에러:', error);
            throw error;
        }
    }

    // Todo 삭제
    async delete(tidx, midx) {
        const query = 'DELETE FROM todo WHERE t_idx = $1 AND u_idx = $2';
        const values = [tidx, midx];

        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                return false;
            }
            return true;

        } catch (error) {
            console.error('TodoRepository delete 에러:', error);
            throw error;
        }
    }

}

// 클래스 정의 후 내보내기
module.exports = TodoRepository;