// Redis 클라이언트 불러오기 (캐싱용)
// const redisClient = require('../../../common/config/redis.config');

class UserService {
  /**
   * [의존성 주입 (Dependency Injection)]
   * 이 서비스가 동작하려면 Repository가 필요합니다.
   * 하지만 내부에서 'new UserRepository()'를 하지 않고,
   * 생성자를 통해 외부에서 받아옵니다.
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }


  // 전체 회원 조회
  async getAllUsers() {
    // // 1. Redis 조회
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   console.log('🚀 Cache Hit!');
    //   return JSON.parse(cachedData);
    // }
    // 2. DB 조회 (Repository 사용)
    const result = await this.userRepository.findAll();
    if (!result) {
      throw new Error('User not found');
    }
    return result;
  }

  // 회원 한명 조회
  async getUserById(idx) {

    const result = await this.userRepository.findByIdx(idx);
    if (!result) {
      throw new Error('User not found');
    }
    return result;
  }

  // 회원 가입
  async createUser(user) {
    const result = await this.userRepository.create(user);
    return result;
  }

  // 로그인
  async loginUser(user) {
    const result = await this.userRepository.login(user);
    return result;
  }

  // 회원 정보 수정
  async updateUser(idx, user) {
    const result = await this.userRepository.update(idx, user);
    return result;
  }

  // 회원 탈퇴
  async deleteUser(idx, user) {
    const result = await this.userRepository.delete(idx, user);
    return result;
  }


}

module.exports = UserService;