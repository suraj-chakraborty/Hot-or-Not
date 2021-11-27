const getMatchedUserInfo = (users, userLoggidIn) => {
  const newUser = { ...users };
  delete newUser[userLoggidIn];

  const [id, user] = Object.entries(newUser).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;
