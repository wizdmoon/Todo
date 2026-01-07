// 실제로는 ORM(Sequelize, TypeORM, Prisma) 스키마가 들어갑니다.
class User {
  constructor(idx, id, name, password, role, createdAt, updatedAt) {
    this.idx = idx;
    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// CommonJS 방식 내보내기
module.exports = User;