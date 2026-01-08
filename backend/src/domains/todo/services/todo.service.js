class TodoService {
 constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async createTodo(todoData) {
    const result = await this.todoRepository.create(todoData);
    return result;
  }

  async updateTodo(tidx, todoData) {
    const result = await this.todoRepository.update(tidx, todoData);
    return result;
  }

  async updateState(tidx, todoData) {
    const result = await this.todoRepository.updateState(tidx, todoData);
    return result;
  }

  async deleteTodo(tidx, midx) {
    const result = await this.todoRepository.delete(tidx, midx);
    return result;
  }

  async getTodosByDate(uidx, date) {
      const result = await this.todoRepository.findByDate(uidx, date);
      return result;
  }

  async getFilteredTodos(userIdx, filter) {
  let startDate = null;
  let endDate = null;
  const now = new Date();

  if (filter === 'today') {
    // 오늘의 시작과 끝을 구한 뒤, 날짜 문자열로 변환
    const today = new Date();
    startDate = today.toISOString().split('T')[0]; // "2026-01-07"
    endDate = startDate; 
  } else if (filter === 'yesterday') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() - 1);
    
    startDate = tomorrow.toISOString().split('T')[0];
    endDate = startDate;
  } else if (filter === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    startDate = tomorrow.toISOString().split('T')[0];
    endDate = startDate;
  } else if (filter === 'week') {
    const first = now.getDate() - now.getDay();
    const last = first + 6;
    
    startDate = new Date(now.setDate(first)).toISOString().split('T')[0];
    endDate = new Date(now.setDate(last)).toISOString().split('T')[0];
  } else if (filter === 'all') {
    return await this.todoRepository.findAllByUser(userIdx);
  }

  // 이제 문자열 형태의 "YYYY-MM-DD"가 Repository로 전달됩니다.
  return await this.todoRepository.findByDateRange(userIdx, startDate, endDate);
}

    

}

module.exports = TodoService;