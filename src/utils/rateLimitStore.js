const loginMap = new Map(); // data: key => value, biến toàn cục sống trong RAM tới khi tắt server

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 1000; // 30 giây
const CAPTCHA_TIME = 30 * 60 * 1000; // 30 phút

/* IMPORTANT FIELD
failed_attempts: số lần nhập sai
last_failed_at: Thời điểm nhập sai gần nhất
lock_until: Có đang bị khóa tạm thời hay không
captcha_required: Có đang cần xác thực capcha hay không
captcha_expire: Khi nào captcha tự động hết hiệu lực
*/

/* OPERATIONS
Gọi rateLimitStore.get() trước khi check password.
Sau khi CompareHash(password, user.password) sai thì gọi recordFailedAttempt().
Sau khi đúng thì gọi clear(). 
*/

/**
 * Lấy trạng thái đăng nhập của người dùng
 * @param {string} key - info_user (email hoặc số điện thoại)
 * @returns {object | undefined}
 */
const get = async (key) => {
  const state = loginMap.get(key);
  if (!state) return undefined;

  const now = Date.now();

  // Nếu quá thời gian CAPTCHA, xóa flag captcha
  if (state.captcha_required && now > state.captcha_expire) {
    state.captcha_required = false;
    delete state.captcha_expire;
  }

  return state;
};

/**
 * Ghi lại 1 lần nhập sai mật khẩu
 * @param {string} key - info_user
 */
const recordFailedAttempt = async (key) => {
  const now = Date.now();
  let entry = loginMap.get(key);

  if (!entry) {
    entry = {
      failed_attempts: 1,
      last_failed_at: now,
      captcha_required: false,
    };
  } else {
    entry.failed_attempts += 1;
    entry.last_failed_at = now;

    if (entry.failed_attempts >= MAX_ATTEMPTS) {
      entry.lock_until = now + LOCK_TIME;
      entry.captcha_required = true;
      entry.captcha_expire = now + CAPTCHA_TIME;
    }
  }

  loginMap.set(key, entry);
};

/**
 * Reset trạng thái login sau khi đăng nhập đúng hoặc timeout
 * @param {string} key - info_user
 */
const clear = async (key) => {
  loginMap.delete(key);
};

export default {
  get,
  recordFailedAttempt,
  clear,
  MAX_ATTEMPTS,
  LOCK_TIME,
  CAPTCHA_TIME,
};
