class UserMailer < ApplicationMailer
  default from: ENV['GMAIL_USERNAME']
  def verification_email(user)
    @user = user
    @url = verify_url(token: @user.verification_token)
    mail(to: @user.email, subject: 'Verify your email address')
  end

  private

  def verify_url(token:)
    "https://track-me-backend-n5qp.onrender.com/users/verify?token=#{CGI.escape(token)}"  # Properly format the token parameter
  end

end
