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

//   // 회원 카테고리 목록 조회
//   async getCategoryByMIdx(midx) {

//     const result = await this.categoryRepository.findByMIdx(midx);
//     if (!result) {
//       throw new Error('Category not found');
//     }
//     return result;
//   }

//   async getCategoryByIdx(midx, cidx) {

//     const result = await this.categoryRepository.findByIdx(midx, cidx);
//     if (!result) {
//       throw new Error('Category not found');
//     }
//     return result;
//   }

}

module.exports = TodoService;