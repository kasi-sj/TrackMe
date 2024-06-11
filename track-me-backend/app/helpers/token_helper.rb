module TokenHelper
  def generate_verification_token(user)
    payload = { user_id: user.id, exp: 1.month.from_now.to_i
 }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  def decode_verification_token(token)
    decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
    HashWithIndifferentAccess.new(decoded_token)
  rescue
    nil
  end
end
