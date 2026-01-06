class CategoryService {
 constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }


  // 전체 카테고리 조회
  async getAllCategories() {
    const result = await this.categoryRepository.findAll();
    if (!result) {
      throw new Error('Member not found');
    }
    return result;
  }

  // 회원 카테고리 목록 조회
  async getCategoryByMIdx(midx) {

    const result = await this.categoryRepository.findByMIdx(midx);
    if (!result) {
      throw new Error('Category not found');
    }
    return result;
  }

  async getCategoryByIdx(midx, cidx) {

    const result = await this.categoryRepository.findByIdx(midx, cidx);
    if (!result) {
      throw new Error('Category not found');
    }
    return result;
  }
  
  // 카테고리 추가
  async createCategory(categoryData) {
    const result = await this.categoryRepository.create(categoryData);
    return result;
  }

  // 카테고리 수정
  async updateCategory(cidx, categoryData) {
    const result = await this.categoryRepository.update(cidx, categoryData);
    return result;
  }

  // 카테고리 삭제
  async deleteCategory(cidx, midx) {
    const result = await this.categoryRepository.delete(cidx, midx);
    return result;
  }
}

module.exports = CategoryService;