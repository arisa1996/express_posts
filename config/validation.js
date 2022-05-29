const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * 取得加密後的密碼
 * @param {string} password 原始密碼
 * @returns {string}
 */
const getEncryptedPassword = async (password) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

/**
 * 驗證密碼是否有效
 * @param {string} password 密碼
 * @param {string} comparedPassword 被比較的密碼
 * @returns {boolean}
 */
const isValidPassword = async (password, comparedPassword) => {
  const valid = await bcrypt.compare(password, comparedPassword);
  return valid;
};

/**
 * Mongoose 的編號是否為有效
 * @param {string} id 編號
 * @returns {boolean}
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * 是否為大於 0 的正整數
 * @param {number|string} value 數值
 * @returns {boolean}
 */
const isPositiveInteger = (value) => !isNaN(value) && parseInt(value) > 0;

module.exports = {
  getEncryptedPassword,
  isValidPassword,
  isValidObjectId,
  isPositiveInteger,
};
