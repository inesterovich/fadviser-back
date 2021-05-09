function maskEmail(user) {
  const { email } = user;
  const arrayEmail = email.split('');
  const Aindex = arrayEmail.indexOf('@');
  const dotIndex = arrayEmail.indexOf('.');
  const resultEmail = arrayEmail.map((letter, index) => {
    if ((index > 0 && index < Aindex - 1)
      || (index > Aindex + 1 && index < dotIndex - 1)
    ) {
      return '*';
    }

    return letter;
  });

  user.email = resultEmail.join('');

  return user;
}

module.exports = maskEmail;
