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

}

module.exports = TodoService;