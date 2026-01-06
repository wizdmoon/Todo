// Redis 클라이언트 불러오기 (캐싱용)
// const redisClient = require('../../../common/config/redis.config');

class MemberService {
  /**
   * [의존성 주입 (Dependency Injection)]
   * 이 서비스가 동작하려면 Repository가 필요합니다.
   * 하지만 내부에서 'new MemberRepository()'를 하지 않고,
   * 생성자를 통해 외부에서 받아옵니다.
   */
  constructor(memberRepository) {
    this.memberRepository = memberRepository;
  }


  // 전체 회원 조회
  async getAllMembers() {
    // // 1. Redis 조회
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   console.log('🚀 Cache Hit!');
    //   return JSON.parse(cachedData);
    // }
    // 2. DB 조회 (Repository 사용)
    const result = await this.memberRepository.findAll();
    if (!result) {
      throw new Error('Member not found');
    }
    return result;
  }

  // 회원 한명 조회
  async getMemberById(idx) {

    const result = await this.memberRepository.findByIdx(idx);
    if (!result) {
      throw new Error('Member not found');
    }
    return result;
  }

  // 회원 가입
  async createMember(member) {
    const result = await this.memberRepository.create(member);
    return result;
  }

  // 로그인
  async loginMember(member) {
    const result = await this.memberRepository.login(member);
    return result;
  }

  // 회원 정보 수정
  async updateMember(idx, member) {
    const result = await this.memberRepository.update(idx, member);
    return result;
  }

  // 회원 탈퇴
  async deleteMember(idx, member) {
    const result = await this.memberRepository.delete(idx, member);
    return result;
  }


}

module.exports = MemberService;