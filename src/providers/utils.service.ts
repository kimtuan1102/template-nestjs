import bcrypt from 'bcrypt';

export class UtilsService {
  /**
   * Generate hash from password or string
   * @param password
   * @return{string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  /**
   * Generate random string
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substr(0, length);
  }
  /**
   * Validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }
    return bcrypt.compare(password, hash);
  }
}
