const pool = require('../../../common/config/database.config');

class TodoRepository {

    // Todo 추가
    async create(todoData) {
        const query = 'INSERT INTO todo (u_idx, c_idx, t_name, t_content, target_date) VALUES ($1, $2, $3, $4, $5)';
        const values = [todoData.uidx, todoData.cidx, todoData.tname, todoData.tcontent, todoData.date];

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
        const values = [todoData.tname, todoData.tcontent, todoData.date, tidx, todoData.uidx];

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
        const values = [todoData.state, tidx, todoData.uidx];

        try {
            const result = await pool.query(query, values);
            return result;
        } catch (error) {
            console.error('TodoRepository updateState 에러:', error);
            throw error;
        }
    }

    // Todo 삭제
    async delete(tidx, uidx) {
        const query = 'DELETE FROM todo WHERE t_idx = $1 AND u_idx = $2';
        const values = [tidx, uidx];

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

    // Todo 조회
    async findByDate(uidx, date) {
        const query = 'SELECT * FROM todo WHERE u_idx = $1 AND target_date = $2 ORDER BY created_at ASC';
        const values = [uidx, date];

        try{
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('TodoRepository findByDate 에러:', error);
            throw error;
        }

    }

    async findAllByUser(uidx) {
        const query = `SELECT * FROM todos WHERE u_idx = $1 ORDER BY t_date ASC`;
        const { rows } = await pool.query(query, [uidx]);
        return rows;
    }

    // 특정 날짜 범위 조회 ('today', 'week' 필터용)
    async findByDateRange(uidx, startDate, endDate) {
        const query = `
        SELECT * FROM todo
        WHERE u_idx = $1 AND target_date BETWEEN $2 AND $3
        ORDER BY target_date ASC
        `;
        const { rows } = await pool.query(query, [uidx, startDate, endDate]);
        return rows;
    }

}

// 클래스 정의 후 내보내기
module.exports = TodoRepository;