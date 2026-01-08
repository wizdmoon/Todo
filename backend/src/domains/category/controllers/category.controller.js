class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }
  getCategories = async (req, res) => {
    try {
      const result = await this.categoryService.getAllCategories();
      
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  getCategory = async (req, res) => {
    const {uidx} = req.params;
    try {
      const result = await this.categoryService.getCategoryByUIdx(uidx);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  getOneCatetory = async (req, res) => {
    const {uidx} = req.params;
    const {cidx} = req.params;
    try {
      const result = await this.categoryService.getCategoryByIdx(uidx, cidx);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  createCategory = async (req, res) => {
    const categoryData = req.body;

    try {

      const result = await this.categoryService.createCategory(categoryData);
      return res.status(201).json({ 
        message: "카테고리 추가 성공", 
        data: result 
      });
    } catch (error) {
      // 🔥 여기서 에러 종류에 따라 대응함
    
    if (error.code === '23503') { 
      // 외래키 에러 (m_idx가 member 테이블에 없음)
      return res.status(400).json({ message: '존재하지 않는 회원입니다.' });
    } 
    
    if (error.code === '23502') {
      // NOT NULL 에러 (값이 비어서 옴)
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    // 그 외 예상 못한 에러 (500)
    console.error(error);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
    }
  }

  updateCategory = async (req, res) => {
    const {cidx} = req.params;
    const categoryData = req.body;

    try {
      const result = await this.categoryService.updateCategory(cidx, categoryData);
      return res.status(200).json({
        message: "카테고리 수정 성공",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 에러" });
    } 
  }

  deleteCategory = async (req, res) => {
    const {cidx} = req.params;
    const {uidx} = req.body;

    try {
      const result = await this.categoryService.deleteCategory(cidx, uidx);
            if (!result) {
        return res.status(404).json({ 
          message: "존재하지 않는 카테고리 입니다.." 
        });
      }

      return res.status(200).json({ 
        message: "카테고리 삭제가 완료되었습니다." 
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 에러" });
    }
  }

}

module.exports = CategoryController;