// Redis 클라이언트 불러오기 (캐싱용)
const redisClient = require('../../../common/config/redis.config');
const jwt = require('jsonwebtoken');

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
  // async loginUser(user) {
  //   const result = await this.userRepository.login(user);

  //   if (!result) {
  //     throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  //   }

  //   // 2. 토큰 생성 (Payload에는 식별 가능한 idx나 id 등을 담습니다)
  //   // const payload = { idx: result.idx, id: result.u_id };

  //   // Access Token (유효기간 짧게: 예: 1시간)
  //   // const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  //   // Refresh Token (유효기간 길게: 예: 7일)
  //   // const refreshToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '7d' });

  //   // 3. Redis에 Refresh Token 저장
  //   // Key: `refreshToken:회원IDX`, Value: `토큰문자열`, 옵션: 유효기간(초 단위)
  //   // 7일 = 7 * 24 * 60 * 60 초
  //   // await redisClient.set(
  //   //   `refreshToken:${result.idx}`, 
  //   //   refreshToken, 
  //   //   { EX: 7 * 24 * 60 * 60 } 
  //   // );

  //   return result;

  async loginUser(user) {
    const result = await this.userRepository.login(user);

    if (!result) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // [구현] 토큰 생성
    const payload = { idx: result.idx, id: result.u_id };
    
    // Access Token (짧은 만료: 1시간)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    
    // Refresh Token (긴 만료: 7일)
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    // [구현] Redis에 Refresh Token 저장
    // Key: refreshToken:유저IDX, Value: 토큰값, EX: 만료시간(초)
    await redisClient.set(
      `refreshToken:${result.idx}`, 
      refreshToken, 
      { EX: 7 * 24 * 60 * 60 } // 7일
    );

    // 컨트롤러에게 반환할 데이터 구성
    return {
      accessToken,
      refreshToken,
      user: {
        idx: result.idx,
        name: result.u_name,
        id: result.u_id
      }
    };
  }


    // 4. 컨트롤러에게 토큰과 멤버 정보 반환
    // return {
    //   accessToken,
    //   refreshToken,
    //   user: {
    //     idx: result.idx,
    //     name: result.u_name
    //   }
    // };
  // }


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

  // [구현] 로그아웃
  async logoutMember(idx) {
    // Redis에서 해당 유저의 Refresh Token 삭제
    await redisClient.del(`refreshToken:${idx}`);
    return true;
  }

  // [구현] 토큰 재발급 (Refresh)
  async refreshAccessToken(idx, clientRefreshToken) {
    // 1. Redis에서 저장된 토큰 조회
    const savedRefreshToken = await redisClient.get(`refreshToken:${idx}`);

    // 2. 검증: Redis에 없거나 요청한 토큰과 다르면 에러
    if (!savedRefreshToken || savedRefreshToken !== clientRefreshToken) {
        throw new Error('유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.');
    }

    // 3. 토큰 유효성 검증 (만료 여부 등)
    try {
        jwt.verify(clientRefreshToken, process.env.JWT_SECRET || 'secret');
    } catch (err) {
        throw new Error('Refresh Token이 만료되었습니다.');
    }

    // 4. 새로운 Access Token 발급
    const newAccessToken = jwt.sign({ idx }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    return newAccessToken;
  }



}

module.exports = UserService;