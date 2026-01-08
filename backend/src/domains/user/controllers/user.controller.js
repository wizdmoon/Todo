class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 전체 회원 조회
  // router.get('/', userController.getUsers);
  getUsers = async (req, res) => {
    try {
      // 주입받은 service를 사용
      const user = await this.userService.getAllUsers();
      
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  // 회원 한명 조회
  // router.get('/:idx', userController.getUser);
  getUser = async (req, res) => {
    const {idx} = req.params;
    try {
      // 주입받은 service를 사용
      const user = await this.userService.getUserById(idx);
      
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  // 회원 가입
  // router.post('/' , userController.createUser);
  createUser = async (req, res) => {
    const user = req.body;
    try {
      const result = await this.userService.createUser(user);
      
      return res.status(201).json({ 
        message: "회원가입 성공", 
        data: result 
      });
    } catch (error) {
      // res.status(404).json({ message: error.message });
      if (error.code === '23505') { 
        return res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
      }

      // 그 외 알 수 없는 에러
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  };

  // 로그인
  loginUser = async (req, res) => {
    console.log("로그인 요청")
    const user = req.body;

    try {
      const result = await this.userService.loginUser(user);
      
      if (!result) {
        return res.status(401).json({ 
          message: "아이디 또는 비밀번호가 올바르지 않습니다." 
        });
      }

      console.log(result, "회원이 로그인에 성공했습니다.")

      return res.status(200).json({
        success: true,
        message: "로그인 성공",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false,
        message: "서버 오류가 발생했습니다." });
    }
  }

  // 회원 정보 수정
  // router.put('/:idx' , userController.updateUser);
  updateUser = async (req, res) => {
    const {idx} = req.params;
    const user = req.body;

    try{

      const result = await this.userService.updateUser(idx, user);
      return res.status(200).json({
        message: "회원정보 수정 성공",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 에러" });
    } 
  }

  // 회원 탈퇴
  // router.delete('/:idx' , userController.deleteUser);
  deleteUser = async (req, res) => {
    const {idx} = req.params;
    const user = req.body;

    try {
      const result = await this.userService.deleteUser(idx, user);

      if (!result) {
        return res.status(404).json({ 
          message: "존재하지 않는 회원이거나, 이미 탈퇴처리 되었습니다." 
        });
      }

      return res.status(200).json({ 
        message: "회원 탈퇴가 완료되었습니다." 
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 에러" });
    }
  }

}

module.exports = UserController;